// ─────────────────────────────────────────────────────────────────────────────
// WAYFINDER — Translations (i18n)
// Supported languages: "en" (English), "fil" (Filipino)
//
// Usage:
//   import { t } from '../constants/i18n';
//   const label = t('settings.arMode', language);
// ─────────────────────────────────────────────────────────────────────────────

const TRANSLATIONS = {
  en: {
    // ── Settings ──────────────────────────────────────────────────────────────
    'settings.title':              'Settings',
    'settings.navigation':         'NAVIGATION',
    'settings.arMode':             'AR Mode',
    'settings.arMode.sub':         'Launch AR camera when navigating',
    'settings.gpsTracking':        'GPS Tracking',
    'settings.gpsTracking.sub':    'Show live location dot on map',
    'settings.assistant':          'AI ASSISTANT',
    'settings.offlineMode':        'Offline Mode',
    'settings.offlineMode.sub':    'ON = always offline  |  OFF = auto-detect',
    'settings.app':                'APP',
    'settings.language':           'Language',
    'settings.language.sub':       'English / Filipino',
    'settings.about':              'About WAYFINDER',
    'settings.about.sub':          'Version 1.0.0',
    'settings.devTools':           'DEV TOOLS',
    'settings.surveyTool':         'GPS Survey Tool',
    'settings.surveyTool.sub':     'Record campus coordinates',
    'settings.tutorial':           'Show App Tutorial',
    'settings.tutorial.sub':       'Replay the first-launch guide',
    'settings.tutorial.title':     'Replay Tutorial',
    'settings.tutorial.body':      'This will show the tutorial guide next time you open the Home screen.',
    'settings.tutorial.reset':     'Reset',
    'settings.tutorial.done':      'Done',
    'settings.tutorial.doneMsg':   'Tutorial will appear on your next visit to Home.',
    'settings.status':             'CURRENT STATUS',
    'settings.status.offline':     'OFFLINE',
    'settings.status.auto':        'AUTO',
    'settings.status.on':          'ON',
    'settings.status.off':         'OFF',

    // ── Language picker ───────────────────────────────────────────────────────
    'lang.english':   'English',
    'lang.filipino':  'Filipino',
    'lang.selectTitle': 'Select Language',

    // ── Home screen ───────────────────────────────────────────────────────────
    'home.search':        'Where do you want to go?',
    'home.openMap':       'Open Campus Map',
    'home.openMap.sub':   'Tap to start navigating →',
    'home.quickDest':     'QUICK DESTINATIONS',
    'home.away':          'away',

    // ── AR screen ─────────────────────────────────────────────────────────────
    'ar.gpsAcquiring':    'Acquiring GPS signal…',
    'ar.plotting':        'Plotting AR path…',
    'ar.pointAhead':      'Point your camera ahead and wait',
    'ar.arrived':         'You have arrived!',
    'ar.arrivedSub':      'You are near',
    'ar.backToMap':       '← Back to Map',
    'ar.distLabel':       'm away',
    'ar.indoor.title':    'You are inside a building',
    'ar.indoor.body':     'AR navigation is for outdoor use. You are currently inside',
    'ar.indoor.dismiss':  'Got it',

    // ── Arrival prompt / indoor guidance ─────────────────────────────────────
    'arrival.title':          'You have arrived at',
    'arrival.whatLooking':    'What are you looking for?',
    'arrival.searchHint':     'Search rooms, offices, labs…',
    'arrival.whichFloor':     'Which floor are you on?',
    'arrival.directions':     'Directions',
    'arrival.notFound':       "We don't have directions for that room yet. Please ask at the nearest office.",
    'arrival.noData':         'Indoor directions for this building are not yet available.',
    'arrival.back':           '← Back',
    'arrival.close':          'Close',
    'arrival.gf':             'Ground Floor',
    'arrival.1f':             '1st Floor',
    'arrival.2f':             '2nd Floor',
    'arrival.3f':             '3rd Floor',
    'arrival.4f':             '4th Floor',

    // ── Staircase picker ──────────────────────────────────────────────────────
    'staircase.title':    "Which stairs is closest to you?",
    'staircase.sub':      'This helps us give you the right directions.',
    'staircase.stair1':   'Staircase 1',
    'staircase.stair2':   'Staircase 2',
    'staircase.front':    'Front Entrance',
    'staircase.back':     '2nd Entrance',

    // ── Map screen ────────────────────────────────────────────────────────────
    'map.navigate':       'Navigate Here',
    'map.viewFloors':     'View Floors',
    'map.close':          'Close',
    'map.searchHint':     'Search buildings, rooms…',

    // ── Status chips ──────────────────────────────────────────────────────────
    'status.gpsActive':   'GPS Active',
    'status.aiReady':     'AI Ready',
    'status.aiOnline':    'AI Online',
    'status.noInternet':  'No Internet',
    'status.offlineMode': 'Offline Mode',
    'status.arStandby':   'AR Standby',

    // ── Tutorial ──────────────────────────────────────────────────────────────
    'tutorial.skip':      'Skip',
    'tutorial.next':      'Next →',
    'tutorial.gotIt':     'Got it!',
    'tutorial.back':      '← Back',
    'tutorial.of':        'of',
  },

  fil: {
    // ── Settings ──────────────────────────────────────────────────────────────
    'settings.title':              'Mga Setting',
    'settings.navigation':         'NABIGASYON',
    'settings.arMode':             'AR Mode',
    'settings.arMode.sub':         'Buksan ang AR camera habang nag-navigate',
    'settings.gpsTracking':        'GPS Tracking',
    'settings.gpsTracking.sub':    'Ipakita ang live na lokasyon sa mapa',
    'settings.assistant':          'AI ASSISTANT',
    'settings.offlineMode':        'Offline Mode',
    'settings.offlineMode.sub':    'ON = palaging offline  |  OFF = auto-detect',
    'settings.app':                'APP',
    'settings.language':           'Wika',
    'settings.language.sub':       'Ingles / Filipino',
    'settings.about':              'Tungkol sa WAYFINDER',
    'settings.about.sub':          'Bersyon 1.0.0',
    'settings.devTools':           'DEV TOOLS',
    'settings.surveyTool':         'GPS Survey Tool',
    'settings.surveyTool.sub':     'I-record ang mga koordinasyon sa campus',
    'settings.tutorial':           'Ipakita ang Tutorial',
    'settings.tutorial.sub':       'Ulitin ang gabay sa unang paglunsad',
    'settings.tutorial.title':     'Ulitin ang Tutorial',
    'settings.tutorial.body':      'Ipapakita ang tutorial sa susunod na pagbukas ng Home screen.',
    'settings.tutorial.reset':     'I-reset',
    'settings.tutorial.done':      'Tapos na',
    'settings.tutorial.doneMsg':   'Lilitaw ang tutorial sa susunod na pagbisita sa Home.',
    'settings.status':             'KASALUKUYANG STATUS',
    'settings.status.offline':     'OFFLINE',
    'settings.status.auto':        'AUTO',
    'settings.status.on':          'BUKAS',
    'settings.status.off':         'SARADO',

    // ── Language picker ───────────────────────────────────────────────────────
    'lang.english':   'Ingles',
    'lang.filipino':  'Filipino',
    'lang.selectTitle': 'Pumili ng Wika',

    // ── Home screen ───────────────────────────────────────────────────────────
    'home.search':        'Saan ka pupunta?',
    'home.openMap':       'Buksan ang Campus Map',
    'home.openMap.sub':   'Pindutin para magsimula →',
    'home.quickDest':     'MABILIS NA DESTINASYON',
    'home.away':          'malayo',

    // ── AR screen ─────────────────────────────────────────────────────────────
    'ar.gpsAcquiring':    'Kinukuha ang GPS signal…',
    'ar.plotting':        'Kinakalkula ang AR path…',
    'ar.pointAhead':      'Ituro ang camera sa harap at maghintay',
    'ar.arrived':         'Nakarating ka na!',
    'ar.arrivedSub':      'Malapit ka na sa',
    'ar.backToMap':       '← Bumalik sa Mapa',
    'ar.distLabel':       'm na layo',
    'ar.indoor.title':    'Nasa loob ka ng gusali',
    'ar.indoor.body':     'Ang AR navigation ay para sa labas lamang. Kasalukuyan kang nasa loob ng',
    'ar.indoor.dismiss':  'Naiintindihan ko',

    // ── Arrival prompt / indoor guidance ─────────────────────────────────────
    'arrival.title':          'Nakarating ka na sa',
    'arrival.whatLooking':    'Ano ang hinahanap mo?',
    'arrival.searchHint':     'Maghanap ng silid, opisina, lab…',
    'arrival.whichFloor':     'Saang palapag ka ngayon?',
    'arrival.directions':     'Direksyon',
    'arrival.notFound':       "Wala pa kaming direksyon para sa silid na iyon. Magtanong sa pinakamalapit na opisina.",
    'arrival.noData':         'Hindi pa available ang indoor directions para sa gusaling ito.',
    'arrival.back':           '← Bumalik',
    'arrival.close':          'Isara',
    'arrival.gf':             'Ground Floor',
    'arrival.1f':             '1st Floor',
    'arrival.2f':             '2nd Floor',
    'arrival.3f':             '3rd Floor',
    'arrival.4f':             '4th Floor',

    // ── Staircase picker ──────────────────────────────────────────────────────
    'staircase.title':    "Alin ang pinakamalapit na hagdan sa iyo?",
    'staircase.sub':      'Makakatulong ito para maibigay ang tamang direksyon.',
    'staircase.stair1':   'Hagdan 1',
    'staircase.stair2':   'Hagdan 2',
    'staircase.front':    'Pangunahing Pasukan',
    'staircase.back':     '2nd Pasukan',

    // ── Map screen ────────────────────────────────────────────────────────────
    'map.navigate':       'Pumunta Dito',
    'map.viewFloors':     'Tingnan ang Palapag',
    'map.close':          'Isara',
    'map.searchHint':     'Maghanap ng gusali, silid…',

    // ── Status chips ──────────────────────────────────────────────────────────
    'status.gpsActive':   'GPS Aktibo',
    'status.aiReady':     'AI Handa',
    'status.aiOnline':    'AI Online',
    'status.noInternet':  'Walang Internet',
    'status.offlineMode': 'Offline Mode',
    'status.arStandby':   'AR Standby',

    // ── Tutorial ──────────────────────────────────────────────────────────────
    'tutorial.skip':      'Laktawan',
    'tutorial.next':      'Susunod →',
    'tutorial.gotIt':     'Naiintindihan ko!',
    'tutorial.back':      '← Bumalik',
    'tutorial.of':        'ng',
  },
};

/**
 * Get a translated string.
 * @param {string} key   — dot-separated key e.g. 'settings.arMode'
 * @param {string} lang  — "en" or "fil"
 * @returns {string}
 */
export function t(key, lang = 'en') {
  const dict = TRANSLATIONS[lang] ?? TRANSLATIONS.en;
  return dict[key] ?? TRANSLATIONS.en[key] ?? key;
}

export default TRANSLATIONS;
