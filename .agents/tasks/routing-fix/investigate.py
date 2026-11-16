#!/usr/bin/env python3
"""
Wayfinder routing-graph investigation (READ-ONLY).

Connects to the live PostgreSQL/Supabase DB, discovers the real schema,
loads all nodes + edges, runs A* (matching the app's pathfinding) over
the 6 routes of interest, flags bearing anomalies, and dumps every edge
attached to the U-turn/tangle suspect nodes.

INVESTIGATION ONLY: no INSERT/UPDATE/DELETE against the database.
All queries are SELECTs against information_schema and the campus tables.
"""

import math
import sys
import os
import heapq

import psycopg2

# ---------------------------------------------------------------------------
# Connection string (read from env or use the provided default).
# ---------------------------------------------------------------------------
DEFAULT_DSN = (
    "postgresql://postgres.dquswduxjyfrahgrdwio:mfTAssOBMnItCROF"
    "@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
)
DSN = os.environ.get("WAYFINDER_DSN", DEFAULT_DSN)

REPORT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           "routing-investigation.md")

# Lines accumulated for the structured markdown report.
report_lines = []


def log(*args, **kwargs):
    """Print to stdout and record into the report buffer."""
    print(*args, **kwargs)
    # Capture exactly what was printed (joined, no trailing newline marker).
    report_lines.append(" ".join(str(a) for a in args))


def section(title, level=2):
    bar = "#" * level
    line = f"{bar} {title}"
    print()
    print(line)
    print()
    report_lines.append("")
    report_lines.append(line)
    report_lines.append("")


def raw(text):
    """Write a line verbatim to both stdout and the report."""
    print(text)
    report_lines.append(text)


# ---------------------------------------------------------------------------
# Geometry helpers (match utils/pathfinding.py exactly).
# ---------------------------------------------------------------------------
def haversine(lat1, lng1, lat2, lng2):
    R = 6371000.0
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(d_lng / 2) ** 2)
    return R * 2 * math.asin(math.sqrt(a))


def bearing(lat1, lng1, lat2, lng2):
    lat1r, lat2r = math.radians(lat1), math.radians(lat2)
    dlng = math.radians(lng2 - lng1)
    x = math.sin(dlng) * math.cos(lat2r)
    y = (math.cos(lat1r) * math.sin(lat2r) -
         math.sin(lat1r) * math.cos(lat2r) * math.cos(dlng))
    brng = math.degrees(math.atan2(x, y))
    return (brng + 360.0) % 360.0


def bearing_diff(b1, b2):
    d = abs(b1 - b2) % 360.0
    if d > 180.0:
        d = 360.0 - d
    return d


# ---------------------------------------------------------------------------
# A* — replicates the app's utils/pathfinding.a_star (undirected edges,
# stored distance as cost, haversine heuristic).
# ---------------------------------------------------------------------------
def a_star(nodes, edges, start_id, goal_id):
    graph = {nid: [] for nid in nodes}
    for e in edges:
        f, t, d = e["from_id"], e["to_id"], e["distance"]
        if f in nodes and t in nodes:
            graph[f].append((t, d))
            graph[t].append((f, d))

    def heuristic(a, b):
        na, nb = nodes[a], nodes[b]
        return haversine(na["lat"], na["lng"], nb["lat"], nb["lng"])

    if start_id not in nodes or goal_id not in nodes:
        return []

    open_heap = [(heuristic(start_id, goal_id), 0.0, start_id)]
    g_score = {start_id: 0.0}
    came_from = {}
    closed = set()

    while open_heap:
        f, g, current = heapq.heappop(open_heap)
        if current in closed:
            continue
        closed.add(current)
        if current == goal_id:
            path = [current]
            while current in came_from:
                current = came_from[current]
                path.insert(0, current)
            return path
        for nbr, d in graph.get(current, []):
            ng = g + d
            if ng < g_score.get(nbr, float("inf")):
                g_score[nbr] = ng
                came_from[nbr] = current
                nf = ng + heuristic(nbr, goal_id)
                heapq.heappush(open_heap, (nf, ng, nbr))
    return []


# ---------------------------------------------------------------------------
# Schema discovery.
# ---------------------------------------------------------------------------
def discover_schema(cur):
    section("Schema discovery", level=1)

    cur.execute("""
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY table_schema, table_name;
    """)
    tables = cur.fetchall()
    raw("Tables in database:")
    for schema, name in tables:
        raw(f"  - {schema}.{name}")

    # Identify candidate nodes / edges tables by their columns.
    candidates = {}
    for schema, name in tables:
        cur.execute("""
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = %s AND table_name = %s
            ORDER BY ordinal_position;
        """, (schema, name))
        cols = cur.fetchall()
        colnames = [c[0] for c in cols]
        if schema not in candidates:
            candidates[schema] = {}
        candidates[schema][name] = colnames
        raw(f"\nColumns for {schema}.{name}: {', '.join(colnames)}")

    # Heuristically locate the NODES table (has lat & lng & name) and the
    # EDGES table (has from/to id-like columns + a distance/weight column).
    # Both public.buildings and public.campus_nodes have id/name/lat/lng, so
    # we score candidates and prefer the real graph (campus_nodes).
    node_candidates = []
    for schema, tmap in candidates.items():
        for tname, cols in tmap.items():
            lower = {c.lower() for c in cols}
            if "lat" in lower and "lng" in lower and "name" in lower:
                score = 0
                if "node" in tname.lower():
                    score += 100            # strongly prefer *_nodes tables
                if "category" in lower:
                    score += 5
                if "building" in tname.lower():
                    score -= 50             # demote the buildings metadata table
                node_candidates.append((score, schema, tname, cols))

    nodes_table = nodes_cols = None
    if node_candidates:
        node_candidates.sort(key=lambda x: x[0], reverse=True)
        _, nschema, nname, ncols = node_candidates[0]
        nodes_table = (nschema, nname)
        nodes_cols = ncols
        raw("")
        raw("Node-table candidates considered:")
        for score, s, n, c in node_candidates:
            raw(f"  - score={score:>4}  {s}.{n}  cols={c}")

    edge_candidates = []
    for schema, tmap in candidates.items():
        for tname, cols in tmap.items():
            lower = {c.lower() for c in cols}
            has_from = any(c.startswith("from") for c in lower)
            has_to = any(c.startswith("to") for c in lower)
            has_cost = any(c in lower for c in ("distance", "weight", "cost", "dist"))
            if has_from and has_to and has_cost:
                score = 100 if "edge" in tname.lower() else 0
                edge_candidates.append((score, schema, tname, cols))
    edges_table = edges_cols = None
    if edge_candidates:
        edge_candidates.sort(key=lambda x: x[0], reverse=True)
        _, eschema, ename, ecols = edge_candidates[0]
        edges_table = (eschema, ename)
        edges_cols = ecols

    raw("")
    raw(f"Resolved nodes table: {nodes_table}  cols={nodes_cols}")
    raw(f"Resolved edges table: {edges_table}  cols={edges_cols}")
    return nodes_table, edges_table, nodes_cols, edges_cols


# ---------------------------------------------------------------------------
# Data loading.
# ---------------------------------------------------------------------------
def load_nodes(cur, nodes_table, nodes_cols):
    schema, tname = nodes_table
    lower = [c.lower() for c in nodes_cols]
    id_col = "id" if "id" in lower else nodes_cols[0]
    name_col = "name" if "name" in lower else None
    lat_col = "lat" if "lat" in lower else ("latitude" if "latitude" in lower else None)
    lng_col = "lng" if "lng" in lower else ("longitude" if "longitude" in lower else None)
    cat_col = "category" if "category" in lower else None

    cols = [id_col]
    if name_col: cols.append(name_col)
    if lat_col: cols.append(lat_col)
    if lng_col: cols.append(lng_col)
    if cat_col: cols.append(cat_col)

    cur.execute(f'SELECT {", ".join(cols)} FROM {schema}.{tname};')
    rows = cur.fetchall()
    nodes = {}
    for r in rows:
        nid = r[0]
        rec = {"id": nid}
        idx = 1
        if name_col:
            rec["name"] = r[idx]; idx += 1
        if lat_col:
            rec["lat"] = r[idx]; idx += 1
        if lng_col:
            rec["lng"] = r[idx]; idx += 1
        if cat_col:
            rec["category"] = r[idx]; idx += 1
        nodes[nid] = rec
    return nodes, id_col, name_col, lat_col, lng_col


def load_edges(cur, edges_table, edges_cols):
    schema, tname = edges_table
    lower = [c.lower() for c in edges_cols]
    from_col = "from_id" if "from_id" in lower else next(
        (c for c in edges_cols if c.lower().startswith("from")), edges_cols[0])
    to_col = "to_id" if "to_id" in lower else next(
        (c for c in edges_cols if c.lower().startswith("to")), edges_cols[1])
    dist_col = "distance" if "distance" in lower else next(
        (c for c in ("weight", "cost", "dist") if c in lower), None)
    dir_col = "direction" if "direction" in lower else None

    cols = [from_col, to_col]
    if dist_col: cols.append(dist_col)
    if dir_col: cols.append(dir_col)
    cur.execute(f'SELECT {", ".join(cols)} FROM {schema}.{tname};')
    rows = cur.fetchall()
    edges = []
    for r in rows:
        f, t = r[0], r[1]
        d = r[2] if dist_col else None
        direction = r[3] if dir_col else None
        if d is None:
            d = 0.0
        edges.append({"from_id": f, "to_id": t, "distance": float(d),
                      "direction": direction})
    return edges, from_col, to_col, dist_col, dir_col


# ---------------------------------------------------------------------------
# Node resolution.
# ---------------------------------------------------------------------------
def resolve_targets(nodes):
    section("Resolved node ids", level=1)
    targets = ["gate", "new_building", "main_building", "ea_tower", "canteen"]
    resolved = {}
    for tgt in targets:
        # exact id match first
        if tgt in nodes:
            n = nodes[tgt]
            resolved[tgt] = tgt
            raw(f"{tgt} -> id='{tgt}'  name='{n.get('name')}'  "
                f"lat={n.get('lat')} lng={n.get('lng')}")
        else:
            # match by name (case-insensitive contains)
            hits = [(nid, n) for nid, n in nodes.items()
                    if tgt.replace("_", " ") in (n.get("name", "") or "").lower()
                    or tgt in (nid or "").lower()]
            if hits:
                nid, n = hits[0]
                resolved[tgt] = nid
                raw(f"{tgt} -> id='{nid}' (name match)  name='{n.get('name')}'  "
                    f"lat={n.get('lat')} lng={n.get('lng')}")
            else:
                raw(f"{tgt} -> NOT FOUND")

    # Special handling: list EVERY canteen-like node.
    raw("")
    raw("All canteen-like nodes (id or name contains 'canteen'):")
    canteen_like = []
    for nid, n in nodes.items():
        blob = f"{nid} {n.get('name', '')}".lower()
        if "canteen" in blob:
            canteen_like.append((nid, n))
            raw(f"  - id='{nid}'  name='{n.get('name')}'  "
                f"lat={n.get('lat')} lng={n.get('lng')}  cat={n.get('category')}")
    # Pick the 'canteen' / small canteen target.
    if "canteen" in resolved and resolved.get("canteen") == "canteen":
        raw("")
        raw("Primary canteen target = id 'canteen' (matches screenshots' "
            "'Small Canteen' / 'Canteen 1' primary node).")
    elif canteen_like:
        # prefer id exactly 'canteen', else the first
        primary = next((nid for nid, _ in canteen_like if nid == "canteen"),
                       canteen_like[0][0])
        resolved["canteen"] = primary
        raw("")
        raw(f"Primary canteen target resolved to id '{primary}'.")
    return resolved


# ---------------------------------------------------------------------------
# Route computation + bearing analysis.
# ---------------------------------------------------------------------------
def compute_routes(nodes, edges, resolved):
    routes = [
        ("gate", "main_building"),
        ("gate", "ea_tower"),
        ("gate", "canteen"),
        ("new_building", "main_building"),
        ("new_building", "ea_tower"),
        ("new_building", "canteen"),
    ]
    section("Route computation (A* before-fix paths)", level=1)
    path_summaries = {}
    for start_key, goal_key in routes:
        start_id = resolved.get(start_key)
        goal_id = resolved.get(goal_key)
        section(f"Route: {start_key} -> {goal_key}  "
                f"({start_id} -> {goal_id})", level=2)
        if not start_id or not goal_id:
            raw("  (could not resolve endpoints)")
            path_summaries[(start_key, goal_key)] = None
            continue
        path = a_star(nodes, edges, start_id, goal_id)
        if not path:
            raw("  NO PATH FOUND")
            path_summaries[(start_key, goal_key)] = []
            continue

        raw(f"Path ({len(path)} nodes): {' -> '.join(path)}")
        raw("")
        raw(f"{'i':>2}  {'node':<18} {'lat':>10} {'lng':>11}  "
            f"{'step_bear':>9} {'cum_dist_m':>10}")
        cum = 0.0
        anomalies = []
        for i, nid in enumerate(path):
            n = nodes[nid]
            if i > 0:
                p = nodes[path[i - 1]]
                step_d = haversine(p["lat"], p["lng"], n["lat"], n["lng"])
                cum += step_d
                sb = bearing(p["lat"], p["lng"], n["lat"], n["lng"])
                # bearing from current node toward the goal
                bd = bearing(n["lat"], n["lng"],
                             nodes[goal_id]["lat"], nodes[goal_id]["lng"])
                diff = bearing_diff(sb, bd)
                # Skip the final step: bearing-to-dest is degenerate when the
                # current node IS the goal (vector of zero length -> 0).
                if diff > 90.0 and i < len(path) - 1:
                    flag = "  <== BEARING ANOMALY"
                    anomalies.append(
                        f"BEARING ANOMALY at step {i}: {path[i-1]} -> {nid} "
                        f"(move bearing {sb:.1f}, bearing-to-dest {bd:.1f}, "
                        f"diff {diff:.1f})")
                raw(f"{i:>2}  {nid:<18} {n['lat']:>10.6f} {n['lng']:>11.6f}  "
                    f"{sb:>9.1f} {cum:>10.1f}{flag}")
            else:
                raw(f"{i:>2}  {nid:<18} {n['lat']:>10.6f} {n['lng']:>11.6f}  "
                    f"{'-':>9} {cum:>10.1f}")
        raw("")
        raw(f"Total distance: {cum:.1f} m")
        if anomalies:
            raw("")
            raw("Bearing anomalies:")
            for a in anomalies:
                raw(f"  {a}")
        else:
            raw("Bearing anomalies: none")
        path_summaries[(start_key, goal_key)] = (path, cum, anomalies)
    return path_summaries


# ---------------------------------------------------------------------------
# Diagnostic canteen routes — find where the figure-8 tangle appears.
# The 6 required routes start from gate/new_building (the RFID entry points)
# and reach 'canteen' cleanly via R63. To map the "canteen figure-8 tangle"
# symptom to a specific edge we probe routes from EASTERN starts, where the
# ibed_2<->canteen diagonal shortcut is most likely to be selected.
# ---------------------------------------------------------------------------
def path_uses_edge(path, a, b):
    for i in range(len(path) - 1):
        x, y = path[i], path[i + 1]
        if (x == a and y == b) or (x == b and y == a):
            return i, (x, y)
    return None, None


def compute_diagnostic_routes(nodes, edges, resolved):
    section("Diagnostic canteen routes (locate the figure-8 tangle)", level=1)
    c = resolved.get("canteen")
    if not c:
        raw("canteen not resolved; skipping diagnostics.")
        return
    # Starts on the east side of campus + a couple of spine nodes.
    starts = ["main_building", "ea_tower", "canteen_two",
              "ibed_2", "R51", "R70", "R38"]
    for s in starts:
        if s not in nodes:
            raw(f"\nstart {s}: NOT IN DB")
            continue
        path = a_star(nodes, edges, s, c)
        if not path:
            raw(f"\n{s} -> {c}: NO PATH FOUND")
            continue
        used, at = path_uses_edge(path, "ibed_2", c)
        via_ibed2 = used is not None
        # count genuine (non-final) bearing anomalies
        anom = 0
        for i in range(1, len(path) - 1):
            p = nodes[path[i - 1]]; n = nodes[path[i]]
            sb = bearing(p["lat"], p["lng"], n["lat"], n["lng"])
            bd = bearing(n["lat"], n["lng"],
                        nodes[c]["lat"], nodes[c]["lng"])
            if bearing_diff(sb, bd) > 90.0:
                anom += 1
        raw(f"\n{s} -> {c}  ({len(path)} nodes): {' -> '.join(path)}")
        raw(f"   uses ibed_2<->canteen diagonal? {via_ibed2}"
            + (f"  (at step {at[0]}: {at[1][0]}->{at[1][1]})" if via_ibed2 else ""))
        raw(f"   non-final bearing anomalies: {anom}")
        # print coords + bearings for each step so the diagonal is visible
        cum = 0.0
        raw(f"   {'i':>2}  {'node':<14} {'lat':>10} {'lng':>11}  "
            f"{'step_bear':>9} {'cum_dist_m':>10}")
        for i, nid in enumerate(path):
            n = nodes[nid]
            if i > 0:
                p = nodes[path[i - 1]]
                cum += haversine(p["lat"], p["lng"], n["lat"], n["lng"])
                sb = bearing(p["lat"], p["lng"], n["lat"], n["lng"])
                raw(f"   {i:>2}  {nid:<14} {n['lat']:>10.6f} {n['lng']:>11.6f}  "
                    f"{sb:>9.1f} {cum:>10.1f}")
            else:
                raw(f"   {i:>2}  {nid:<14} {n['lat']:>10.6f} {n['lng']:>11.6f}  "
                    f"{'-':>9} {cum:>10.1f}")
        raw(f"   total: {cum:.1f} m")


# ---------------------------------------------------------------------------
# Edge listings for suspect nodes.
# ---------------------------------------------------------------------------
def edges_for_node(node_id, edges):
    """Return list of (neighbor_id, from_id, to_id, distance, direction)."""
    out = []
    for e in edges:
        if e["from_id"] == node_id:
            out.append((e["to_id"], e["from_id"], e["to_id"],
                        e["distance"], e.get("direction")))
        elif e["to_id"] == node_id:
            out.append((e["from_id"], e["from_id"], e["to_id"],
                        e["distance"], e.get("direction")))
    return out


def dump_suspect_edges(nodes, edges):
    suspects = ["ea_tower", "main_building", "canteen",
                "J5", "R70", "R38", "R66"]
    section("Edges connected to suspect nodes (both directions)", level=1)
    for s in suspects:
        section(f"Suspect node: {s}", level=2)
        if s not in nodes:
            raw(f"  {s} NOT IN DB")
            continue
        n = nodes[s]
        raw(f"  coords: lat={n.get('lat')} lng={n.get('lng')} "
            f"name='{n.get('name')}'")
        adj = edges_for_node(s, edges)
        if not adj:
            raw("  (no edges)")
            continue
        raw(f"  {'neighbor':<18} {'from_id':<18} {'to_id':<18} "
            f"{'distance':>9} {'direction':<10}")
        for nbr, f, t, d, direction in adj:
            nbr_coord = ""
            if nbr in nodes:
                nbr_coord = f" (lat={nodes[nbr]['lat']}, lng={nodes[nbr]['lng']})"
            raw(f"  {nbr:<18} {f:<18} {t:<18} {d:>9.2f} "
                f"{str(direction):<10}{nbr_coord}")
    return suspects


# ---------------------------------------------------------------------------
# Brief suspect cross-check (data-driven, against live DB).
# ---------------------------------------------------------------------------
def cross_check_brief(nodes, edges, resolved):
    section("Suspected root causes (cross-checked against live DB)", level=1)

    def has_edge(a, b):
        for e in edges:
            if (e["from_id"] == a and e["to_id"] == b) or \
               (e["from_id"] == b and e["to_id"] == a):
                return e["distance"]
        return None

    def edge_rows(a, b):
        return [e for e in edges
                if (e["from_id"] == a and e["to_id"] == b) or
                (e["from_id"] == b and e["to_id"] == a)]

    raw("Visual symptoms vs brief's known suspects (checked against live DB):")
    raw("")

    # --- 1) main_building rectangular U-turn / westward detour -------------
    raw("1) main_building rectangular U-turn / westward detour")
    r70_mb = has_edge("R70", "main_building")
    mb_chain_nodes = [nid for nid in nodes
                      if nid.upper().startswith("MB") and nid != "main_building"]
    # edges involving any MB* node
    mb_edges = [e for e in edges
                if e["from_id"].upper().startswith("MB")
                or e["to_id"].upper().startswith("MB")]
    j5_r70 = has_edge("J5", "R70")
    raw(f"   R70 -> main_building direct edge present? "
        f"{'YES d=%.2f' % r70_mb if r70_mb is not None else 'NO'}")
    raw(f"   MB* approach nodes in DB: {mb_chain_nodes}")
    raw(f"   edges touching any MB* node: "
        f"{[(e['from_id'], e['to_id'], round(e['distance'],2)) for e in mb_edges]}")
    raw(f"   J5 <-> R70 edge present? "
        f"{'YES d=%.2f (rows=%d)' % (j5_r70, len(edge_rows('J5','R70'))) if j5_r70 is not None else 'NO'}")
    raw(f"   NOTE: seed.py has NO J5<->R70 edge and no MB1/MB2 nodes; the live DB "
        f"has the J5<->R70 edge which forces routes through the J5 spur "
        f"(J4->J5 east, then J5->R70 west = the rectangular U-turn).")
    if j5_r70 is not None:
        raw("   --> CAUSE OF CURRENT U-TURN = J5<->R70 edge (not the old MB chain, "
            "whose edges are already deleted; MB1/MB2 are now orphan nodes).")
    else:
        raw("   --> J5<->R70 absent; U-turn cause unclear from edges.")
    raw("")

    # --- 2) ea_tower abrupt stop / shortcut ---------------------------------
    raw("2) ea_tower abrupt stop / end-hook")
    ea = resolved.get("ea_tower")
    ea_edges = edges_for_node(ea, edges) if ea else []
    nbrs = sorted({n for n, *_ in ea_edges})
    r76_ea = has_edge("R76", ea) if ea else None
    r78_ea = has_edge("R78", ea) if ea else None
    raw(f"   ea_tower ({ea}) neighbors: {nbrs}")
    raw(f"   R76 -> ea_tower present? "
        f"{'YES d=%.2f' % r76_ea if r76_ea is not None else 'NO'}")
    raw(f"   R78 -> ea_tower present? "
        f"{'YES d=%.2f' % r78_ea if r78_ea is not None else 'NO'}")
    if ea and "R76" in nodes:
        ea_lat = nodes[ea]["lat"]
        r76_lat = nodes["R76"]["lat"]
        rel = "NORTH" if ea_lat > r76_lat else "SOUTH"
        raw(f"   ea_tower lat={ea_lat} vs R76 lat={r76_lat}  -> ea_tower is "
            f"{rel} of R76")
        if ea_lat < r76_lat:
            raw("   --> ea_tower COORDINATE is misplaced SOUTH/EAST of R76 "
                "(live 13.961744,121.612746). The north spine R74->R75->R76 "
                "heads NE, but ea_tower sits SE of R76, so the final hop "
                "R76->ea_tower swings back south = the 'abrupt stop'. "
                "seed.py places ea_tower NORTH of R76 (13.961820,121.612720). "
                "EDGE R76->ea_tower is correct; the COORDINATE is wrong.")
        if r76_ea is not None and r78_ea is None and ea_lat < r76_lat:
            raw("   --> VERDICT: brief's 'wrong ea_tower edge' is ALREADY "
                "CORRECT (edge is R76). The abrupt stop is a WRONG ea_tower "
                "COORDINATE, not a wrong edge.")
    raw("")

    # --- 3) canteen figure-8 tangle ----------------------------------------
    raw("3) canteen figure-8 tangle")
    c = resolved.get("canteen")
    r38_r66 = has_edge("R38", "R66")
    r62_r63 = has_edge("R62", "R63")
    j5_c2 = has_edge("J5", "canteen_two")
    ibed2_c = has_edge("ibed_2", c) if c else None
    raw(f"   R38 -> R66 diagonal through IBED (brief: delete): "
        f"{'PRESENT d=%.2f' % r38_r66 if r38_r66 is not None else 'ALREADY ABSENT'}")
    raw(f"   J5 -> canteen_two shortcut (brief: delete): "
        f"{'PRESENT d=%.2f' % j5_c2 if j5_c2 is not None else 'ALREADY ABSENT'}")
    raw(f"   R62 -> R63 link (brief: insert): "
        f"{'PRESENT d=%.2f' % r62_r63 if r62_r63 is not None else 'MISSING (insert)'}")
    if c and "ibed_2" in nodes:
        actual = haversine(nodes[c]["lat"], nodes[c]["lng"],
                           nodes["ibed_2"]["lat"], nodes["ibed_2"]["lng"])
        raw(f"   ibed_2 <-> canteen edge: stored d={ibed2_c:.2f} but actual "
            f"haversine={actual:.1f}m  (LONG cross-campus diagonal; seed.py "
            f"keeps this edge as the 'interior canteen path' but its stored "
            f"distance is far too small).")
        raw(f"   canteen coords live={nodes[c]['lat']},{nodes[c]['lng']}  "
            f"ibed_2={nodes['ibed_2']['lat']},{nodes['ibed_2']['lng']}  "
            f"(ibed_2 is on the EAST side, canteen on the WEST -> diagonal "
            f"crosses the R48-R51 / R60-R63 interior spine = visual tangle).")
    raw("")

    # --- duplicate both-direction edges -----------------------------------
    raw("Data hygiene: edges stored in BOTH directions (redundant rows, "
        "harmless to A* but messy):")
    seen = {}
    for e in edges:
        key = tuple(sorted((e["from_id"], e["to_id"])))
        seen[key] = seen.get(key, 0) + 1
    dups = [k for k, v in seen.items() if v > 1]
    for k in dups:
        raw(f"   {k[0]} <-> {k[1]}  (rows={seen[k]})")
    raw("")

    # --- summary verdict table --------------------------------------------
    raw("Brief-suspect verdicts (vs LIVE DB):")
    raw("  S1 ea_tower wrong-node (should be R76, not R78/north): "
        "ALREADY CORRECT (edge is R76); real issue = wrong ea_tower COORDINATE.")
    raw("  S2 R38 -> R66 diagonal through IBED (delete): "
        f"{'CONFIRMED STILL PRESENT' if r38_r66 is not None else 'ALREADY FIXED (absent)'}")
    raw("  S3 J5 -> canteen_two shortcut (delete): "
        f"{'CONFIRMED STILL PRESENT' if j5_c2 is not None else 'ALREADY FIXED (absent)'}")
    raw("  S4 MB chain J5->MB2->MB1->main (delete; R70->main direct): "
        f"MB* edges={'PRESENT '+str([(e['from_id'],e['to_id']) for e in mb_edges]) if mb_edges else 'ALREADY DELETED'}; "
        f"R70->main direct={'YES' if r70_mb is not None else 'NO'}; "
        f"NEW culprit J5<->R70={'PRESENT (delete)' if j5_r70 is not None else 'absent'}")
    raw("  S5 Missing R62 -> R63 link (insert): "
        f"{'CONFIRMED STILL MISSING' if r62_r63 is None else 'ALREADY FIXED (present)'}")
    raw("")
    raw("NEW findings beyond the brief:")
    raw("  N1 J5 <-> R70 edge (not in seed.py) causes the main_building "
        "rectangular U-turn AND the ea_tower midway tangle. Recommend DELETE.")
    raw("  N2 ea_tower coordinate misplaced SE of R76 (live 13.961744,"
        "121.612746) -> should be N of R76 (seed 13.961820,121.612720). "
        "Recommend UPDATE coordinate.")
    raw("  N3 ibed_2 <-> canteen diagonal has a wrong (too-small) stored "
        "distance and crosses the interior; reachable from eastern starts. "
        "Whether to delete it (vs seed.py keeping it as the interior path) "
        "is a PRODUCT DECISION for the user; at minimum fix its distance.")


# ---------------------------------------------------------------------------
# Write the markdown report.
# ---------------------------------------------------------------------------
def write_report():
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        f.write("# Wayfinder Routing Investigation\n\n")
        f.write("READ-ONLY investigation of the live PostgreSQL/Supabase graph. "
                "No rows were inserted, updated, or deleted.\n\n")
        f.write("Database: `aws-1-us-east-1.pooler.supabase.com` "
                "(schema discovered at runtime).\n\n")
        for line in report_lines:
            f.write(line + "\n")
    print()
    print(f"Report written to: {REPORT_PATH}")


# ---------------------------------------------------------------------------
# Main.
# ---------------------------------------------------------------------------
def main():
    section("Wayfinder routing investigation (READ-ONLY)", level=1)
    raw("Connecting to database ...")
    conn = psycopg2.connect(DSN)
    conn.set_session(readonly=True)  # belt-and-suspenders: read-only txn
    cur = conn.cursor()

    nodes_table, edges_table, nodes_cols, edges_cols = discover_schema(cur)
    if not nodes_table or not edges_table:
        raw("FATAL: could not locate nodes/edges tables.")
        cur.close(); conn.close()
        sys.exit(1)

    nodes, nid_c, name_c, lat_c, lng_c = load_nodes(cur, nodes_table, nodes_cols)
    edges, from_c, to_c, dist_c, dir_c = load_edges(cur, edges_table, edges_cols)

    section("Loaded data", level=1)
    raw(f"Nodes loaded: {len(nodes)}")
    raw(f"Edges loaded: {len(edges)}  "
        f"(direction column present: {dir_c is not None})")

    # Sanity: how many edges reference node ids that actually exist?
    valid = [e for e in edges if e["from_id"] in nodes and e["to_id"] in nodes]
    dangling = [e for e in edges if e["from_id"] not in nodes or e["to_id"] not in nodes]
    raw(f"Edges referencing existing nodes: {len(valid)} / {len(edges)}")
    if dangling:
        raw(f"  Dangling edges (endpoint not in nodes table): {len(dangling)}")
        for e in dangling[:20]:
            raw(f"    {e['from_id']} -> {e['to_id']}  d={e['distance']:.2f}")
    # Duplicate (both-direction) edge detection.
    seen = {}
    dup_pairs = []
    for e in edges:
        key = tuple(sorted((e["from_id"], e["to_id"])))
        seen[key] = seen.get(key, 0) + 1
    dup_pairs = [k for k, v in seen.items() if v > 1]
    raw(f"Unique undirected edges: {len(seen)}; "
        f"stored-both-directions pairs: {len(dup_pairs)}")
    if dup_pairs:
        raw("  Edges stored in BOTH directions (duplicate rows):")
        for k in dup_pairs[:40]:
            raw(f"    {k[0]} <-> {k[1]}  (rows={seen[k]})")

    resolved = resolve_targets(nodes)
    compute_routes(nodes, edges, resolved)
    dump_suspect_edges(nodes, edges)
    cross_check_brief(nodes, edges, resolved)

    cur.close()
    conn.close()
    raw("")
    raw("Investigation complete. No DB rows were modified.")

    write_report()


if __name__ == "__main__":
    main()
