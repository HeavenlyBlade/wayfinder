# Wayfinder Routing Investigation

READ-ONLY investigation of the live PostgreSQL/Supabase graph. No rows were inserted, updated, or deleted.

Database: `aws-1-us-east-1.pooler.supabase.com` (schema discovered at runtime).


# Wayfinder routing investigation (READ-ONLY)

Connecting to database ...

# Schema discovery

Tables in database:
  - auth.audit_log_entries
  - auth.custom_oauth_providers
  - auth.flow_state
  - auth.identities
  - auth.instances
  - auth.mfa_amr_claims
  - auth.mfa_challenges
  - auth.mfa_factors
  - auth.mfa_recovery_code_sets
  - auth.mfa_recovery_codes
  - auth.oauth_authorizations
  - auth.oauth_client_states
  - auth.oauth_clients
  - auth.oauth_consents
  - auth.one_time_tokens
  - auth.refresh_tokens
  - auth.saml_providers
  - auth.saml_relay_states
  - auth.schema_migrations
  - auth.scim_tokens
  - auth.scim_users
  - auth.sessions
  - auth.sso_domains
  - auth.sso_providers
  - auth.users
  - auth.webauthn_challenges
  - auth.webauthn_credentials
  - extensions.pg_stat_statements
  - extensions.pg_stat_statements_info
  - public.buildings
  - public.campus_edges
  - public.campus_nodes
  - realtime.messages
  - realtime.schema_migrations
  - realtime.subscription
  - storage.buckets
  - storage.buckets_analytics
  - storage.buckets_vectors
  - storage.migrations
  - storage.objects
  - storage.s3_multipart_uploads
  - storage.s3_multipart_uploads_parts
  - storage.vector_indexes
  - vault.decrypted_secrets
  - vault.secrets

Columns for auth.audit_log_entries: instance_id, id, payload, created_at, ip_address

Columns for auth.custom_oauth_providers: id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at, custom_claims_allowlist

Columns for auth.flow_state: id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional

Columns for auth.identities: provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, email, id

Columns for auth.instances: id, uuid, raw_base_config, created_at, updated_at

Columns for auth.mfa_amr_claims: session_id, created_at, updated_at, authentication_method, id

Columns for auth.mfa_challenges: id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data

Columns for auth.mfa_factors: id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data

Columns for auth.mfa_recovery_code_sets: id, user_id, mfa_factor_id, failed_verification_count, verification_locked_until, created_at, updated_at

Columns for auth.mfa_recovery_codes: id, mfa_recovery_code_set_id, code_hash, consumed_at, created_at

Columns for auth.oauth_authorizations: id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce

Columns for auth.oauth_client_states: id, provider_type, code_verifier, created_at

Columns for auth.oauth_clients: id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method

Columns for auth.oauth_consents: id, user_id, client_id, scopes, granted_at, revoked_at

Columns for auth.one_time_tokens: id, user_id, token_type, token_hash, relates_to, created_at, updated_at, expires_at

Columns for auth.refresh_tokens: instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id

Columns for auth.saml_providers: id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format

Columns for auth.saml_relay_states: id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id

Columns for auth.schema_migrations: version

Columns for auth.scim_tokens: id, sso_provider_id, token_hash, prefix, created_at, expires_at, revoked_at, last_used_at

Columns for auth.scim_users: id, sso_provider_id, user_id, resource, user_name, external_id, active, created_at, updated_at, deleted_at

Columns for auth.sessions: id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes

Columns for auth.sso_domains: id, sso_provider_id, domain, created_at, updated_at

Columns for auth.sso_providers: id, resource_id, created_at, updated_at, disabled

Columns for auth.users: instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, confirmed_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous

Columns for auth.webauthn_challenges: id, user_id, challenge_type, session_data, created_at, expires_at

Columns for auth.webauthn_credentials: id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at

Columns for extensions.pg_stat_statements: userid, dbid, toplevel, queryid, query, plans, total_plan_time, min_plan_time, max_plan_time, mean_plan_time, stddev_plan_time, calls, total_exec_time, min_exec_time, max_exec_time, mean_exec_time, stddev_exec_time, rows, shared_blks_hit, shared_blks_read, shared_blks_dirtied, shared_blks_written, local_blks_hit, local_blks_read, local_blks_dirtied, local_blks_written, temp_blks_read, temp_blks_written, shared_blk_read_time, shared_blk_write_time, local_blk_read_time, local_blk_write_time, temp_blk_read_time, temp_blk_write_time, wal_records, wal_fpi, wal_bytes, jit_functions, jit_generation_time, jit_inlining_count, jit_inlining_time, jit_optimization_count, jit_optimization_time, jit_emission_count, jit_emission_time, jit_deform_count, jit_deform_time, stats_since, minmax_stats_since

Columns for extensions.pg_stat_statements_info: dealloc, stats_reset

Columns for public.buildings: id, name, subtitle, icon, lat, lng, facilities, dist_label, eta_label

Columns for public.campus_edges: id, from_id, to_id, distance

Columns for public.campus_nodes: id, name, lat, lng, category

Columns for realtime.messages: topic, extension, payload, event, private, updated_at, inserted_at, id, binary_payload, skip_broadcast

Columns for realtime.schema_migrations: version, inserted_at

Columns for realtime.subscription: id, subscription_id, entity, filters, claims, claims_role, created_at, action_filter, selected_columns

Columns for storage.buckets: id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type, versioning_status, lifecycle_configuration, lifecycle_configuration_generation

Columns for storage.buckets_analytics: name, type, format, created_at, updated_at, id, deleted_at

Columns for storage.buckets_vectors: id, type, created_at, updated_at

Columns for storage.migrations: id, name, hash, executed_at

Columns for storage.objects: id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, path_tokens, version, owner_id, user_metadata, archived_at, is_delete_marker, is_versioned

Columns for storage.s3_multipart_uploads: id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata

Columns for storage.s3_multipart_uploads_parts: id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at

Columns for storage.vector_indexes: id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at

Columns for vault.decrypted_secrets: id, name, description, secret, decrypted_secret, key_id, nonce, created_at, updated_at

Columns for vault.secrets: id, name, description, secret, key_id, nonce, created_at, updated_at

Node-table candidates considered:
  - score= 105  public.campus_nodes  cols=['id', 'name', 'lat', 'lng', 'category']
  - score= -50  public.buildings  cols=['id', 'name', 'subtitle', 'icon', 'lat', 'lng', 'facilities', 'dist_label', 'eta_label']

Resolved nodes table: ('public', 'campus_nodes')  cols=['id', 'name', 'lat', 'lng', 'category']
Resolved edges table: ('public', 'campus_edges')  cols=['id', 'from_id', 'to_id', 'distance']

# Loaded data

Nodes loaded: 87
Edges loaded: 104  (direction column present: False)
Edges referencing existing nodes: 104 / 104
Unique undirected edges: 92; stored-both-directions pairs: 10
  Edges stored in BOTH directions (duplicate rows):
    R63 <-> canteen  (rows=2)
    R22 <-> sr_building_2  (rows=4)
    R15 <-> R37  (rows=2)
    R37 <-> R38  (rows=2)
    canteen <-> ibed_2  (rows=2)
    R76 <-> ea_tower  (rows=2)
    R70 <-> main_building  (rows=2)
    R62 <-> R63  (rows=2)
    R47 <-> new_building  (rows=2)
    J5 <-> R70  (rows=2)

# Resolved node ids

gate -> id='gate'  name='Main Gate'  lat=13.9609 lng=121.6114
new_building -> id='new_building'  name='New Building'  lat=13.9613 lng=121.6121
main_building -> id='main_building'  name='Main Building'  lat=13.9617 lng=121.6124
ea_tower -> id='ea_tower'  name='EA Tower Hall'  lat=13.961744 lng=121.612746
canteen -> id='canteen'  name='Big Canteen'  lat=13.9614 lng=121.6119

All canteen-like nodes (id or name contains 'canteen'):
  - id='canteen'  name='Big Canteen'  lat=13.9614 lng=121.6119  cat=building
  - id='canteen_two'  name='Canteen Two'  lat=13.9617 lng=121.6128  cat=building

Primary canteen target = id 'canteen' (matches screenshots' 'Small Canteen' / 'Canteen 1' primary node).

# Route computation (A* before-fix paths)


## Route: gate -> main_building  (gate -> main_building)

Path (21 nodes): gate -> R01 -> R02 -> R03 -> R04 -> R05 -> R07 -> R08 -> R09 -> R10 -> R11 -> R12 -> R13 -> R14 -> R15 -> R37 -> R38 -> J4 -> J5 -> R70 -> main_building

 i  node                      lat         lng  step_bear cum_dist_m
 0  gate                13.960900  121.611400          -        0.0
 1  R01                 13.960943  121.611350      311.5        7.2  <== BEARING ANOMALY
 2  R02                 13.961004  121.611368       16.0       14.3
 3  R03                 13.961056  121.611389       21.4       20.5
 4  R04                 13.961089  121.611411       32.9       24.8
 5  R05                 13.961127  121.611440       36.5       30.1
 6  R07                 13.961194  121.611535       54.0       42.8
 7  R08                 13.961191  121.611605       92.5       50.3
 8  R09                 13.961191  121.611668       90.0       57.1
 9  R10                 13.961189  121.611735       91.8       64.4
10  R11                 13.961189  121.611803       90.0       71.7
11  R12                 13.961187  121.611890       91.4       81.1
12  R13                 13.961185  121.611947       92.1       87.3
13  R14                 13.961187  121.612017       88.3       94.8
14  R15                 13.961185  121.612079       91.9      101.5
15  R37                 13.961224  121.612080        1.4      105.8
16  R38                 13.961301  121.612075      356.4      114.4
17  J4                  13.961600  121.612100        4.6      147.8
18  J5                  13.961600  121.612600       90.0      201.7  <== BEARING ANOMALY
19  R70                 13.961588  121.612393      266.6      224.1  <== BEARING ANOMALY
20  main_building       13.961700  121.612400        3.5      236.6

Total distance: 236.6 m

Bearing anomalies:
  BEARING ANOMALY at step 1: gate -> R01 (move bearing 311.5, bearing-to-dest 53.4, diff 101.8)
  BEARING ANOMALY at step 18: J4 -> J5 (move bearing 90.0, bearing-to-dest 297.3, diff 152.7)
  BEARING ANOMALY at step 19: J5 -> R70 (move bearing 266.6, bearing-to-dest 3.5, diff 96.9)

## Route: gate -> ea_tower  (gate -> ea_tower)

Path (27 nodes): gate -> R01 -> R02 -> R03 -> R04 -> R05 -> R07 -> R08 -> R09 -> R10 -> R11 -> R12 -> R13 -> R14 -> R15 -> R37 -> R38 -> J4 -> J5 -> R70 -> R71 -> R72 -> R73 -> R74 -> R75 -> R76 -> ea_tower

 i  node                      lat         lng  step_bear cum_dist_m
 0  gate                13.960900  121.611400          -        0.0
 1  R01                 13.960943  121.611350      311.5        7.2  <== BEARING ANOMALY
 2  R02                 13.961004  121.611368       16.0       14.3
 3  R03                 13.961056  121.611389       21.4       20.5
 4  R04                 13.961089  121.611411       32.9       24.8
 5  R05                 13.961127  121.611440       36.5       30.1
 6  R07                 13.961194  121.611535       54.0       42.8
 7  R08                 13.961191  121.611605       92.5       50.3
 8  R09                 13.961191  121.611668       90.0       57.1
 9  R10                 13.961189  121.611735       91.8       64.4
10  R11                 13.961189  121.611803       90.0       71.7
11  R12                 13.961187  121.611890       91.4       81.1
12  R13                 13.961185  121.611947       92.1       87.3
13  R14                 13.961187  121.612017       88.3       94.8
14  R15                 13.961185  121.612079       91.9      101.5
15  R37                 13.961224  121.612080        1.4      105.8
16  R38                 13.961301  121.612075      356.4      114.4
17  J4                  13.961600  121.612100        4.6      147.8
18  J5                  13.961600  121.612600       90.0      201.7
19  R70                 13.961588  121.612393      266.6      224.1  <== BEARING ANOMALY
20  R71                 13.961592  121.612469       86.9      232.3
21  R72                 13.961607  121.612537       77.2      239.8
22  R73                 13.961635  121.612631       72.9      250.5
23  R74                 13.961686  121.612672       38.0      257.7
24  R75                 13.961732  121.612685       15.3      263.0
25  R76                 13.961780  121.612697       13.6      268.4  <== BEARING ANOMALY
26  ea_tower            13.961744  121.612746      127.1      275.1  <== BEARING ANOMALY

Total distance: 275.1 m

Bearing anomalies:
  BEARING ANOMALY at step 1: gate -> R01 (move bearing 311.5, bearing-to-dest 59.4, diff 107.9)
  BEARING ANOMALY at step 19: J5 -> R70 (move bearing 266.6, bearing-to-dest 65.5, diff 158.9)
  BEARING ANOMALY at step 25: R75 -> R76 (move bearing 13.6, bearing-to-dest 127.1, diff 113.5)
  BEARING ANOMALY at step 26: R76 -> ea_tower (move bearing 127.1, bearing-to-dest 0.0, diff 127.1)

## Route: gate -> canteen  (gate -> canteen)

Path (27 nodes): gate -> R01 -> R02 -> R03 -> R04 -> R05 -> R07 -> R08 -> R09 -> R10 -> R11 -> R12 -> R13 -> R14 -> R15 -> R37 -> R38 -> R47 -> R48 -> R49 -> R50 -> R51 -> R60 -> R61 -> R62 -> R63 -> canteen

 i  node                      lat         lng  step_bear cum_dist_m
 0  gate                13.960900  121.611400          -        0.0
 1  R01                 13.960943  121.611350      311.5        7.2  <== BEARING ANOMALY
 2  R02                 13.961004  121.611368       16.0       14.3
 3  R03                 13.961056  121.611389       21.4       20.5
 4  R04                 13.961089  121.611411       32.9       24.8
 5  R05                 13.961127  121.611440       36.5       30.1
 6  R07                 13.961194  121.611535       54.0       42.8
 7  R08                 13.961191  121.611605       92.5       50.3
 8  R09                 13.961191  121.611668       90.0       57.1
 9  R10                 13.961189  121.611735       91.8       64.4
10  R11                 13.961189  121.611803       90.0       71.7
11  R12                 13.961187  121.611890       91.4       81.1
12  R13                 13.961185  121.611947       92.1       87.3  <== BEARING ANOMALY
13  R14                 13.961187  121.612017       88.3       94.8  <== BEARING ANOMALY
14  R15                 13.961185  121.612079       91.9      101.5  <== BEARING ANOMALY
15  R37                 13.961224  121.612080        1.4      105.8
16  R38                 13.961301  121.612075      356.4      114.4
17  R47                 13.961350  121.612069      353.2      119.9
18  R48                 13.961439  121.612069        0.0      129.8  <== BEARING ANOMALY
19  R49                 13.961496  121.612067      358.0      136.1  <== BEARING ANOMALY
20  R50                 13.961555  121.612068        0.9      142.7  <== BEARING ANOMALY
21  R51                 13.961596  121.612076       10.7      147.3  <== BEARING ANOMALY
22  R60                 13.961598  121.612011      271.8      154.4
23  R61                 13.961591  121.611942      264.0      161.9
24  R62                 13.961573  121.611896      248.0      167.2
25  R63                 13.961559  121.611866      244.3      170.8
26  canteen             13.961400  121.611900      168.3      188.9  <== BEARING ANOMALY

Total distance: 188.9 m

Bearing anomalies:
  BEARING ANOMALY at step 1: gate -> R01 (move bearing 311.5, bearing-to-dest 49.4, diff 97.9)
  BEARING ANOMALY at step 12: R12 -> R13 (move bearing 92.1, bearing-to-dest 348.0, diff 104.0)
  BEARING ANOMALY at step 13: R13 -> R14 (move bearing 88.3, bearing-to-dest 331.9, diff 116.4)
  BEARING ANOMALY at step 14: R14 -> R15 (move bearing 91.9, bearing-to-dest 321.1, diff 130.8)
  BEARING ANOMALY at step 18: R47 -> R48 (move bearing 0.0, bearing-to-dest 256.6, diff 103.4)
  BEARING ANOMALY at step 19: R48 -> R49 (move bearing 358.0, bearing-to-dest 239.4, diff 118.7)
  BEARING ANOMALY at step 20: R49 -> R50 (move bearing 0.9, bearing-to-dest 226.4, diff 134.5)
  BEARING ANOMALY at step 21: R50 -> R51 (move bearing 10.7, bearing-to-dest 221.1, diff 149.7)
  BEARING ANOMALY at step 26: R63 -> canteen (move bearing 168.3, bearing-to-dest 0.0, diff 168.3)

## Route: new_building -> main_building  (new_building -> main_building)

Path (6 nodes): new_building -> R38 -> J4 -> J5 -> R70 -> main_building

 i  node                      lat         lng  step_bear cum_dist_m
 0  new_building        13.961300  121.612100          -        0.0
 1  R38                 13.961301  121.612075      272.4        2.7  <== BEARING ANOMALY
 2  J4                  13.961600  121.612100        4.6       36.1
 3  J5                  13.961600  121.612600       90.0       90.0  <== BEARING ANOMALY
 4  R70                 13.961588  121.612393      266.6      112.4  <== BEARING ANOMALY
 5  main_building       13.961700  121.612400        3.5      124.9

Total distance: 124.9 m

Bearing anomalies:
  BEARING ANOMALY at step 1: new_building -> R38 (move bearing 272.4, bearing-to-dest 38.3, diff 126.0)
  BEARING ANOMALY at step 3: J4 -> J5 (move bearing 90.0, bearing-to-dest 297.3, diff 152.7)
  BEARING ANOMALY at step 4: J5 -> R70 (move bearing 266.6, bearing-to-dest 3.5, diff 96.9)

## Route: new_building -> ea_tower  (new_building -> ea_tower)

Path (12 nodes): new_building -> R38 -> J4 -> J5 -> R70 -> R71 -> R72 -> R73 -> R74 -> R75 -> R76 -> ea_tower

 i  node                      lat         lng  step_bear cum_dist_m
 0  new_building        13.961300  121.612100          -        0.0
 1  R38                 13.961301  121.612075      272.4        2.7  <== BEARING ANOMALY
 2  J4                  13.961600  121.612100        4.6       36.1
 3  J5                  13.961600  121.612600       90.0       90.0
 4  R70                 13.961588  121.612393      266.6      112.4  <== BEARING ANOMALY
 5  R71                 13.961592  121.612469       86.9      120.6
 6  R72                 13.961607  121.612537       77.2      128.1
 7  R73                 13.961635  121.612631       72.9      138.7
 8  R74                 13.961686  121.612672       38.0      145.9
 9  R75                 13.961732  121.612685       15.3      151.2
10  R76                 13.961780  121.612697       13.6      156.7  <== BEARING ANOMALY
11  ea_tower            13.961744  121.612746      127.1      163.4  <== BEARING ANOMALY

Total distance: 163.4 m

Bearing anomalies:
  BEARING ANOMALY at step 1: new_building -> R38 (move bearing 272.4, bearing-to-dest 55.8, diff 143.4)
  BEARING ANOMALY at step 4: J5 -> R70 (move bearing 266.6, bearing-to-dest 65.5, diff 158.9)
  BEARING ANOMALY at step 10: R75 -> R76 (move bearing 13.6, bearing-to-dest 127.1, diff 113.5)
  BEARING ANOMALY at step 11: R76 -> ea_tower (move bearing 127.1, bearing-to-dest 0.0, diff 127.1)

## Route: new_building -> canteen  (new_building -> canteen)

Path (11 nodes): new_building -> R47 -> R48 -> R49 -> R50 -> R51 -> R60 -> R61 -> R62 -> R63 -> canteen

 i  node                      lat         lng  step_bear cum_dist_m
 0  new_building        13.961300  121.612100          -        0.0
 1  R47                 13.961350  121.612069      329.0        6.5
 2  R48                 13.961439  121.612069        0.0       16.4  <== BEARING ANOMALY
 3  R49                 13.961496  121.612067      358.0       22.7  <== BEARING ANOMALY
 4  R50                 13.961555  121.612068        0.9       29.3  <== BEARING ANOMALY
 5  R51                 13.961596  121.612076       10.7       33.9  <== BEARING ANOMALY
 6  R60                 13.961598  121.612011      271.8       40.9
 7  R61                 13.961591  121.611942      264.0       48.4
 8  R62                 13.961573  121.611896      248.0       53.8
 9  R63                 13.961559  121.611866      244.3       57.4
10  canteen             13.961400  121.611900      168.3       75.4  <== BEARING ANOMALY

Total distance: 75.4 m

Bearing anomalies:
  BEARING ANOMALY at step 2: R47 -> R48 (move bearing 0.0, bearing-to-dest 256.6, diff 103.4)
  BEARING ANOMALY at step 3: R48 -> R49 (move bearing 358.0, bearing-to-dest 239.4, diff 118.7)
  BEARING ANOMALY at step 4: R49 -> R50 (move bearing 0.9, bearing-to-dest 226.4, diff 134.5)
  BEARING ANOMALY at step 5: R50 -> R51 (move bearing 10.7, bearing-to-dest 221.1, diff 149.7)
  BEARING ANOMALY at step 10: R63 -> canteen (move bearing 168.3, bearing-to-dest 0.0, diff 168.3)

# Edges connected to suspect nodes (both directions)


## Suspect node: ea_tower

  coords: lat=13.961744 lng=121.612746 name='EA Tower Hall'
  neighbor           from_id            to_id               distance direction 
  R76                R76                ea_tower                6.63 None       (lat=13.96178, lng=121.612697)
  R76                ea_tower           R76                     6.63 None       (lat=13.96178, lng=121.612697)

## Suspect node: main_building

  coords: lat=13.9617 lng=121.6124 name='Main Building'
  neighbor           from_id            to_id               distance direction 
  R70                R70                main_building          12.48 None       (lat=13.961588, lng=121.612393)
  R70                main_building      R70                    12.48 None       (lat=13.961588, lng=121.612393)

## Suspect node: canteen

  coords: lat=13.9614 lng=121.6119 name='Big Canteen'
  neighbor           from_id            to_id               distance direction 
  R63                canteen            R63                    18.06 None       (lat=13.961559, lng=121.611866)
  ibed_2             ibed_2             canteen                18.06 None       (lat=13.961546, lng=121.612393)
  ibed_2             canteen            ibed_2                 18.06 None       (lat=13.961546, lng=121.612393)
  R63                R63                canteen                18.06 None       (lat=13.961559, lng=121.611866)

## Suspect node: J5

  coords: lat=13.9616 lng=121.6126 name='Junction J5'
  neighbor           from_id            to_id               distance direction 
  J4                 J4                 J5                     53.95 None       (lat=13.9616, lng=121.6121)
  sr_building        J5                 sr_building             9.06 None       (lat=13.96153, lng=121.612643)
  J7                 J5                 J7                     91.54 None       (lat=13.9624, lng=121.6128)
  R70                J5                 R70                    22.38 None       (lat=13.961588, lng=121.612393)
  R70                R70                J5                     22.38 None       (lat=13.961588, lng=121.612393)

## Suspect node: R70

  coords: lat=13.961588 lng=121.612393 name='Road R70'
  neighbor           from_id            to_id               distance direction 
  R69                R69                R70                     5.94 None       (lat=13.961586, lng=121.612338)
  R71                R70                R71                     8.21 None       (lat=13.961592, lng=121.612469)
  main_building      R70                main_building          12.48 None       (lat=13.9617, lng=121.6124)
  main_building      main_building      R70                    12.48 None       (lat=13.9617, lng=121.6124)
  J5                 J5                 R70                    22.38 None       (lat=13.9616, lng=121.6126)
  J5                 R70                J5                     22.38 None       (lat=13.9616, lng=121.6126)

## Suspect node: R38

  coords: lat=13.961301 lng=121.612075 name='Road R38'
  neighbor           from_id            to_id               distance direction 
  new_building       new_building       R38                     2.70 None       (lat=13.9613, lng=121.6121)
  R47                R38                R47                     5.49 None       (lat=13.96135, lng=121.612069)
  J4                 R38                J4                     33.36 None       (lat=13.9616, lng=121.6121)
  R37                R37                R38                     8.50 None       (lat=13.961224, lng=121.61208)
  R37                R38                R37                     8.50 None       (lat=13.961224, lng=121.61208)

## Suspect node: R66

  coords: lat=13.961592 lng=121.612153 name='Road R66'
  neighbor           from_id            to_id               distance direction 
  R63                R63                R66                    31.19 None       (lat=13.961559, lng=121.611866)
  engineering        R66                engineering             8.79 None       (lat=13.961637, lng=121.61222)
  R67                R66                R67                     6.16 None       (lat=13.961589, lng=121.61221)

# Suspected root causes (cross-checked against live DB)

Visual symptoms vs brief's known suspects:

1) main_building rectangular U-turn / westward detour
   main_building neighbors: ['R70', 'R70']
   R70 -> main_building direct edge present? YES d=12.48
   MB* approach nodes found in DB: ['MB1', 'MB2']
   J5->MB*/MB*->main_building chain edges: []
   J5 -> main_building direct? NO
   --> CONFIRMED WRONG: MB chain / wrong main_building hookup still present.

2) ea_tower abrupt stop / shortcut
   ea_tower (ea_tower) neighbors: [('R76', 6.63), ('R76', 6.63)]
   R76 -> ea_tower present? YES d=6.63
   R78 -> ea_tower present? NO
   ea_tower neighbors NORTH of ea_tower (lat>13.961744): [('R76', 13.96178), ('R76', 13.96178)]
   --> CONFIRMED WRONG: ea_tower connects northward (R78 or lat>ea_tower). Should be R76.
   coords: ea_tower=13.961744,121.612746  R76=13.96178,121.612697  R77=13.96187,121.612718  R78=13.961927,121.612731
   dist ea_tower->R76=6.6m  ea_tower->R78=20.4m

3) canteen figure-8 tangle
   R38 -> R66 diagonal edge present? NO
   R62 -> R63 link present? YES d=3.59
   J5 -> canteen_two shortcut present? NO
   canteen (canteen) neighbors: [('R63', 18.06), ('ibed_2', 18.06), ('ibed_2', 18.06), ('R63', 18.06)]

Brief suspect verdicts:
  - ea_tower wrong-node (should be R76, not R78/north): CONFIRMED WRONG
  - R38 -> R66 diagonal through IBED (delete): ALREADY ABSENT
  - J5 -> canteen_two shortcut (delete): ALREADY ABSENT
  - MB chain J5->MB2->MB1->main_building (delete; R70->main direct): CONFIRMED PRESENT (delete + ensure R70->main)
  - Missing R62 -> R63 link (insert): ALREADY PRESENT

Investigation complete. No DB rows were modified.
