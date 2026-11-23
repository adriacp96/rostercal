/**
 * RosterCal — Emirates (EK) Cabin Crew Edition
 * Architecture: ES6 Modular Classes | 100% Client-Side Privacy
 * Features: Zero-Latency Instant Boot | Native DST-Aware Timezones | Deterministic iCal UIDs | Custom Emojis | PWA Support
 * UI Enhanced with Apple Design Principles
 */

import { BUILTIN_AIRPORTS } from './airports.js';
import { BUILTIN_EVENT_CODES } from './event_codes.js';

// --- Supabase Configuration ---
const SUPABASE_URL = "https://qrwzmbylcgwgteywnjss.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyd3ptYnlsY2d3Z3RleXduanNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxNjUwMTUsImV4cCI6MjEwMTc0MTAxNX0.Xexca7uxPjvm6orZTecDmfBIyqnpetC_v3b4mtkul9g";

const HOME_BASE = "DXB";
const HOME_UTC_OFFSET = 4; // UAE Standard Time (No DST)
const MONTH_NAMES_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const NON_AIRPORT_TOKENS = new Set([
  "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN",
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  "UTC", "GMT", "LOC", "STD", "STA", "ETD", "ETA", "DUT", "FLT", "OFF"
]);

// --- Global App State (Instant Memory Ready) ---
class AppState {
  constructor() {
    this.airports = { ...BUILTIN_AIRPORTS };
    this.eventCodes = { ...BUILTIN_EVENT_CODES };
    this.parsedEvents = [];
    this.unknownAirports = [];
    this.timezoneMode = 'LOCAL';
    this.activeView = 'list';
    this.activeFilter = 'ALL';
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
    this.currentStaffNumber = 'UNKNOWN';

    const savedPrefs = localStorage.getItem('rosterCalPrefs');
    this.preferences = savedPrefs ? JSON.parse(savedPrefs) : {
      calendarName: "Emirates Roster",
      flightTitleFormat: "CITY_IATA",
      dutyTitleFormat: "EMOJI_TITLE",
      includeReport: "HOME_ONLY",
      includeFR24: true,
      autoLayovers: true,
      includeLocal: true,
      alarmReminder: "120"
    };
  }

  init() {
    console.log("✅ Data dictionaries loaded successfully via ESM.");
  }
}
const state = new AppState();

// --- Supabase Async Code Logger Engine ---
class SupabaseLogger {
  static async logCodes(events) {
    if (!SUPABASE_URL || SUPABASE_URL.includes("YOUR_SUPABASE_PROJECT_ID") || !SUPABASE_ANON_KEY) {
      return;
    }

    const uniqueCodesMap = new Map();

    events.forEach(evt => {
      if (!evt.code) return;

      const code = evt.code.toUpperCase();
      const isKnown = !!(state.eventCodes[code] || BUILTIN_EVENT_CODES[code]);

      if (!uniqueCodesMap.has(code)) {
        uniqueCodesMap.set(code, {
          code: code,
          raw_title: evt.rawTitle || evt.title || evt.rawText || "",
          is_known: isKnown,
          last_seen: new Date().toISOString()
        });
      }
    });

    const payload = Array.from(uniqueCodesMap.values());
    if (payload.length === 0) return;

    try {
      const endpoint = `${SUPABASE_URL}/rest/v1/collected_event_codes`;
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn("Supabase code logging failed:", err);
    }
  }

  static async logEvents(events) {
    if (!SUPABASE_URL || SUPABASE_URL.includes("YOUR_SUPABASE_PROJECT_ID") || !SUPABASE_ANON_KEY) return;
    if (events.length === 0) return;

    const sessionId = `sync-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const payload = events.map(evt => ({
      sync_session_id: sessionId,
      staff_number: state.currentStaffNumber || 'UNKNOWN',
      event_code: evt.code || null,
      category: evt.category || null,
      origin: evt.origin || null,
      destination: evt.destination || null,
      start_utc: evt.startUtc && !isNaN(evt.startUtc) ? evt.startUtc.toISOString() : null,
      end_utc: evt.endUtc && !isNaN(evt.endUtc) ? evt.endUtc.toISOString() : null,
      raw_text: evt.rawText || ""
    }));

    try {
      const endpoint = `${SUPABASE_URL}/rest/v1/roster_events`;
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn("Supabase full event logging failed:", err);
    }
  }
}

// --- Toast Notification System ---
class Toast {
  static show(message, type = 'error') {
    const containerId = 'rostercal-toast-container';
    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.className = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[120] flex flex-col items-center space-y-2 pointer-events-none px-4 w-full max-w-md';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const styleMap = {
      error: 'bg-red-950/90 border-red-500/50 text-red-200',
      warning: 'bg-amber-950/90 border-amber-500/50 text-amber-200',
      success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
    };
    const iconMap = {
      error: '⚠️',
      warning: '⚠️',
      success: '✅'
    };

    toast.className = `flex items-center space-x-2 px-4 py-2.5 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-10 opacity-0 ${
      styleMap[type] || styleMap.error
    }`;

    toast.innerHTML = `
      <span class="text-base">${iconMap[type] || '⚠️'}</span>
      <span class="text-xs font-bold tracking-tight uppercase">${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, type === 'warning' ? 5000 : 3500);
  }
}

// --- Formatting Engine ---
class FormatEngine {
  static getTitle(evt) {
    if (evt.category === 'flight') {
      const depIATA = evt.origin;
      const arrIATA = evt.destination;
      const depCity = (state.airports[evt.origin] || BUILTIN_AIRPORTS[evt.origin])?.city || evt.origin;
      const arrCity = (state.airports[evt.destination] || BUILTIN_AIRPORTS[evt.destination])?.city || evt.destination;
      const flight = evt.flightNum;

      const startLocal = evt.startTime ? evt.startTime.replace(/(\d{2})(\d{2})/, '$1:$2') + "L" : "--:--L";
      const endLocal = evt.endTime ? evt.endTime.replace(/(\d{2})(\d{2})/, '$1:$2') + "L" : "--:--L";

      switch (state.preferences.flightTitleFormat) {
        case 'DEP_IATA_ARR_IATA': return `✈️ ${depIATA} - ${arrIATA}`;
        case 'LOCAL_CODES': return `✈️ ${startLocal}-${endLocal} [${flight}]`;
        case 'CITY_IATA':
        default: return `✈️ ${depCity} (${depIATA}) - ${arrCity} (${arrIATA})`;
      }
    } else if (evt.category === 'report') {
      const emoji = evt.emoji || "🕒";
      return `${emoji} REPORT ${evt.flightNum} [${evt.origin}]`;
    } else if (evt.category === 'layover') {
      const emoji = evt.emoji || "🏨";
      const restBadge = evt.restDuration ? ` (${evt.restDuration})` : "";
      const loc = evt.locationCode || evt.origin || HOME_BASE;
      switch (state.preferences.dutyTitleFormat) {
        case 'CODE_TITLE': return `${emoji} ${evt.code} - Layover in ${loc}${restBadge}`;
        case 'CODE_ONLY': return `${emoji} ${evt.code}${restBadge}`;
        default: return `${emoji} Layover in ${loc}${restBadge}`;
      }
    } else if (evt.category === 'turnaround') {
      const emoji = evt.emoji || "🔄";
      const restBadge = evt.restDuration ? ` (${evt.restDuration})` : "";
      const loc = evt.locationCode || evt.origin || HOME_BASE;
      switch (state.preferences.dutyTitleFormat) {
        case 'CODE_TITLE': return `${emoji} ${evt.code} - Turnaround in ${loc}${restBadge}`;
        case 'CODE_ONLY': return `${emoji} ${evt.code}${restBadge}`;
        default: return `${emoji} Turnaround in ${loc}${restBadge}`;
      }
    } else {
      const emoji = evt.emoji || "📌";
      switch (state.preferences.dutyTitleFormat) {
        case 'CODE_TITLE': return `${emoji} ${evt.code} - ${evt.rawTitle || evt.title}`;
        case 'CODE_ONLY': return `${emoji} ${evt.code}`;
        default: return `${emoji} ${evt.rawTitle || evt.title}`;
      }
    }
  }

  static getDescription(evt) {
    const lines = [];
    const origMeta = state.airports[evt.origin] || BUILTIN_AIRPORTS[evt.origin];
    const destMeta = state.airports[evt.destination] || BUILTIN_AIRPORTS[evt.destination];
    const origCity = origMeta?.city || evt.origin;
    const destCity = destMeta?.city || evt.destination;

    if (evt.category === 'flight') {
      lines.push(`✈️ EMIRATES FLIGHT ${evt.flightNum}`);
      lines.push(`----------------------------------`);
      lines.push(`🌐 Route:     ${origCity} (${evt.origin}) ➡️ ${destCity} (${evt.destination})`);

      if (state.preferences.includeLocal) {
        const startL = evt.startTime ? evt.startTime.replace(/(\d{2})(\d{2})/, '$1:$2') : '--:--';
        const endL = evt.endTime ? evt.endTime.replace(/(\d{2})(\d{2})/, '$1:$2') : '--:--';
        lines.push(`🛫 Departure: ${startL} Local (${evt.origin})`);
        lines.push(`🛬 Arrival:   ${endL} Local (${evt.destination})`);
      }

      if (!origMeta || !destMeta) {
        const missing = [!origMeta ? evt.origin : null, !destMeta ? evt.destination : null].filter(Boolean).join(', ');
        lines.push(`⚠️ Timezone Warning: Unlisted airport (${missing}) — verify local time offset.`);
      }

      const showReport = state.preferences.includeReport === true ||
                        state.preferences.includeReport === 'ALL' ||
                        (state.preferences.includeReport === 'HOME_ONLY' && evt.origin === HOME_BASE) ||
                        (state.preferences.includeReport === undefined && evt.origin === HOME_BASE);

      if (showReport && evt.repTime) {
        const formatRep = evt.repTime.replace(/(\d{2})(\d{2})/, '$1:$2');
        lines.push(`🕒 Check-in:  ${formatRep} Local (${evt.origin})`);
      }

      if (evt.aircraft || evt.tailNumber) {
        lines.push(`----------------------------------`);
        lines.push(`✈️ Equipment: ${evt.aircraft || 'A380'} [${evt.tailNumber || 'Assigned Fleet'}]`);
      }

      if (state.preferences.includeFR24 && evt.flightNum) {
        const fr24Code = evt.flightNum.toLowerCase().replace(/[^a-z0-9]/g, '');
        lines.push(`----------------------------------`);
        lines.push(`📡 Live Flight Radar Tracking:`);
        lines.push(`https://www.flightradar24.com/data/flights/${fr24Code}`);
      }
    } else if (evt.category === 'report') {
      const startL = evt.startTime ? evt.startTime.replace(/(\d{2})(\d{2})/, '$1:$2') : '--:--';
      lines.push(`🕒 CREW CHECK-IN & eGATE REPORT`);
      lines.push(`----------------------------------`);
      lines.push(`✈️ Flight:   ${evt.flightNum}`);
      lines.push(`📍 Airport:  ${origMeta?.name || origCity} (${evt.origin})`);
      lines.push(`⏰ Report:   ${startL} Local Time`);
      lines.push(`----------------------------------`);
      lines.push(`ℹ️ Note: eGate briefing and check-in window remains open for exactly 1 hour prior to gate departure.`);

      if (state.preferences.includeFR24 && evt.flightNum) {
        const fr24Code = evt.flightNum.toLowerCase().replace(/[^a-z0-9]/g, '');
        lines.push(`----------------------------------`);
        lines.push(`📡 Associated Flight Tracking:`);
        lines.push(`https://www.flightradar24.com/data/flights/${fr24Code}`);
      }
    } else if (evt.category === 'layover') {
      const loc = evt.locationCode || evt.origin || HOME_BASE;
      const layMeta = state.airports[loc] || BUILTIN_AIRPORTS[loc];
      const city = layMeta?.city || loc;

      lines.push(`🏨 STATION REST & LAYOVER`);
      lines.push(`----------------------------------`);
      lines.push(`📍 Location: ${city} (${loc})`);
      if (evt.restDuration) {
        lines.push(`⏳ Rest Time: ${evt.restDuration}`);
        lines.push(`----------------------------------`);
        lines.push(`🛬 Inbound Arr:  ${evt.startTime || '--:--'} Local`);
        lines.push(`🛫 Outbound Dep: ${evt.endTime || '--:--'} Local`);
      }
      lines.push(`----------------------------------`);
      lines.push(`ℹ️ Minimum station rest rules apply. Ensure hotel wake-up call is booked.`);
    } else if (evt.category === 'turnaround') {
      const loc = evt.locationCode || evt.origin || HOME_BASE;
      const turnMeta = state.airports[loc] || BUILTIN_AIRPORTS[loc];
      const city = turnMeta?.city || loc;

      lines.push(`🔄 AIRCRAFT TURNAROUND`);
      lines.push(`----------------------------------`);
      lines.push(`📍 Location: ${city} (${loc})`);
      if (evt.restDuration) {
        lines.push(`⏳ Ground Time: ${evt.restDuration}`);
        lines.push(`----------------------------------`);
        lines.push(`🛬 Inbound Arr:  ${evt.startTime || '--:--'} Local`);
        lines.push(`🛫 Outbound Dep: ${evt.endTime || '--:--'} Local`);
      }
    } else if (evt.category === 'standby') {
      lines.push(`⏳ RESERVE & STANDBY DUTY`);
      lines.push(`----------------------------------`);
      lines.push(`🔖 Duty Code:  ${evt.code}`);
      lines.push(`📋 Assignment: ${evt.rawTitle || evt.title}`);
      lines.push(`📍 Location:   ${evt.location}`);
      if (!evt.isAllDay && evt.startTime && evt.endTime) {
        const startL = evt.startTime.replace(/(\d{2})(\d{2})/, '$1:$2');
        const endL = evt.endTime.replace(/(\d{2})(\d{2})/, '$1:$2');
        lines.push(`⏰ Window:     ${startL} - ${endL} Local`);
      }
      lines.push(`----------------------------------`);
      lines.push(`ℹ️ Keep portal notifications active and phone ringtone on audible.`);
    } else if (evt.category === 'training') {
      lines.push(`📚 CREW TRAINING & QUALIFICATION`);
      lines.push(`----------------------------------`);
      lines.push(`🔖 Duty Code: ${evt.code}`);
      lines.push(`📚 Course:    ${evt.rawTitle || evt.title}`);
      lines.push(`📍 Facility:  ${evt.location}`);
      if (!evt.isAllDay && evt.startTime && evt.endTime) {
        const startL = evt.startTime.replace(/(\d{2})(\d{2})/, '$1:$2');
        const endL = evt.endTime.replace(/(\d{2})(\d{2})/, '$1:$2');
        lines.push(`⏰ Schedule:  ${startL} - ${endL} Local`);
      }
      lines.push(`----------------------------------`);
      lines.push(`ℹ️ Ensure required SEP manuals, IDs, and licenses are updated before attending.`);
    } else if (evt.category === 'off') {
      const isBeachLeave = evt.code.startsWith("AL") || evt.code.startsWith("LV") || evt.code === "FI" || evt.code === "VA" || evt.code === "LLV";
      const headerEmoji = evt.code === "SK" ? "🏥" : (isBeachLeave ? "🏖️" : "🏠");
      lines.push(`${headerEmoji} ROSTERED DAY OFF / LEAVE`);
      lines.push(`----------------------------------`);
      lines.push(`🔖 Code:   ${evt.code}`);
      lines.push(`📋 Status: ${evt.rawTitle || evt.title}`);
      lines.push(`----------------------------------`);
      lines.push(`ℹ️ Guaranteed rest period free from duty assignments.`);
    } else {
      lines.push(`📌 EMIRATES CREW DUTY`);
      lines.push(`----------------------------------`);
      lines.push(`🔖 Duty Code: ${evt.code}`);
      lines.push(`📋 Activity:  ${evt.rawTitle || evt.title}`);
      if (evt.location) lines.push(`📍 Location:  ${evt.location}`);
      if (!evt.isAllDay && evt.startTime && evt.endTime) {
        const startL = evt.startTime.replace(/(\d{2})(\d{2})/, '$1:$2');
        const endL = evt.endTime.replace(/(\d{2})(\d{2})/, '$1:$2');
        lines.push(`⏰ Schedule:  ${startL} - ${endL} Local`);
      }
    }

    return lines.join('\n');
  }
}

// --- Universal Hybrid Parser Engine ---
class ParserEngine {

  static isValidHHMM(timeStr) {
    if (!timeStr) return false;
    const clean = String(timeStr).replace('+1', '').replace(':', '');
    if (!/^\d{4}$/.test(clean)) return false;
    const hh = parseInt(clean.slice(0, 2), 10);
    const mm = parseInt(clean.slice(2, 4), 10);
    return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
  }

  /**
   * Computes exact UTC offset in ms (local - UTC) for a given UTC Date in an IANA zone.
   */
  static getTimeZoneOffsetMs(utcDate, ianaZone) {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: ianaZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    });
    const parts = dtf.formatToParts(utcDate);
    const map = {};
    for (const p of parts) {
      if (p.type !== 'literal') map[p.type] = parseInt(p.value, 10);
    }
    const hour = map.hour === 24 ? 0 : map.hour;
    const asUtc = Date.UTC(map.year, map.month - 1, map.day, hour, map.minute, map.second);
    const utcTrunc = utcDate.getTime() - (utcDate.getTime() % 1000);
    return asUtc - utcTrunc;
  }

  /**
   * Native DST-aware conversion from airport wall-clock time to exact UTC Date.
   * Uses a two-pass offset resolution so DST transitions are handled accurately offline.
   */
  static parseToUtcDate(year, monthIndex, day, timeStr, locationCode = HOME_BASE) {
    const rawStr = String(timeStr || "0000");
    const dayShift = /\+1/.test(rawStr) ? 1 : 0;
    const cleanTime = rawStr.replace('+1', '').replace(':', '');
    const hours = parseInt(cleanTime.slice(0, 2), 10) || 0;
    const minutes = parseInt(cleanTime.slice(2, 4), 10) || 0;

    const airport = state.airports[locationCode] || BUILTIN_AIRPORTS[locationCode];
    const ianaZone = airport?.iana || "Asia/Dubai";
    const fallbackOffset = airport?.utc_offset !== undefined ? airport.utc_offset : HOME_UTC_OFFSET;

    // Normalize calendar date in UTC so browser's local timezone never skews date rollovers
    const normalized = new Date(Date.UTC(year, monthIndex, day + dayShift));
    const normYear = normalized.getUTCFullYear();
    const normMonth = normalized.getUTCMonth();
    const normDay = normalized.getUTCDate();

    const targetAsUtc = Date.UTC(normYear, normMonth, normDay, hours, minutes, 0);

    try {
      const offset1 = ParserEngine.getTimeZoneOffsetMs(new Date(targetAsUtc), ianaZone);
      let utcCandidate = targetAsUtc - offset1;
      const offset2 = ParserEngine.getTimeZoneOffsetMs(new Date(utcCandidate), ianaZone);
      if (offset2 !== offset1) {
        utcCandidate = targetAsUtc - offset2;
      }
      return new Date(utcCandidate);
    } catch (e) {
      return new Date(targetAsUtc - (fallbackOffset * 60 * 60000));
    }
  }

  /**
   * Extracts local calendar date & HHMM time in the station's IANA timezone.
   * Prevents UTC midnight rollovers from placing events on the wrong day in Month View.
   */
  static getLocalDateParts(utcDate, locationCode = HOME_BASE) {
    const airport = state.airports[locationCode] || BUILTIN_AIRPORTS[locationCode];
    const ianaZone = airport?.iana || "Asia/Dubai";

    try {
      const dtf = new Intl.DateTimeFormat('en-US', {
        timeZone: ianaZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
      });
      const parts = dtf.formatToParts(utcDate);
      const map = {};
      for (const p of parts) {
        if (p.type !== 'literal') map[p.type] = parseInt(p.value, 10);
      }
      const hour = map.hour === 24 ? 0 : map.hour;
      const year = map.year;
      const month = map.month - 1;
      const day = map.day;
      return {
        year,
        month,
        day,
        timeStr: `${String(hour).padStart(2, '0')}${String(map.minute).padStart(2, '0')}`,
        dateStr: `${String(day).padStart(2, '0')} ${MONTH_NAMES_SHORT[month]}`
      };
    } catch (e) {
      const fallbackOffset = airport?.utc_offset !== undefined ? airport.utc_offset : HOME_UTC_OFFSET;
      const shifted = new Date(utcDate.getTime() + fallbackOffset * 3600000);
      const year = shifted.getUTCFullYear();
      const month = shifted.getUTCMonth();
      const day = shifted.getUTCDate();
      return {
        year,
        month,
        day,
        timeStr: `${String(shifted.getUTCHours()).padStart(2, '0')}${String(shifted.getUTCMinutes()).padStart(2, '0')}`,
        dateStr: `${String(day).padStart(2, '0')} ${MONTH_NAMES_SHORT[month]}`
      };
    }
  }

  /**
   * Assigns stable, deterministic IDs (used as iCal UIDs) so re-importing updated rosters
   * updates existing calendar events cleanly instead of creating duplicates.
   */
  static assignDeterministicIds(events) {
    const seen = new Map();
    const clean = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    events.forEach(evt => {
      const y = evt.uidYear ?? evt.year;
      const m = evt.uidMonth ?? evt.month;
      const d = evt.uidDay ?? evt.day;
      const dateKey = `${y}${String(m + 1).padStart(2, '0')}${String(d).padStart(2, '0')}`;

      let baseId;
      if (evt.category === 'flight') {
        baseId = `ek-flt-${dateKey}-${clean(evt.flightNum)}-${clean(evt.origin)}-${clean(evt.destination)}`;
      } else if (evt.category === 'report') {
        baseId = `ek-rep-${dateKey}-${clean(evt.flightNum)}-${clean(evt.origin)}`;
      } else if (evt.category === 'layover' || evt.category === 'turnaround') {
        baseId = `ek-${evt.category === 'layover' ? 'lay' : 'turn'}-${dateKey}-${clean(evt.locationCode || evt.origin)}`;
      } else {
        baseId = `ek-duty-${dateKey}-${clean(evt.code)}`;
      }

      const count = seen.get(baseId) || 0;
      seen.set(baseId, count + 1);
      evt.id = count === 0 ? baseId : `${baseId}-${count + 1}`;
    });
  }

  static parseRawText(rawText) {
    const events = [];
    const unknownAirportsSet = new Set();

    const headerText = rawText.substring(0, 500);
    let staffMatch = headerText.match(/Staff No\.:\s*(\d{6})/i);
    if (!staffMatch) {
      staffMatch = headerText.match(/\b(\d{6})\b/);
    }
    state.currentStaffNumber = staffMatch ? staffMatch[1] : 'UNKNOWN';

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    const monthNames = { JAN:0, FEB:1, MAR:2, APR:3, MAY:4, JUN:5, JUL:6, AUG:7, SEP:8, OCT:9, NOV:10, DEC:11 };

    const rangeMatch = rawText.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})\s*to\s*\d{1,2}[-/.](\d{1,2})[-/.](\d{4})/i);
    if (rangeMatch) {
      currentMonth = parseInt(rangeMatch[2], 10) - 1;
      currentYear = parseInt(rangeMatch[3], 10);
    } else {
      const headerMatch = rawText.match(/(?:^|\r|\n)\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+(\d{4})\s*(?:\r|\n|$)/i);
      if (headerMatch) {
        currentMonth = monthNames[headerMatch[1].toUpperCase()] ?? currentMonth;
        currentYear = parseInt(headerMatch[2], 10);
      } else {
        const anyMatch = rawText.match(/\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b\s+(\d{4})/i);
        if (anyMatch) {
          currentMonth = monthNames[anyMatch[1].toUpperCase()] ?? currentMonth;
          currentYear = parseInt(anyMatch[2], 10);
        }
      }
    }

    state.currentYear = currentYear;
    state.currentMonth = currentMonth;

    const dayMarkerRegex = /(?:^|[^0-9])(0[1-9]|[12][0-9]|3[01])\s*(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/gi;
    const dayMarkers = [];
    let match;
    while ((match = dayMarkerRegex.exec(rawText)) !== null) {
      const exactIndex = match.index + match[0].indexOf(match[1]);
      dayMarkers.push({
        day: parseInt(match[1], 10),
        dayName: match[2].toUpperCase(),
        index: exactIndex
      });
    }

    if (dayMarkers.length === 0) {
      state.unknownAirports = [];
      return events;
    }

    let activeMonth = currentMonth;
    let activeYear = currentYear;
    let previousDay = 0;

    for (let i = 0; i < dayMarkers.length; i++) {
      const currentMarker = dayMarkers[i];
      const currentDay = currentMarker.day;

      if (previousDay > 0 && currentDay < previousDay) {
        activeMonth++;
        if (activeMonth > 11) {
          activeMonth = 0;
          activeYear++;
        }
      }
      previousDay = currentDay;

      const nextIndex = (i + 1 < dayMarkers.length) ? dayMarkers[i + 1].index : rawText.length;
      const chunkText = rawText.substring(currentMarker.index, nextIndex).trim();

      const sectorRegex = /(?:(\d{2}:\d{2}|\d{4})\s*)?(EK)?(\d{1,4}(?:-[A-Z])?)\s*([A-Z]{3})\s*(\d{2}:\d{2}|\d{4})\s*([A-Z]{3})\s*(\d{2}:\d{2}|\d{4})/gi;
      let sectorMatch;
      let foundSector = false;

      while ((sectorMatch = sectorRegex.exec(chunkText)) !== null) {
        const rawRepTime = sectorMatch[1];
        const hasEkPrefix = !!sectorMatch[2];
        const rawFlightNum = sectorMatch[3];
        const origin = sectorMatch[4].toUpperCase();
        const depTimeStr = sectorMatch[5].replace(':', '');
        const dest = sectorMatch[6].toUpperCase();
        const arrTimeStr = sectorMatch[7].replace(':', '');

        // Validate departure & arrival HHMM values to eliminate non-time false positives
        if (!ParserEngine.isValidHHMM(depTimeStr) || !ParserEngine.isValidHHMM(arrTimeStr)) continue;

        const origMeta = state.airports[origin] || BUILTIN_AIRPORTS[origin];
        const destMeta = state.airports[dest] || BUILTIN_AIRPORTS[dest];

        // Avoid discarding flights to newly opened/unlisted airports while blocking non-airport tokens
        if (!origMeta || !destMeta) {
          if (NON_AIRPORT_TOKENS.has(origin) || NON_AIRPORT_TOKENS.has(dest)) continue;
          if (!origMeta && !destMeta && !hasEkPrefix) continue;
          if (!origMeta) unknownAirportsSet.add(origin);
          if (!destMeta) unknownAirportsSet.add(dest);
        }

        foundSector = true;
        const flightNum = rawFlightNum.toUpperCase().startsWith("EK") ? rawFlightNum.toUpperCase() : `EK${rawFlightNum.toUpperCase()}`;
        const destCity = destMeta ? destMeta.city : dest;
        const repTime = (rawRepTime && ParserEngine.isValidHHMM(rawRepTime)) ? rawRepTime.replace(':', '') : null;

        const startUtc = ParserEngine.parseToUtcDate(activeYear, activeMonth, currentDay, depTimeStr, origin);
        let endUtc = ParserEngine.parseToUtcDate(activeYear, activeMonth, currentDay, arrTimeStr, dest);

        // Recalculate on day + 1 instead of adding 24h UTC so DST transitions stay exact
        if (endUtc < startUtc) {
          endUtc = ParserEngine.parseToUtcDate(activeYear, activeMonth, currentDay + 1, arrTimeStr, dest);
        }

        const flightEvent = {
          id: "",
          enabled: true,
          code: "FLT",
          flightNum: flightNum,
          origin: origin,
          destination: dest,
          location: `${destCity} (${dest})`,
          startTime: depTimeStr,
          endTime: arrTimeStr,
          repTime: repTime,
          day: currentDay,
          month: activeMonth,
          year: activeYear,
          dateStr: `${String(currentDay).padStart(2, '0')} ${MONTH_NAMES_SHORT[activeMonth]}`,
          category: "flight",
          isAllDay: false,
          startUtc: startUtc,
          endUtc: endUtc,
          rawText: chunkText
        };
        events.push(flightEvent);

        const shouldAddReport = repTime && (
          state.preferences.includeReport === true ||
          state.preferences.includeReport === 'ALL' ||
          (state.preferences.includeReport === 'HOME_ONLY' && origin === HOME_BASE) ||
          (state.preferences.includeReport === undefined && origin === HOME_BASE)
        );

        if (shouldAddReport) {
          let repEndUtc = ParserEngine.parseToUtcDate(activeYear, activeMonth, currentDay, repTime, origin);

          // Recalculate on day - 1 in station timezone so overnight reports across DST stay exact
          if (repEndUtc >= startUtc) {
            repEndUtc = ParserEngine.parseToUtcDate(activeYear, activeMonth, currentDay - 1, repTime, origin);
          }

          const repStartUtc = new Date(repEndUtc.getTime() - 60 * 60 * 1000);

          // Use station local date (not UTC) so early-morning DXB reports land on the right calendar day
          const repStartLocal = ParserEngine.getLocalDateParts(repStartUtc, origin);
          const repEndLocal = ParserEngine.getLocalDateParts(repEndUtc, origin);

          const reportEvent = {
            id: "",
            enabled: true,
            code: "REP",
            flightNum: flightNum,
            origin: origin,
            destination: origin,
            location: `${origMeta?.city || origin} (${origin}) - Crew Check-in / eGate`,
            startTime: repStartLocal.timeStr,
            endTime: repEndLocal.timeStr,
            day: repStartLocal.day,
            month: repStartLocal.month,
            year: repStartLocal.year,
            // Tie report UID date to its parent flight date so slight midnight shifts update instead of duplicating
            uidDay: currentDay,
            uidMonth: activeMonth,
            uidYear: activeYear,
            dateStr: repStartLocal.dateStr,
            category: "report",
            emoji: "🕒",
            isAllDay: false,
            startUtc: repStartUtc,
            endUtc: repEndUtc,
            rawText: `Check-in window: ${repStartLocal.timeStr} to ${repEndLocal.timeStr} for ${flightNum}`
          };
          events.push(reportEvent);
        }
      }

      if (foundSector) continue;

      const cleanChunk = chunkText.replace(/^(?:0[1-9]|[12][0-9]|3[01])\s*(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s*/i, '').trim();
      if (!cleanChunk) continue;

      const tokens = cleanChunk.split(/\s+/);
      let code = tokens[0].toUpperCase();

      if (/^\d{4}$/.test(code) && !state.eventCodes[code] && !BUILTIN_EVENT_CODES[code]) continue;

      let codeMeta = state.eventCodes[code] || BUILTIN_EVENT_CODES[code];
      if (!codeMeta) {
        if (code.startsWith("SQA")) {
          codeMeta = { title: `Airport Standby (${code})`, emoji: "🛃", category: "standby", isAllDay: false };
        } else if (code.startsWith("SL")) {
          codeMeta = { title: `High Quality Standby (${code})`, emoji: "⏳", category: "standby", isAllDay: false };
        } else if (code.startsWith("S") && /^\d/.test(code.slice(1))) {
          codeMeta = { title: `Standby Reserve (${code})`, emoji: "⏳", category: "standby", isAllDay: false };
        } else if (code.startsWith("ER") || code.startsWith("FR") || code.startsWith("C5") || code.startsWith("RCY") || code.startsWith("38") || code.startsWith("FA") || code.startsWith("FG") || code.startsWith("JP")) {
          codeMeta = { title: `SEP / Aircraft Training (${code})`, emoji: "📚", category: "training", isAllDay: false };
        } else if (code.startsWith("AL") || code.startsWith("LV") || code === "FI" || code === "VA" || code === "LLV") {
          codeMeta = { title: `Leave (${code})`, emoji: "🏖️", category: "off", isAllDay: true };
        } else if (code === "SK") {
          codeMeta = { title: `Sick (${code})`, emoji: "🏥", category: "off", isAllDay: true };
        } else if (code.startsWith("XX") || code.startsWith("DO") || code.startsWith("OFF") || code.startsWith("ROF") || code === "FP" || code === "NPA" || code === "PSB" || code === "RW" || code === "RWS") {
          codeMeta = { title: `Day Off (${code})`, emoji: "🏠", category: "off", isAllDay: true };
        } else if (code.startsWith("SBY") || code.startsWith("SO") || code.startsWith("RSV") || code.startsWith("ASBY") || code.startsWith("ESBY") || code.startsWith("HSBY")) {
          codeMeta = { title: `Standby Reserve (${code})`, emoji: "⏳", category: "standby", isAllDay: false };
        } else if (code === "LAY" || code === "REST") {
          codeMeta = { title: "Layover Rest", emoji: "🏨", category: "layover", isAllDay: false };
        } else if (code === "TURN") {
          codeMeta = { title: "Turnaround", emoji: "🔄", category: "turnaround", isAllDay: false };
        } else {
          codeMeta = { title: cleanChunk, emoji: "📌", category: "general", isAllDay: false };
        }
      }

      const isAllDay = codeMeta.isAllDay || codeMeta.category === 'off';
      let startTime = null;
      let endTime = null;
      let location = `Dubai (${HOME_BASE})`;
      let origin = HOME_BASE;
      let dest = HOME_BASE;
      let locCode = HOME_BASE;

      if (!isAllDay) {
        if (codeMeta.category === 'layover' || codeMeta.category === 'turnaround') {
          locCode = tokens[1] ? tokens[1].toUpperCase() : HOME_BASE;
          const airportMeta = state.airports[locCode] || BUILTIN_AIRPORTS[locCode];
          const city = airportMeta ? airportMeta.city : locCode;
          location = `${city} (${locCode})`;
          origin = locCode;
          dest = locCode;
          startTime = "1200";
          endTime = "1200";
        } else if (codeMeta.category === 'standby') {
          location = code.includes("A") || code.includes("Q") || code.includes("700") ? `Dubai Airport (${HOME_BASE})` : `Home Base (${HOME_BASE})`;
          const hourMatch = code.match(/^[A-Z]+(\d{2})/);
          if (hourMatch) {
            const startH = hourMatch[1];
            startTime = `${startH}00`;
            let endH = (parseInt(startH, 10) + 8) % 24;
            endTime = `${String(endH).padStart(2, '0')}00`;
          } else {
            const textWithoutCode = cleanChunk.replace(code, '').trim();
            const timeMatches = textWithoutCode.match(/(\d{2}:\d{2}|\d{4})/g);
            if (timeMatches && timeMatches.length >= 2) {
              startTime = timeMatches[0].replace(':', '');
              endTime = timeMatches[timeMatches.length - 1].replace(':', '');
            } else {
              startTime = "0400";
              endTime = "1600";
            }
          }
        } else {
          location = codeMeta.category === 'training' ? "Emirates Aviation College / HQ, Dubai" : `Dubai (${HOME_BASE})`;
          const textWithoutCode = cleanChunk.replace(code, '').trim();
          const timeMatches = textWithoutCode.match(/(\d{2}:\d{2}|\d{4})/g);
          if (timeMatches && timeMatches.length >= 2) {
            startTime = timeMatches[0].replace(':', '');
            endTime = timeMatches[timeMatches.length - 1].replace(':', '');
          } else {
            startTime = "0800";
            endTime = "1600";
          }
        }
      } else {
        location = `Dubai (${HOME_BASE})`;
      }

      // Capturing both start & end day while avoiding false matches inside HHMM times or DD-MM-YYYY dates
      let spanDays = 1;
      const dayRangeMatch = cleanChunk.match(/(?<![\d:-])(0[1-9]|[12][0-9]|3[01])(?:\s*[-–]\s*|\s+to\s+)(0[1-9]|[12][0-9]|3[01])(?![\d:-])/i);
      if (dayRangeMatch) {
        const startD = parseInt(dayRangeMatch[1], 10);
        const endD = parseInt(dayRangeMatch[2], 10);
        if (endD >= startD) {
          spanDays = (endD - startD) + 1;
        }
      } else {
        const spanMatch = cleanChunk.match(/(?:for|\b)\s*(\d+)\s*days?/i);
        if (spanMatch) {
          spanDays = parseInt(spanMatch[1], 10);
        }
      }

      for (let dOffset = 0; dOffset < spanDays; dOffset++) {
        // Normalize rolled-over dates in UTC so multi-day duties crossing month-end keep valid day/month/year
        const normDate = new Date(Date.UTC(activeYear, activeMonth, currentDay + dOffset));
        const normYear = normDate.getUTCFullYear();
        const normMonth = normDate.getUTCMonth();
        const normDay = normDate.getUTCDate();

        let startUtc, endUtc;

        if (isAllDay) {
          startUtc = new Date(Date.UTC(normYear, normMonth, normDay, 0, 0, 0));
          endUtc = new Date(Date.UTC(normYear, normMonth, normDay, 23, 59, 59));
        } else {
          startUtc = ParserEngine.parseToUtcDate(normYear, normMonth, normDay, startTime, origin);
          endUtc = ParserEngine.parseToUtcDate(normYear, normMonth, normDay, endTime, dest || origin);
          if (codeMeta.category === 'layover' || endUtc < startUtc) {
            endUtc = ParserEngine.parseToUtcDate(normYear, normMonth, normDay + 1, endTime, dest || origin);
          }
        }

        const event = {
          id: "",
          enabled: true,
          code: code,
          emoji: codeMeta.emoji,
          rawTitle: codeMeta.title,
          day: normDay,
          month: normMonth,
          year: normYear,
          dateStr: `${String(normDay).padStart(2, '0')} ${MONTH_NAMES_SHORT[normMonth]}`,
          origin: origin,
          destination: dest,
          locationCode: locCode,
          location: location,
          startTime: startTime,
          endTime: endTime,
          category: codeMeta.category,
          isAllDay: isAllDay,
          startUtc: startUtc,
          endUtc: endUtc,
          rawText: cleanChunk
        };

        events.push(event);
      }
    }

    events.sort((a, b) => a.startUtc - b.startUtc);

    ParserEngine.detectGroundTimes(events);
    ParserEngine.enrichLayoverRest(events);
    ParserEngine.assignDeterministicIds(events);

    state.unknownAirports = Array.from(unknownAirportsSet);

    SupabaseLogger.logCodes(events);
    SupabaseLogger.logEvents(events);

    return events;
  }

  static detectGroundTimes(events) {
    if (state.preferences.autoLayovers === false) return;

    const flights = events.filter(e => e.category === 'flight').sort((a, b) => a.startUtc - b.startUtc);
    const groundEvents = [];

    for (let i = 0; i < flights.length - 1; i++) {
      const inbound = flights[i];
      const outbound = flights[i + 1];

      if (inbound.destination !== HOME_BASE && inbound.destination === outbound.origin) {
        const diffMs = outbound.startUtc - inbound.endUtc;

        if (diffMs > 0) {
          const isLayover = diffMs > 4 * 60 * 60 * 1000;
          const totalMins = Math.round(diffMs / (1000 * 60));
          const hours = Math.floor(totalMins / 60);
          const mins = totalMins % 60;
          const durationStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

          const existingLayover = events.find(e =>
            (e.category === 'layover' || e.category === 'turnaround') &&
            e.locationCode === inbound.destination &&
            e.startUtc >= inbound.endUtc &&
            e.endUtc <= outbound.startUtc
          );

          if (!existingLayover) {
            const startUtc = new Date(inbound.endUtc);
            const endUtc = new Date(outbound.startUtc);

            const station = inbound.destination;
            const airport = state.airports[station] || BUILTIN_AIRPORTS[station];
            const city = airport?.city || station;

            // Use local station date/time (not UTC) for calendar placement and display
            const startLocal = ParserEngine.getLocalDateParts(startUtc, station);
            const endLocal = ParserEngine.getLocalDateParts(endUtc, station);

            if (isLayover) {
              groundEvents.push({
                id: "",
                enabled: true,
                code: "LAY",
                emoji: "🏨",
                rawTitle: "Layover",
                day: startLocal.day,
                month: startLocal.month,
                year: startLocal.year,
                dateStr: startLocal.dateStr,
                origin: station,
                destination: station,
                locationCode: station,
                location: `${city} (${station}) — Layover (${durationStr})`,
                startTime: startLocal.timeStr,
                endTime: endLocal.timeStr,
                category: "layover",
                isAllDay: false,
                startUtc: startUtc,
                endUtc: endUtc,
                restDuration: durationStr,
                rawText: `Auto-generated layover at ${station}`
              });
            } else {
              groundEvents.push({
                id: "",
                enabled: true,
                code: "TURN",
                emoji: "🔄",
                rawTitle: "Turnaround",
                day: startLocal.day,
                month: startLocal.month,
                year: startLocal.year,
                dateStr: startLocal.dateStr,
                origin: station,
                destination: station,
                locationCode: station,
                location: `${city} (${station}) — Turnaround (${durationStr})`,
                startTime: startLocal.timeStr,
                endTime: endLocal.timeStr,
                category: "turnaround",
                isAllDay: false,
                startUtc: startUtc,
                endUtc: endUtc,
                restDuration: durationStr,
                rawText: `Auto-generated turnaround at ${station}`
              });
            }
          }
        }
      }
    }

    events.push(...groundEvents);
    events.sort((a, b) => a.startUtc - b.startUtc);
  }

  static enrichLayoverRest(events) {
    try {
      const layovers = events.filter(e => e.category === 'layover');
      layovers.forEach(lay => {
        const station = lay.locationCode || (lay.rawText && lay.rawText.split(/\s+/)[1] ? lay.rawText.split(/\s+/)[1].toUpperCase() : null);
        if (!station || station === HOME_BASE) return;

        const inbound = events
          .filter(e => e.category === 'flight' && e.destination === station && e.endUtc <= lay.startUtc)
          .sort((a, b) => b.endUtc - a.endUtc)[0];

        const outbound = events
          .filter(e => (e.category === 'report' || e.category === 'flight') && e.origin === station && e.startUtc >= lay.startUtc)
          .sort((a, b) => a.startUtc - b.startUtc)[0];

        if (inbound && outbound && inbound.endUtc && outbound.startUtc) {
          lay.startUtc = new Date(inbound.endUtc);
          lay.endUtc = new Date(outbound.startUtc);
          lay.isAllDay = false;

          const startLocal = ParserEngine.getLocalDateParts(lay.startUtc, station);
          const endLocal = ParserEngine.getLocalDateParts(lay.endUtc, station);
          lay.day = startLocal.day;
          lay.month = startLocal.month;
          lay.year = startLocal.year;
          lay.dateStr = startLocal.dateStr;
          lay.startTime = startLocal.timeStr;
          lay.endTime = endLocal.timeStr;

          const diffMs = lay.endUtc - lay.startUtc;
          if (!isNaN(diffMs) && diffMs > 0) {
            const totalMins = Math.round(diffMs / (1000 * 60));
            const hours = Math.floor(totalMins / 60);
            const mins = totalMins % 60;

            lay.restDuration = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
            const airport = state.airports[station] || BUILTIN_AIRPORTS[station];
            const city = airport?.city || station;
            lay.location = `${city} (${station}) — Station Rest (${lay.restDuration})`;
          }
        }
      });
    } catch (err) {
      console.warn("Layover rest enrichment safely bypassed:", err);
    }
  }
}

// --- iCal (.ics) Generator ---
class ICalGenerator {
  static generate(events) {
    // Monotonically increasing 32-bit revision number so calendar apps overwrite matching UIDs cleanly
    const exportSequence = Math.max(1, Math.floor((Date.now() - 1700000000000) / 1000));

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//RosterCal//Emirates Crew Schedule//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:${ICalGenerator.escape(state.preferences.calendarName || "Emirates Roster")}`,
      "X-WR-TIMEZONE:Asia/Dubai"
    ];

    events.filter(e => e.enabled).forEach(e => {
      const nowFormat = ICalGenerator.formatUtc(new Date());
      const title = FormatEngine.getTitle(e);
      const description = FormatEngine.getDescription(e);

      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${e.id}@rostercal.ek`);
      lines.push(`SEQUENCE:${exportSequence}`);
      lines.push(`DTSTAMP:${nowFormat}`);

      if (e.isAllDay) {
        const startOnly = ICalGenerator.formatDateOnly(e.startUtc);
        const nextDay = new Date(e.startUtc);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);
        const endOnly = ICalGenerator.formatDateOnly(nextDay);

        lines.push(`DTSTART;VALUE=DATE:${startOnly}`);
        lines.push(`DTEND;VALUE=DATE:${endOnly}`);
      } else {
        lines.push(`DTSTART:${ICalGenerator.formatUtc(e.startUtc)}`);
        lines.push(`DTEND:${ICalGenerator.formatUtc(e.endUtc)}`);
      }

      lines.push(
        `SUMMARY:${ICalGenerator.escape(title)}`,
        `LOCATION:${ICalGenerator.escape(e.location || "Dubai International Airport")}`,
        `DESCRIPTION:${ICalGenerator.escape(description)}`,
        "STATUS:CONFIRMED"
      );

      const alarmPref = state.preferences.alarmReminder;
      if (alarmPref && alarmPref !== "NONE") {
        lines.push(
          "BEGIN:VALARM",
          `TRIGGER:-PT${alarmPref}M`,
          "ACTION:DISPLAY",
          "DESCRIPTION:Reminder - Emirates Duty",
          "END:VALARM"
        );
      }

      lines.push("END:VEVENT");
    });

    lines.push("END:VCALENDAR");
    return lines.map(line => ICalGenerator.foldLine(line)).join("\r\n");
  }

  static formatUtc(date) {
    if (!date || isNaN(date.getTime())) return "20260101T000000Z";
    return date.toISOString().replace(/[-:]/g, '').slice(0, 15) + "Z";
  }

  static formatDateOnly(date) {
    if (!date || isNaN(date.getTime())) return "20260101";
    return date.toISOString().replace(/[-:]/g, '').slice(0, 8);
  }

  static escape(str) {
    return (str || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  }

  static foldLine(line) {
    const maxLen = 70;
    if (line.length <= maxLen) return line;
    let folded = "";
    let current = line;
    while (current.length > maxLen) {
      let splitIndex = maxLen;
      const charCode = current.charCodeAt(splitIndex - 1);
      if (charCode >= 0xD800 && charCode <= 0xDBFF) {
        splitIndex--;
      }
      folded += current.substring(0, splitIndex) + "\r\n ";
      current = current.substring(splitIndex);
    }
    folded += current;
    return folded;
  }
}

// --- UI Controller ---
document.addEventListener("DOMContentLoaded", () => {
  state.init();

  const tabText = document.getElementById("tab-text");
  const tabFile = document.getElementById("tab-file");
  const panelText = document.getElementById("panel-text");
  const panelFile = document.getElementById("panel-file");
  const rawInput = document.getElementById("raw-roster-input");
  const btnParse = document.getElementById("btn-parse");
  const btnExport = document.getElementById("btn-export");
  const tableBody = document.getElementById("roster-table-body");
  const emptyState = document.getElementById("empty-state");
  const eventCount = document.getElementById("event-count");
  const toggleAll = document.getElementById("toggle-all");
  const tzModeSelect = document.getElementById("tz-display-mode");

  const btnViewList = document.getElementById("btn-view-list");
  const btnViewMonth = document.getElementById("btn-view-month");
  const listViewContainer = document.getElementById("list-view-container");
  const monthViewContainer = document.getElementById("month-view-container");
  const listToolbar = document.getElementById("list-toolbar");
  const monthViewTitle = document.getElementById("month-view-title");
  const calendarGridDays = document.getElementById("calendar-grid-days");

  const infoModal = document.getElementById("info-modal");
  const prefsModal = document.getElementById("prefs-modal");

  const btnInfo = document.getElementById("btn-info");
  const btnCloseInfo = document.getElementById("btn-close-modal");
  const btnGotIt = document.getElementById("btn-modal-got-it");

  const pasteOverlay = document.getElementById("paste-success-overlay");
  const clearOverlay = document.getElementById("clear-success-overlay");
  const btnClearBox = document.getElementById("btn-clear-box");

  const notifyUnknownAirports = () => {
    if (state.unknownAirports && state.unknownAirports.length > 0) {
      Toast.show(`Unlisted airport(s): ${state.unknownAirports.join(', ')} — verify local timezones`, "warning");
    }
  };

  // --- Magic Mode Controller ---
  const urlParams = new URLSearchParams(window.location.search);
  const isMagicMode = urlParams.get('magic') === 'true';
  const isEmbedded = window.self !== window.top;

  const standardUiView = document.getElementById('standard-ui-view');
  const magicModeView = document.getElementById('magic-mode-view');
  const magicBtnExport = document.getElementById('magic-btn-export');
  const magicExportLabel = document.getElementById('magic-export-label');
  const magicExportIcon = document.getElementById('magic-export-icon');
  const magicBtnReview = document.getElementById('magic-btn-review');
  const btnBackMagic = document.getElementById('btn-back-magic');
  const magicBgBlur = document.getElementById('magic-bg-blur');

  let lastMagicPayload = null;
  let magicReadySignaled = false;

  const signalMagicReady = () => {
    if (magicReadySignaled) return;
    magicReadySignaled = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (isEmbedded) {
          window.parent.postMessage({ type: 'ROSTERCAL_MAGIC_READY' }, '*');
        }
        if (magicModeView) {
          magicModeView.classList.add('magic-ready');
        }
      });
    });
  };

  if (isMagicMode && standardUiView && magicModeView) {
    document.documentElement.classList.add('is-magic-mode', 'magic-transparent');
    document.body.classList.add('magic-transparent');
    standardUiView.classList.add('hidden');
    magicModeView.classList.remove('hidden');
    magicModeView.classList.add('flex');

    // Only show internal blur layer when opened standalone; in bookmarklet mode the host page provides native blur
    if (magicBgBlur && !isEmbedded) {
      magicBgBlur.classList.remove('hidden');
      signalMagicReady();
    }

    // Inform host bookmarklet that RosterCal is booted and ready to receive ROSTER_DATA silently
    if (isEmbedded) {
      window.parent.postMessage({ type: 'ROSTERCAL_BOOTED' }, '*');
    }
  }

  // Click blurred area outside the glass sheet or press Escape to dismiss overlay
  if (isMagicMode && magicModeView && isEmbedded) {
    magicModeView.addEventListener('click', (e) => {
      if (e.target === magicModeView) {
        window.parent.postMessage({ type: 'ROSTERCAL_CLOSE' }, '*');
      }
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.parent.postMessage({ type: 'ROSTERCAL_CLOSE' }, '*');
      }
    });
  }

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'ROSTER_DATA') {
      const rawText = event.data.text;
      if (!rawText || rawText === lastMagicPayload) return;
      lastMagicPayload = rawText;

      try {
        state.parsedEvents = ParserEngine.parseRawText(rawText);
        if (rawInput) rawInput.value = rawText;
        updateFilterCounts();
        renderActiveView();
        notifyUnknownAirports();

        if (btnExport) btnExport.disabled = state.parsedEvents.length === 0;
        if (eventCount) eventCount.innerText = `${state.parsedEvents.length} EK events ready for calendar sync`;

        if (isMagicMode) {
          updateMagicStatistics();
          signalMagicReady();
        }
      } catch (err) {
        console.error("Magic mode parsing error:", err);
        Toast.show("Failed to instantly parse roster. Please review manually.", "error");
        if (isMagicMode) signalMagicReady();
      }
    }
  });

  function updateMagicStatistics() {
    let flightCount = 0;
    let layoverCount = 0;
    let turnaroundCount = 0;
    let offCount = 0;
    let totalMs = 0;
    const totalEvents = state.parsedEvents.length;
    const destinations = [];

    const monthNamesLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthTitle = document.getElementById('magic-month-title');
    if (monthTitle) monthTitle.innerText = `${monthNamesLong[state.currentMonth]} ${state.currentYear}`;

    state.parsedEvents.forEach(evt => {
      if (evt.category === 'flight') {
        flightCount++;
        if (evt.startUtc && evt.endUtc) {
          totalMs += (evt.endUtc - evt.startUtc);
        }
        if (evt.destination && evt.destination !== HOME_BASE && !destinations.includes(evt.destination)) {
          destinations.push(evt.destination);
        }
      } else if (evt.category === 'layover') {
        layoverCount++;
      } else if (evt.category === 'turnaround') {
        turnaroundCount++;
      } else if (evt.category === 'off' && evt.isAllDay) {
        offCount++;
      }
    });

    // Update realistic aviation telemetry strip with live roster data
    const destCodeEl = document.getElementById('magic-dest-code');
    const destCityEl = document.getElementById('magic-dest-city');
    const routeSummaryEl = document.getElementById('magic-route-summary');
    const subtitleEl = document.getElementById('magic-subtitle');

    if (destinations.length > 0) {
      const primaryDest = destinations[0];
      const destMeta = state.airports[primaryDest] || BUILTIN_AIRPORTS[primaryDest];
      if (destCodeEl) destCodeEl.innerText = primaryDest;
      if (destCityEl) destCityEl.innerText = destMeta?.city || primaryDest;
      if (routeSummaryEl) {
        routeSummaryEl.innerText = destinations.length === 1
          ? `1 Destination · ${primaryDest}`
          : `${destinations.length} Destinations · ${destinations.slice(0, 3).join(' · ')}`;
      }
    } else if (routeSummaryEl) {
      routeSummaryEl.innerText = totalEvents > 0 ? `${totalEvents} Duties Verified` : "No Duties Detected";
    }

    if (subtitleEl && totalEvents > 0) {
      subtitleEl.innerText = `${totalEvents} calendar events verified with DST-aware airport timezones.`;
    }

    const blockHours = Math.floor(totalMs / (1000 * 60 * 60));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateValue = (id, endValue, suffix = '', duration = 760, delayMs = 0) => {
      const obj = document.getElementById(id);
      if (!obj) return;

      if (prefersReducedMotion || endValue === 0) {
        obj.innerText = endValue + suffix;
        return;
      }

      obj.innerText = "0" + suffix;

      setTimeout(() => {
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          obj.innerText = Math.round(easeProgress * endValue) + suffix;
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      }, delayMs);
    };

    animateValue('stat-flights', flightCount, '', 720, 140);
    animateValue('stat-hours', blockHours, 'h', 820, 180);
    animateValue('stat-layovers', layoverCount, '', 720, 220);
    animateValue('stat-turnarounds', turnaroundCount, '', 720, 260);
    animateValue('stat-off', offCount, '', 720, 300);
    animateValue('stat-events', totalEvents, '', 860, 340);

    if (magicBtnExport) {
      magicBtnExport.disabled = state.parsedEvents.length === 0;
    }
  }

  let exportFeedbackTimer = null;
  if (magicBtnExport) {
    magicBtnExport.addEventListener('click', () => {
      if (btnExport) btnExport.click();

      magicBtnExport.classList.add('is-exported');
      if (magicExportLabel) magicExportLabel.innerText = "Calendar Exported (.ics)";
      if (magicExportIcon) {
        magicExportIcon.innerHTML = '<path d="M20 6 9 17l-5-5" />';
      }

      clearTimeout(exportFeedbackTimer);
      exportFeedbackTimer = setTimeout(() => {
        magicBtnExport.classList.remove('is-exported');
        if (magicExportLabel) magicExportLabel.innerText = "Download .ics Calendar";
        if (magicExportIcon) {
          magicExportIcon.innerHTML = '<path d="M12 3v12" /><path d="m7 11 5 5 5-5" /><path d="M5 20h14" />';
        }
      }, 2400);
    });
  }

  if (magicBtnReview) {
    magicBtnReview.addEventListener('click', () => {
      document.documentElement.classList.remove('is-magic-mode', 'magic-transparent');
      document.body.classList.remove('magic-transparent');
      if (isEmbedded) document.body.classList.add('magic-review-embedded');

      if (magicModeView) {
        magicModeView.classList.remove('flex');
        magicModeView.classList.add('hidden');
      }
      if (standardUiView) {
        standardUiView.classList.remove('hidden');
      }
      if (btnBackMagic) {
        btnBackMagic.classList.remove('hidden');
        btnBackMagic.classList.add('flex');
      }

      const leftCol = document.querySelector('.lg\\:col-span-5');
      const rightCol = document.querySelector('.lg\\:col-span-7');
      if (leftCol) leftCol.classList.add('hidden');
      if (rightCol) {
        rightCol.classList.replace('lg:col-span-7', 'lg:col-span-12');
        rightCol.classList.add('max-w-4xl', 'mx-auto', 'w-full');
      }
    });
  }

  if (btnBackMagic) {
    btnBackMagic.addEventListener('click', () => {
      document.documentElement.classList.add('is-magic-mode', 'magic-transparent');
      document.body.classList.add('magic-transparent');
      document.body.classList.remove('magic-review-embedded');
      if (standardUiView) standardUiView.classList.add('hidden');
      if (magicModeView) {
        magicModeView.classList.remove('hidden');
        magicModeView.classList.add('flex', 'magic-ready');
      }
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('✅ RosterCal Service Worker Registered.'))
        .catch(err => console.error('⚠️ SW Registration Failed:', err));
    });
  }

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'border-blue-500/50');
        b.classList.add('bg-slate-900/90', 'text-slate-400', 'border-slate-700/80');
      });
      const target = e.currentTarget;
      target.classList.remove('bg-slate-900/90', 'text-slate-400', 'border-slate-700/80');
      target.classList.add('bg-blue-600', 'text-white', 'border-blue-500/50');

      state.activeFilter = target.getAttribute('data-filter');
      renderTable();
    });
  });

  if (rawInput && pasteOverlay) {
    rawInput.addEventListener("paste", () => {
      setTimeout(() => {
        pasteOverlay.classList.remove("opacity-0");
        pasteOverlay.classList.add("opacity-100");
        setTimeout(() => {
          pasteOverlay.classList.remove("opacity-100");
          pasteOverlay.classList.add("opacity-0");
        }, 1800);
      }, 50);
    });
  }

  if (btnClearBox && rawInput) {
    btnClearBox.addEventListener("click", () => {
      rawInput.value = "";
      rawInput.focus();
      if (clearOverlay) {
        clearOverlay.classList.remove("opacity-0");
        clearOverlay.classList.add("opacity-100");
        setTimeout(() => {
          clearOverlay.classList.remove("opacity-100");
          clearOverlay.classList.add("opacity-0");
        }, 1800);
      }
    });
  }

  if (btnInfo) btnInfo.addEventListener("click", () => { infoModal.classList.remove("hidden"); infoModal.classList.add("flex"); });
  if (btnCloseInfo) btnCloseInfo.addEventListener("click", () => { infoModal.classList.remove("flex"); infoModal.classList.add("hidden"); });
  if (btnGotIt) btnGotIt.addEventListener("click", () => { infoModal.classList.remove("flex"); infoModal.classList.add("hidden"); });
  if (infoModal) infoModal.addEventListener("click", (e) => { if (e.target === infoModal) { infoModal.classList.remove("flex"); infoModal.classList.add("hidden"); } });

  const btnOpenPrefs = document.getElementById("btn-open-prefs");
  const btnClosePrefs = document.getElementById("btn-close-prefs");
  const btnSavePrefs = document.getElementById("btn-save-prefs");
  const btnResetPrefs = document.getElementById("btn-reset-prefs");

  const prefCalName = document.getElementById("pref-cal-name");
  const prefFlightTitle = document.getElementById("pref-flight-title");
  const prefDutyTitle = document.getElementById("pref-duty-title");
  const prefReportTime = document.getElementById("pref-report-time");
  const prefFR24 = document.getElementById("pref-fr24-link");
  const prefAutoLayovers = document.getElementById("pref-auto-layovers");
  const prefAlarmReminder = document.getElementById("pref-alarm-reminder");
  const previewFlight = document.getElementById("preview-flight-format");
  const previewDuty = document.getElementById("preview-duty-format");

  if (prefCalName) prefCalName.value = state.preferences.calendarName;
  if (prefFlightTitle) prefFlightTitle.value = state.preferences.flightTitleFormat;
  if (prefDutyTitle) prefDutyTitle.value = state.preferences.dutyTitleFormat;
  if (prefReportTime) prefReportTime.value = state.preferences.includeReport;
  if (prefFR24) prefFR24.value = state.preferences.includeFR24.toString();
  if (prefAutoLayovers) prefAutoLayovers.value = state.preferences.autoLayovers.toString();
  if (prefAlarmReminder) prefAlarmReminder.value = state.preferences.alarmReminder;

  const updateModalPreviews = () => {
    if (previewFlight && prefFlightTitle) {
      const val = prefFlightTitle.value;
      if (val === 'CITY_IATA') previewFlight.innerText = "✈️ Dubai (DXB) - London (LHR)";
      else if (val === 'DEP_IATA_ARR_IATA') previewFlight.innerText = "✈️ DXB - LHR";
      else if (val === 'LOCAL_CODES') previewFlight.innerText = "✈️ 01:00L-07:30L [EK001]";
    }
    if (previewDuty && prefDutyTitle) {
      const val = prefDutyTitle.value;
      if (val === 'EMOJI_TITLE') previewDuty.innerText = "🏨 Layover in LHR (24:30)";
      else if (val === 'CODE_TITLE') previewDuty.innerText = "🏨 LAY - Layover in LHR (24:30)";
      else if (val === 'CODE_ONLY') previewDuty.innerText = "🏨 LAY (24:30)";
    }
  };

  if (prefFlightTitle) prefFlightTitle.addEventListener("change", updateModalPreviews);
  if (prefDutyTitle) prefDutyTitle.addEventListener("change", updateModalPreviews);

  if (btnOpenPrefs && prefsModal) {
    btnOpenPrefs.addEventListener("click", () => {
      updateModalPreviews();
      prefsModal.classList.remove("hidden");
      prefsModal.classList.add("flex");
    });
  }
  if (btnClosePrefs && prefsModal) {
    btnClosePrefs.addEventListener("click", () => { prefsModal.classList.remove("flex"); prefsModal.classList.add("hidden"); });
  }
  if (prefsModal) {
    prefsModal.addEventListener("click", (e) => { if (e.target === prefsModal) { prefsModal.classList.remove("flex"); prefsModal.classList.add("hidden"); } });
  }

  if (btnResetPrefs) {
    btnResetPrefs.addEventListener("click", () => {
      if (prefCalName) prefCalName.value = "RosterCal";
      if (prefReportTime) prefReportTime.value = "HOME_ONLY";
      if (prefFR24) prefFR24.value = "true";
      if (prefAutoLayovers) prefAutoLayovers.value = "true";
      if (prefFlightTitle) prefFlightTitle.value = "CITY_IATA";
      if (prefDutyTitle) prefDutyTitle.value = "EMOJI_TITLE";
      if (prefAlarmReminder) prefAlarmReminder.value = "120";
      updateModalPreviews();
    });
  }

  if (btnSavePrefs) {
    btnSavePrefs.addEventListener("click", () => {
      state.preferences = {
        calendarName: prefCalName?.value || "Emirates Roster",
        flightTitleFormat: prefFlightTitle?.value || "CITY_IATA",
        dutyTitleFormat: prefDutyTitle?.value || "EMOJI_TITLE",
        includeReport: prefReportTime?.value || "HOME_ONLY",
        includeFR24: prefFR24 ? prefFR24.value === "true" : true,
        autoLayovers: prefAutoLayovers ? prefAutoLayovers.value === "true" : true,
        includeLocal: true,
        alarmReminder: prefAlarmReminder?.value || "120"
      };

      localStorage.setItem('rosterCalPrefs', JSON.stringify(state.preferences));

      if (rawInput && rawInput.value.trim()) {
        try {
          state.parsedEvents = ParserEngine.parseRawText(rawInput.value);
          updateFilterCounts();
          if (eventCount) eventCount.innerText = `${state.parsedEvents.length} EK events ready for calendar sync`;
          if (isMagicMode) updateMagicStatistics();
        } catch (e) { console.error("Reparse error:", e); }
      }

      if (prefsModal) {
        prefsModal.classList.remove("flex");
        prefsModal.classList.add("hidden");
      }
      renderActiveView();
    });
  }

  if (btnViewList && listViewContainer && listToolbar) {
    btnViewList.addEventListener("click", () => {
      state.activeView = 'list';
      btnViewList.className = "px-2.5 py-1 rounded-md font-semibold bg-blue-600 text-white cursor-pointer flex items-center space-x-1 text-xs shadow-sm btn";
      if (btnViewMonth) btnViewMonth.className = "px-2.5 py-1 rounded-md font-semibold text-slate-400 hover:text-white cursor-pointer flex items-center space-x-1 text-xs btn";
      listViewContainer.classList.remove("hidden");
      listToolbar.classList.remove("hidden");
      if (monthViewContainer) monthViewContainer.classList.add("hidden");
      renderTable();
    });
  }

  if (btnViewMonth && monthViewContainer) {
    btnViewMonth.addEventListener("click", () => {
      state.activeView = 'month';
      btnViewMonth.className = "px-2.5 py-1 rounded-md font-semibold bg-blue-600 text-white cursor-pointer flex items-center space-x-1 text-xs shadow-sm btn";
      if (btnViewList) btnViewList.className = "px-2.5 py-1 rounded-md font-semibold text-slate-400 hover:text-white cursor-pointer flex items-center space-x-1 text-xs btn";
      monthViewContainer.classList.remove("hidden");
      if (listViewContainer) listViewContainer.classList.add("hidden");
      if (listToolbar) listToolbar.classList.add("hidden");
      renderMonthView();
    });
  }

  if (tabText && panelText) {
    tabText.addEventListener("click", () => {
      tabText.className = "flex-1 sm:flex-none pb-1.5 border-b-2 border-blue-500 text-blue-400 px-2.5 cursor-pointer text-[10px] font-semibold uppercase btn";
      if (tabFile) tabFile.className = "flex-1 sm:flex-none pb-1.5 border-b-2 border-transparent text-slate-400 hover:text-slate-200 px-2.5 cursor-pointer text-[10px] font-semibold uppercase btn";
      panelText.classList.remove("hidden");
      if (panelFile) panelFile.classList.add("hidden");
    });
  }

  if (tabFile && panelFile) {
    tabFile.addEventListener("click", () => {
      tabFile.className = "flex-1 sm:flex-none pb-1.5 border-b-2 border-blue-500 text-blue-400 px-2.5 cursor-pointer text-[10px] font-semibold uppercase btn";
      if (tabText) tabText.className = "flex-1 sm:flex-none pb-1.5 border-b-2 border-transparent text-slate-400 hover:text-slate-200 px-2.5 cursor-pointer text-[10px] font-semibold uppercase btn";
      panelFile.classList.remove("hidden");
      if (panelText) panelText.classList.add("hidden");
    });
  }

  const fileInput = document.getElementById("file-input");
  if (fileInput && rawInput && tabText) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => { rawInput.value = event.target.result; tabText.click(); };
        reader.readAsText(file);
      }
    });
  }

  if (btnParse && rawInput) {
    btnParse.addEventListener("click", () => {
      const text = rawInput.value;
      if (!text.trim()) {
        Toast.show("Please paste your Emirates roster text first.", "error");
        return;
      }

      try {
        state.parsedEvents = ParserEngine.parseRawText(text);
      } catch (err) {
        console.error("Fatal roster parsing error:", err);
        Toast.show("Error parsing roster text. Please check the content.", "error");
        return;
      }

      try {
        updateFilterCounts();
        renderActiveView();
        notifyUnknownAirports();

        if (btnExport) btnExport.disabled = state.parsedEvents.length === 0;
        if (eventCount) eventCount.innerText = `${state.parsedEvents.length} EK events ready for calendar sync`;
      } catch (uiErr) {
        console.error("UI rendering warning:", uiErr);
      }
    });
  }

  if (tzModeSelect) {
    tzModeSelect.addEventListener("change", (e) => { state.timezoneMode = e.target.value; renderTable(); });
  }

  if (toggleAll) {
    toggleAll.addEventListener("change", (e) => {
      const checked = e.target.checked;
      state.parsedEvents.forEach(evt => evt.enabled = checked);
      renderActiveView();
    });
  }

  if (btnExport) {
    btnExport.addEventListener("click", () => {
      const icsContent = ICalGenerator.generate(state.parsedEvents);
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${state.preferences.calendarName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    });
  }

  function updateFilterCounts() {
    const counts = { ALL: 0, flight: 0, report: 0, layover: 0, training: 0, off: 0 };
    state.parsedEvents.forEach(evt => {
      counts.ALL++;
      if (evt.category === 'standby' || evt.category === 'training') counts.training++;
      else if (counts[evt.category] !== undefined) counts[evt.category]++;
    });

    const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
    setTxt("count-all", counts.ALL);
    setTxt("count-flight", counts.flight);
    setTxt("count-report", counts.report);
    setTxt("count-layover", counts.layover);
    setTxt("count-training", counts.training);
    setTxt("count-off", counts.off);
  }

  function renderActiveView() {
    if (state.activeView === 'month') {
      renderMonthView();
    } else {
      renderTable();
    }
  }

  function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    const filteredEvents = state.parsedEvents.filter(evt => {
      if (state.activeFilter === 'ALL') return true;
      if (state.activeFilter === 'training') return evt.category === 'training' || evt.category === 'standby';
      return evt.category === state.activeFilter;
    });

    if (filteredEvents.length === 0) {
      if (emptyState) tableBody.appendChild(emptyState);
      return;
    }

    const formatTime = (utcDate, stationCode) => {
      if (!utcDate || isNaN(utcDate.getTime())) return "--:--";
      if (state.timezoneMode === 'UTC') return utcDate.toISOString().slice(11, 16) + " Z";

      const airport = state.airports[stationCode] || BUILTIN_AIRPORTS[stationCode];
      const ianaZone = airport?.iana || "Asia/Dubai";
      try {
        const formatted = new Intl.DateTimeFormat('en-GB', {
          timeZone: ianaZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(utcDate);
        return formatted.startsWith('24:') ? '00:' + formatted.slice(3) : formatted;
      } catch (e) {
        return utcDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      }
    };

    filteredEvents.forEach((evt, index) => {
      const tr = document.createElement("tr");
      tr.className = (evt.enabled ? "hover:bg-slate-800/40 transition" : "opacity-40 bg-slate-950/40 transition") + " animate-fade-in";
      tr.style.animationDelay = `${Math.min(index * 20, 350)}ms`;

      const startStation = evt.origin || evt.locationCode || HOME_BASE;
      const endStation = (evt.category === 'flight' ? evt.destination : (evt.destination || evt.locationCode || evt.origin)) || HOME_BASE;

      const dynamicTitle = FormatEngine.getTitle(evt);
      const timeDisplay = evt.isAllDay
        ? `<span class="bg-emerald-950/90 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded text-[10px] font-semibold">All Day (24h)</span>`
        : `${formatTime(evt.startUtc, startStation)} - ${formatTime(evt.endUtc, endStation)}`;

      tr.innerHTML = `
        <td class="py-2.5 px-2.5"><input type="checkbox" ${evt.enabled ? 'checked' : ''} data-id="${evt.id}" class="row-toggle rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0 cursor-pointer w-4 h-4 btn"></td>
        <td class="py-2.5 px-2 font-mono text-[11px] text-slate-300 whitespace-nowrap">${evt.dateStr}</td>
        <td class="py-2.5 px-2 font-medium text-slate-200">${dynamicTitle}</td>
        <td class="py-2.5 px-2 text-slate-400 text-[11px]">${evt.origin && evt.origin !== HOME_BASE && evt.category === 'flight' ? evt.origin + ' ➡️ ' + evt.destination : evt.location}</td>
        <td class="py-2.5 px-2 font-mono text-[11px] text-blue-300 whitespace-nowrap">${timeDisplay}</td>
      `;

      const checkbox = tr.querySelector(".row-toggle");
      if (checkbox) {
        checkbox.addEventListener("change", (e) => {
          evt.enabled = e.target.checked;
          tr.className = (evt.enabled ? "hover:bg-slate-800/40 transition" : "opacity-40 bg-slate-950/40 transition") + " animate-fade-in";
        });
      }

      tableBody.appendChild(tr);
    });
  }

  function renderMonthView() {
    if (!calendarGridDays || !monthViewTitle) return;
    calendarGridDays.innerHTML = "";
    const year = state.currentYear;
    const month = state.currentMonth;

    const monthNamesLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthViewTitle.innerText = `${monthNamesLong[month]} ${year}`;

    if (state.parsedEvents.length === 0) {
      calendarGridDays.innerHTML = `<div class="col-span-7 py-12 text-center text-slate-500 text-xs animate-fade-in">No roster parsed to display in calendar grid.</div>`;
      return;
    }

    const firstDayIndex = new Date(year, month, 1).getDay();
    const adjustedFirstDay = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const eventsByDay = {};
    state.parsedEvents.forEach(evt => {
      if (evt.month === month && evt.year === year) {
        if (!eventsByDay[evt.day]) eventsByDay[evt.day] = [];
        eventsByDay[evt.day].push(evt);
      }
    });

    for (let i = 0; i < adjustedFirstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "calendar-day-empty";
      calendarGridDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const cell = document.createElement("div");
      cell.className = "calendar-day-cell flex flex-col justify-between animate-fade-in";

      const dayHeader = document.createElement("div");
      dayHeader.className = "flex items-center justify-between text-[10px] font-bold text-slate-400 mb-0.5";
      dayHeader.innerHTML = `<span>${day}</span>`;
      cell.appendChild(dayHeader);

      const eventsContainer = document.createElement("div");
      eventsContainer.className = "space-y-0.5 overflow-y-auto max-h-[42px]";

      const dayEvents = eventsByDay[day] || [];
      if (dayEvents.length > 0) {
        dayEvents.forEach(evt => {
          const badge = document.createElement("div");
          let badgeColor = "bg-blue-950/80 text-blue-300 border-blue-800/60";
          if (evt.category === 'report') badgeColor = "bg-violet-950/80 text-violet-300 border-violet-800/60";
          if (evt.category === 'standby' || evt.category === 'training' || evt.category === 'layover' || evt.category === 'turnaround') badgeColor = "bg-amber-950/80 text-amber-300 border-amber-800/60";
          if (evt.category === 'off' || evt.isAllDay) badgeColor = "bg-emerald-950/80 text-emerald-300 border-emerald-800/60";
          if (!evt.enabled) badgeColor = "opacity-30 bg-slate-900 text-slate-500 border-slate-800";

          badge.className = `text-[9px] px-1 py-0.5 rounded border truncate font-mono ${badgeColor}`;
          badge.title = FormatEngine.getTitle(evt);
          badge.innerText = `${evt.emoji || '📌'} ${evt.code === 'FLT' || evt.code === 'REP' ? evt.flightNum : evt.code}`;
          eventsContainer.appendChild(badge);
        });
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "text-[9px] text-slate-600 italic";
        placeholder.innerText = "-";
        eventsContainer.appendChild(placeholder);
      }

      cell.appendChild(eventsContainer);
      calendarGridDays.appendChild(cell);
    }
  }
});
