/**
 * RosterCal — Emirates (EK) Cabin Crew Edition
 * Architecture: ES6 Modular Classes | 100% Client-Side Privacy
 * Features: Zero-Latency Instant Boot | Native IANA DST Timezones | Surrogate-Safe iCal Folding | Custom Emojis | PWA Support
 */

const HOME_BASE = "DXB";
const HOME_UTC_OFFSET = 4; // UAE Standard Time (No DST)

// --- Built-in Instant Memory Database (145+ Airports) ---
const BUILTIN_AIRPORTS = {
  ABJ: { icao: "DIAP", city: "Abidjan", name: "Félix-Houphouët-Boigny International Airport", iana: "Africa/Abidjan", utc_offset: 0 },
  ABV: { icao: "DNAA", city: "Abuja", name: "Nnamdi Azikiwe International Airport", iana: "Africa/Lagos", utc_offset: 1 },
  ACC: { icao: "DGAA", city: "Accra", name: "Kotoka International Airport", iana: "Africa/Accra", utc_offset: 0 },
  ADD: { icao: "HAAB", city: "Addis Ababa", name: "Addis Ababa Bole International Airport", iana: "Africa/Addis_Ababa", utc_offset: 3 },
  ADL: { icao: "YPAD", city: "Adelaide", name: "Adelaide Airport", iana: "Australia/Adelaide", utc_offset: 9.5 },
  AKL: { icao: "NZAA", city: "Auckland", name: "Auckland Airport", iana: "Pacific/Auckland", utc_offset: 12 },
  ALG: { icao: "DAAG", city: "Algiers", name: "Houari Boumediene Airport", iana: "Africa/Algiers", utc_offset: 1 },
  AMD: { icao: "VAAH", city: "Ahmedabad", name: "Sardar Vallabhbhai Patel International Airport", iana: "Asia/Kolkata", utc_offset: 5.5 },
  AMM: { icao: "OJAI", city: "Amman", name: "Queen Alia International Airport", iana: "Asia/Amman", utc_offset: 3 },
  AMS: { icao: "EHAM", city: "Amsterdam", name: "Amsterdam Airport Schiphol", iana: "Europe/Amsterdam", utc_offset: 1 },
  ARN: { icao: "ESSA", city: "Stockholm", name: "Stockholm Arlanda Airport", iana: "Europe/Stockholm", utc_offset: 1 },
  ATH: { icao: "LGAV", city: "Athens", name: "Athens International Airport", iana: "Europe/Athens", utc_offset: 2 },
  AUH: { icao: "OMAA", city: "Abu Dhabi", name: "Zayed International Airport", iana: "Asia/Dubai", utc_offset: 4 },
  BAH: { icao: "OBBI", city: "Bahrain", name: "Bahrain International Airport", iana: "Asia/Bahrain", utc_offset: 3 },
  BCN: { icao: "LEBL", city: "Barcelona", name: "Josep Tarradellas Barcelona-El Prat Airport", iana: "Europe/Madrid", utc_offset: 1 },
  BEY: { icao: "OLBA", city: "Beirut", name: "Beirut-Rafic Hariri International Airport", iana: "Asia/Beirut", utc_offset: 2 },
  BGW: { icao: "ORBI", city: "Baghdad", name: "Baghdad International Airport", iana: "Asia/Baghdad", utc_offset: 3 },
  BHX: { icao: "EGBB", city: "Birmingham", name: "Birmingham Airport", iana: "Europe/London", utc_offset: 0 },
  BKK: { icao: "VTBS", city: "Bangkok", name: "Suvarnabhumi Airport", iana: "Asia/Bangkok", utc_offset: 7 },
  BLQ: { icao: "LIPE", city: "Bologna", name: "Bologna Guglielmo Marconi Airport", iana: "Europe/Rome", utc_offset: 1 },
  BLR: { icao: "VOBL", city: "Bengaluru", name: "Kempegowda International Airport", iana: "Asia/Kolkata", utc_offset: 5.5 },
  BNE: { icao: "YBBN", city: "Brisbane", name: "Brisbane Airport", iana: "Australia/Brisbane", utc_offset: 10 },
  BOG: { icao: "SKBO", city: "Bogotá", name: "El Dorado International Airport", iana: "America/Bogota", utc_offset: -5 },
  BOM: { icao: "VABB", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International Airport", iana: "Asia/Kolkata", utc_offset: 5.5 },
  BOS: { icao: "KBOS", city: "Boston", name: "Logan International Airport", iana: "America/New_York", utc_offset: -5 },
  BRU: { icao: "EBBR", city: "Brussels", name: "Brussels Airport", iana: "Europe/Brussels", utc_offset: 1 },
  BSR: { icao: "ORMM", city: "Basra", name: "Basra International Airport", iana: "Asia/Baghdad", utc_offset: 3 },
  BUD: { icao: "LHBP", city: "Budapest", name: "Budapest Ferenc Liszt International Airport", iana: "Europe/Budapest", utc_offset: 1 },
  CAI: { icao: "HECA", city: "Cairo", name: "Cairo International Airport", iana: "Africa/Cairo", utc_offset: 2 },
  CAN: { icao: "ZGGG", city: "Guangzhou", name: "Guangzhou Baiyun International Airport", iana: "Asia/Shanghai", utc_offset: 8 },
  CCU: { icao: "VECC", city: "Kolkata", name: "Netaji Subhash Chandra Bose International Airport", iana: "Asia/Kolkata", utc_offset: 5.5 },
  CDG: { icao: "LFPG", city: "Paris", name: "Charles de Gaulle Airport", iana: "Europe/Paris", utc_offset: 1 },
  CEB: { icao: "RPVM", city: "Cebu", name: "Mactan-Cebu International Airport", iana: "Asia/Manila", utc_offset: 8 },
  CGK: { icao: "WIII", city: "Jakarta", name: "Soekarno-Hatta International Airport", iana: "Asia/Jakarta", utc_offset: 7 },
  CHC: { icao: "NZCH", city: "Christchurch", name: "Christchurch Airport", iana: "Pacific/Auckland", utc_offset: 12 },
  CKY: { icao: "GUCY", city: "Conakry", name: "Ahmed Sékou Touré International Airport", iana: "Africa/Conakry", utc_offset: 0 },
  CMB: { icao: "VCBI", city: "Colombo", name: "Bandaranaike International Airport", iana: "Asia/Colombo", utc_offset: 5.5 },
  CMN: { icao: "GMMN", city: "Casablanca", name: "Mohammed V International Airport", iana: "Africa/Casablanca", utc_offset: 1 },
  COK: { icao: "VOCI", city: "Kochi", name: "Cochin International Airport", iana: "Asia/Kolkata", utc_offset: 5.5 },
  CPH: { icao: "EKCH", city: "Copenhagen", name: "Copenhagen Airport", iana: "Europe/Copenhagen", utc_offset: 1 },
  CPT: { icao: "FACT", city: "Cape Town", name: "Cape Town International Airport", iana: "Africa/Johannesburg", utc_offset: 2 },
  CRK: { icao: "RPLC", city: "Clark", name: "Clark International Airport", iana: "Asia/Manila", utc_offset: 8 },
  DAC: { icao: "VGHS", city: "Dhaka", name: "Hazrat Shahjalal International Airport", iana: "Asia/Dhaka", utc_offset: 6 },
  DAR: { icao: "HTDA", city: "Dar es Salaam", name: "Julius Nyerere International Airport", iana: "Africa/Dar_es_Salaam", utc_offset: 3 },
  DEL: { icao: "VIDP", city: "Delhi", name: "Indira Gandhi International Airport", iana: "Asia/Kolkata", utc_offset: 5.5 },
  DFW: { icao: "KDFW", city: "Dallas/Fort Worth", name: "DFW International Airport", iana: "America/Chicago", utc_offset: -6 },
  DME: { icao: "UUDD", city: "Moscow", name: "Moscow Domodedovo Airport", iana: "Europe/Moscow", utc_offset: 3 },
  DMM: { icao: "OEDF", city: "Dammam", name: "King Fahd International Airport", iana: "Asia/Riyadh", utc_offset: 3 },
  DOH: { icao: "OTHH", city: "Doha", name: "Hamad International Airport", iana: "Asia/Qatar", utc_offset: 3 },
  DPS: { icao: "WADD", city: "Bali", name: "Ngurah Rai International Airport", iana: "Asia/Makassar", utc_offset: 8 },
  DSS: { icao: "GOBD", city: "Dakar", name: "Blaise Diagne International Airport", iana: "Africa/Dakar", utc_offset: 0 },
  DUB: { icao: "EIDW", city: "Dublin", name: "Dublin Airport", iana: "Europe/Dublin", utc_offset: 0 },
  DUR: { icao: "FALE", city: "Durban", name: "King Shaka International Airport", iana: "Africa/Johannesburg", utc_offset: 2 },
  DUS: { icao: "EDDL", city: "Düsseldorf", name: "Düsseldorf Airport", iana: "Europe/Berlin", utc_offset: 1 },
  DWC: { icao: "OMDW", city: "Dubai", name: "Al Maktoum International Airport", iana: "Asia/Dubai", utc_offset: 4 },
  DXB: { icao: "OMDB", city: "Dubai", name: "Dubai International Airport", iana: "Asia/Dubai", utc_offset: 4, hub: true },
  EBB: { icao: "HUEN", city: "Entebbe", name: "Entebbe International Airport", iana: "Africa/Kampala", utc_offset: 3 },
  EBL: { icao: "ORER", city: "Erbil", name: "Erbil International Airport", iana: "Asia/Baghdad", utc_offset: 3 },
  EDI: { icao: "EGPH", city: "Edinburgh", name: "Edinburgh Airport", iana: "Europe/London", utc_offset: 0 },
  EWR: { icao: "KEWR", city: "Newark", name: "Newark Liberty International Airport", iana: "America/New_York", utc_offset: -5 },
  EZE: { icao: "SAEZ", city: "Buenos Aires", name: "Ministro Pistarini International Airport", iana: "America/Argentina/Buenos_Aires", utc_offset: -3 },
  FCO: { icao: "LIRF", city: "Rome", name: "Leonardo da Vinci–Fiumicino Airport", iana: "Europe/Rome", utc_offset: 1 },
  FRA: { icao: "EDDF", city: "Frankfurt", name: "Frankfurt Airport", iana: "Europe/Berlin", utc_offset: 1 },
  GIG: { icao: "SBGL", city: "Rio de Janeiro", name: "Rio de Janeiro/Galeão International Airport", iana: "America/Sao_Paulo", utc_offset: -3 },
  GLA: { icao: "EGPF", city: "Glasgow", name: "Glasgow Airport", iana: "Europe/London", utc_offset: 0 },
  GRU: { icao: "SBGR", city: "São Paulo", name: "Guarulhos International Airport", iana: "America/Sao_Paulo", utc_offset: -3 },
  GVA: { icao: "LSGG", city: "Geneva", name: "Geneva Airport", iana: "Europe/Zurich", utc_offset: 1 },
  HAM: { icao: "EDDH", city: "Hamburg", name: "Hamburg Airport", iana: "Europe/Berlin", utc_offset: 1 },
  HAN: { icao: "VVNB", city: "Hanoi", name: "Noi Bai International Airport", iana: "Asia/Bangkok", utc_offset: 7 },
  HEL: { icao: "EFHK", city: "Helsinki", name: "Helsinki-Vantaa Airport", iana: "Europe/Helsinki", utc_offset: 2 },
  HKG: { icao: "VHHH", city: "Hong Kong", name: "Hong Kong International Airport", iana: "Asia/Hong_Kong", utc_offset: 8 },
  HKT: { icao: "VTSP", city: "Phuket", name: "Phuket International Airport", iana: "Asia/Bangkok", utc_offset: 7 },
  HND: { icao: "RJTT", city: "Tokyo", name: "Haneda Airport", iana: "Asia/Tokyo", utc_offset: 9 },
  HRE: { icao: "FVHA", city: "Harare", name: "Robert Gabriel Mugabe International Airport", iana: "Africa/Harare", utc_offset: 2 },
  HYD: { icao: "VOHS", city: "Hyderabad", name: "Rajiv Gandhi International Airport", iana: "Asia/Kolkata", utc_offset: 5.5 },
  IAD: { icao: "KIAD", city: "Washington D.C.", name: "Dulles International Airport", iana: "America/New_York", utc_offset: -5 },
  IAH: { icao: "KIAH", city: "Houston", name: "George Bush Intercontinental Airport", iana: "America/Chicago", utc_offset: -6 },
  ICN: { icao: "RKSI", city: "Seoul", name: "Incheon International Airport", iana: "Asia/Seoul", utc_offset: 9 },
  IKA: { icao: "OIIE", city: "Tehran", name: "Imam Khomeini International Airport", iana: "Asia/Tehran", utc_offset: 3.5 },
  ISB: { icao: "OPIS", city: "Islamabad", name: "Islamabad International Airport", iana: "Asia/Karachi", utc_offset: 5 },
  IST: { icao: "LTFM", city: "Istanbul", name: "Istanbul Airport", iana: "Europe/Istanbul", utc_offset: 3 },
  JED: { icao: "OEJN", city: "Jeddah", name: "King Abdulaziz International Airport", iana: "Asia/Riyadh", utc_offset: 3 },
  JFK: { icao: "KJFK", city: "New York", name: "John F. Kennedy International Airport", iana: "America/New_York", utc_offset: -5 },
  JNB: { icao: "FAOR", city: "Johannesburg", name: "O.R. Tambo International Airport", iana: "Africa/Johannesburg", utc_offset: 2 },
  KHI: { icao: "OPKC", city: "Karachi", name: "Jinnah International Airport", iana: "Asia/Karachi", utc_offset: 5 },
  KIX: { icao: "RJBB", city: "Osaka", name: "Kansai International Airport", iana: "Asia/Tokyo", utc_offset: 9 },
  KRT: { icao: "HSSS", city: "Khartoum", name: "Khartoum International Airport", iana: "Africa/Khartoum", utc_offset: 2 },
  KUL: { icao: "WMKK", city: "Kuala Lumpur", name: "Kuala Lumpur International Airport", iana: "Asia/Kuala_Lumpur", utc_offset: 8 },
  KWI: { icao: "OKBK", city: "Kuwait City", name: "Kuwait International Airport", iana: "Asia/Kuwait", utc_offset: 3 },
  LAD: { icao: "FNLU", city: "Luanda", name: "Quatro de Fevereiro Airport", iana: "Africa/Luanda", utc_offset: 1 },
  LAX: { icao: "KLAX", city: "Los Angeles", name: "Los Angeles International Airport", iana: "America/Los_Angeles", utc_offset: -8 },
  LCA: { icao: "LCLK", city: "Larnaca", name: "Larnaca International Airport", iana: "Asia/Nicosia", utc_offset: 2 },
  LED: { icao: "ULLI", city: "St. Petersburg", name: "Pulkovo Airport", iana: "Europe/Moscow", utc_offset: 3 },
  LGW: { icao: "EGKK", city: "London", name: "Gatwick Airport", iana: "Europe/London", utc_offset: 0 },
  LHE: { icao: "OPLA", city: "Lahore", name: "Allama Iqbal International Airport", iana: "Asia/Karachi", utc_offset: 5 },
  LHR: { icao: "EGLL", city: "London", name: "Heathrow Airport", iana: "Europe/London", utc_offset: 0 },
  LIS: { icao: "LPPT", city: "Lisbon", name: "Humberto Delgado Airport", iana: "Europe/Lisbon", utc_offset: 0 },
  LOS: { icao: "DNMM", city: "Lagos", name: "Murtala Muhammed International Airport", iana: "Africa/Lagos", utc_offset: 1 },
  LUN: { icao: "FLKK", city: "Lusaka", name: "Kenneth Kaunda International Airport", iana: "Africa/Lusaka", utc_offset: 2 },
  LYS: { icao: "LFLL", city: "Lyon", name: "Lyon-Saint Exupéry Airport", iana: "Europe/Paris", utc_offset: 1 },
  MAA: { icao: "VOMM", city: "Chennai", name: "Chennai International Airport", iana: "Asia/Kolkata", utc_offset: 5.5 },
  MAD: { icao: "LEMD", city: "Madrid", name: "Adolfo Suárez Madrid–Barajas Airport", iana: "Europe/Madrid", utc_offset: 1 },
  MAN: { icao: "EGCC", city: "Manchester", name: "Manchester Airport", iana: "Europe/London", utc_offset: 0 },
  MCO: { icao: "KMCO", city: "Orlando", name: "Orlando International Airport", iana: "America/New_York", utc_offset: -5 },
  MCT: { icao: "OOMS", city: "Muscat", name: "Muscat International Airport", iana: "Asia/Muscat", utc_offset: 4 },
  MED: { icao: "OEMA", city: "Medina", name: "Prince Mohammad bin Abdulaziz International Airport", iana: "Asia/Riyadh", utc_offset: 3 },
  MEL: { icao: "YMML", city: "Melbourne", name: "Melbourne Airport", iana: "Australia/Melbourne", utc_offset: 10 },
  MEX: { icao: "MMMX", city: "Mexico City", name: "Mexico City International Airport", iana: "America/Mexico_City", utc_offset: -6 },
  MIA: { icao: "KMIA", city: "Miami", name: "Miami International Airport", iana: "America/New_York", utc_offset: -5 },
  MLA: { icao: "LMML", city: "Malta", name: "Malta International Airport", iana: "Europe/Malta", utc_offset: 1 },
  MLE: { icao: "VRMM", city: "Malé", name: "Velana International Airport", iana: "Indian/Maldives", utc_offset: 5 },
  MNL: { icao: "RPLL", city: "Manila", name: "Ninoy Aquino International Airport", iana: "Asia/Manila", utc_offset: 8 },
  MRU: { icao: "FIMP", city: "Mauritius", name: "Sir Seewoosagur Ramgoolam International Airport", iana: "Indian/Mauritius", utc_offset: 4 },
  MUC: { icao: "EDDM", city: "Munich", name: "Munich Airport", iana: "Europe/Berlin", utc_offset: 1 },
  MXP: { icao: "LIMC", city: "Milan", name: "Milan Malpensa Airport", iana: "Europe/Rome", utc_offset: 1 },
  NBO: { icao: "HKJK", city: "Nairobi", name: "Jomo Kenyatta International Airport", iana: "Africa/Nairobi", utc_offset: 3 },
  NCE: { icao: "LFMN", city: "Nice", name: "Nice Côte d'Azur Airport", iana: "Europe/Paris", utc_offset: 1 },
  NCL: { icao: "EGNT", city: "Newcastle", name: "Newcastle International Airport", iana: "Europe/London", utc_offset: 0 },
  NRT: { icao: "RJAA", city: "Tokyo", name: "Narita International Airport", iana: "Asia/Tokyo", utc_offset: 9 },
  ORD: { icao: "KORD", city: "Chicago", name: "O'Hare International Airport", iana: "America/Chicago", utc_offset: -6 },
  OSL: { icao: "ENGM", city: "Oslo", name: "Oslo Gardermoen Airport", iana: "Europe/Oslo", utc_offset: 1 },
  PEK: { icao: "ZBAA", city: "Beijing", name: "Beijing Capital International Airport", iana: "Asia/Shanghai", utc_offset: 8 },
  PER: { icao: "YPPH", city: "Perth", name: "Perth Airport", iana: "Australia/Perth", utc_offset: 8 },
  PEW: { icao: "OPPS", city: "Peshawar", name: "Bacha Khan International Airport", iana: "Asia/Karachi", utc_offset: 5 },
  PNH: { icao: "VDPP", city: "Phnom Penh", name: "Phnom Penh International Airport", iana: "Asia/Phnom_Penh", utc_offset: 7 },
  PRG: { icao: "LKPR", city: "Prague", name: "Václav Havel Airport Prague", iana: "Europe/Prague", utc_offset: 1 },
  PVG: { icao: "ZSPD", city: "Shanghai", name: "Shanghai Pudong International Airport", iana: "Asia/Shanghai", utc_offset: 8 },
  RUH: { icao: "OERK", city: "Riyadh", name: "King Khalid International Airport", iana: "Asia/Riyadh", utc_offset: 3 },
  SAW: { icao: "LTFJ", city: "Istanbul", name: "Sabiha Gökçen International Airport", iana: "Europe/Istanbul", utc_offset: 3 },
  SEA: { icao: "KSEA", city: "Seattle", name: "Seattle-Tacoma International Airport", iana: "America/Los_Angeles", utc_offset: -8 },
  SEZ: { icao: "FSIA", city: "Mahé", name: "Seychelles International Airport", iana: "Indian/Mahe", utc_offset: 4 },
  SFO: { icao: "KSFO", city: "San Francisco", name: "San Francisco International Airport", iana: "America/Los_Angeles", utc_offset: -8 },
  SGN: { icao: "VVTS", city: "Ho Chi Minh City", name: "Tan Son Nhat International Airport", iana: "Asia/Ho_Chi_Minh", utc_offset: 7 },
  SIN: { icao: "WSSS", city: "Singapore", name: "Changi Airport", iana: "Asia/Singapore", utc_offset: 8 },
  SKT: { icao: "OPST", city: "Sialkot", name: "Sialkot International Airport", iana: "Asia/Karachi", utc_offset: 5 },
  STN: { icao: "EGSS", city: "London", name: "Stansted Airport", iana: "Europe/London", utc_offset: 0 },
  SYD: { icao: "YSSY", city: "Sydney", name: "Sydney Kingsford Smith Airport", iana: "Australia/Sydney", utc_offset: 10 },
  TLV: { icao: "LLBG", city: "Tel Aviv", name: "Ben Gurion Airport", iana: "Asia/Jerusalem", utc_offset: 2 },
  TNR: { icao: "FMMI", city: "Antananarivo", name: "Ivato International Airport", iana: "Indian/Antananarivo", utc_offset: 3 },
  TPE: { icao: "RCTP", city: "Taipei", name: "Taiwan Taoyuan International Airport", iana: "Asia/Taipei", utc_offset: 8 },
  TRV: { icao: "VOTV", city: "Thiruvananthapuram", name: "Thiruvananthapuram International Airport", iana: "Asia/Kolkata", utc_offset: 5.5 },
  TUN: { icao: "DTTA", city: "Tunis", name: "Tunis-Carthage International Airport", iana: "Africa/Tunis", utc_offset: 1 },
  VCE: { icao: "LIPZ", city: "Venice", name: "Venice Marco Polo Airport", iana: "Europe/Rome", utc_offset: 1 },
  VIE: { icao: "LOWW", city: "Vienna", name: "Vienna International Airport", iana: "Europe/Vienna", utc_offset: 1 },
  WAW: { icao: "EPWA", city: "Warsaw", name: "Warsaw Chopin Airport", iana: "Europe/Warsaw", utc_offset: 1 },
  YUL: { icao: "CYUL", city: "Montreal", name: "Montréal-Pierre Elliott Trudeau International Airport", iana: "America/Toronto", utc_offset: -5 },
  YYZ: { icao: "CYYZ", city: "Toronto", name: "Toronto Pearson International Airport", iana: "America/Toronto", utc_offset: -5 },
  ZAG: { icao: "LDZA", city: "Zagreb", name: "Zagreb Airport", iana: "Europe/Zagreb", utc_offset: 1 },
  ZRH: { icao: "LSZH", city: "Zurich", name: "Zurich Airport", iana: "Europe/Zurich", utc_offset: 1 }
};

// --- Built-in Instant Memory Duty Code Library ---
const BUILTIN_EVENT_CODES = {
  FLT:    { title: "Emirates Flight", emoji: "✈️", category: "flight" },
  EK:     { title: "Emirates Flight", emoji: "✈️", category: "flight" },
  LAY:    { title: "Layover Rest", emoji: "🏨", category: "layover" },
  REST:   { title: "Station Rest", emoji: "🏨", category: "layover" },
  REP:    { title: "Flight Check-in / eGate Report", emoji: "🕒", category: "report" },
  "3877A":{ title: "A380 & B777 Cross Qualification (AM)", emoji: "📚", category: "training" },
  "38HW": { title: "A380 High Density Workshop", emoji: "📚", category: "training" },
  "38SRP":{ title: "JCL Service Refresher A380 (PM)", emoji: "📚", category: "training" },
  ACV:    { title: "Aircraft Visit", emoji: "📚", category: "training" },
  ACVA:   { title: "A350 Aircraft Visit", emoji: "📚", category: "training" },
  "AS-I": { title: "Aviation Security Initial", emoji: "📚", category: "training" },
  C511:   { title: "SEP Recurrent A380/B777 (Day 1)", emoji: "📚", category: "training" },
  C512:   { title: "SEP Recurrent A380/B777 (Day 2)", emoji: "📚", category: "training" },
  C513:   { title: "SEP A350 Conversion (Day 1)", emoji: "📚", category: "training" },
  C514:   { title: "SEP A350 Conversion (Day 2)", emoji: "📚", category: "training" },
  C515:   { title: "SEP A350 Conversion (Day 3)", emoji: "📚", category: "training" },
  C521:   { title: "SEP Recurrent A380/B777 (Day 1)", emoji: "📚", category: "training" },
  C522:   { title: "SEP Recurrent A380/B777 (Day 2)", emoji: "📚", category: "training" },
  C523:   { title: "SEP A350 Conversion (Day 1)", emoji: "📚", category: "training" },
  C524:   { title: "SEP A350 Conversion (Day 2)", emoji: "📚", category: "training" },
  C525:   { title: "SEP A350 Conversion (Day 3)", emoji: "📚", category: "training" },
  C531:   { title: "SEP Recurrent A380/B777 (Day 1)", emoji: "📚", category: "training" },
  C532:   { title: "SEP Recurrent A380/B777 (Day 2)", emoji: "📚", category: "training" },
  C533:   { title: "SEP A350 Conversion (Day 1)", emoji: "📚", category: "training" },
  C534:   { title: "SEP A350 Conversion (Day 2)", emoji: "📚", category: "training" },
  C535:   { title: "SEP A350 Conversion (Day 3)", emoji: "📚", category: "training" },
  C542:   { title: "SEP Recurrent A380/B777 (Day 2)", emoji: "📚", category: "training" },
  C543:   { title: "SEP A350 Conversion (Day 1)", emoji: "📚", category: "training" },
  C551:   { title: "SEP Recurrent A380/B777 (Day 1)", emoji: "📚", category: "training" },
  C552:   { title: "SEP Recurrent A380/B777 (Day 2)", emoji: "📚", category: "training" },
  C553:   { title: "SEP A350 Conversion (Day 1)", emoji: "📚", category: "training" },
  C554:   { title: "SEP A350 Conversion (Day 2)", emoji: "📚", category: "training" },
  C555:   { title: "SEP A350 Conversion (Day 3)", emoji: "📚", category: "training" },
  C55A:   { title: "SVC A350 Conversion (AM)", emoji: "📚", category: "training" },
  C55M:   { title: "SVC A350 Conversion (Mid)", emoji: "📚", category: "training" },
  C882:   { title: "A380 Simulator Refresher", emoji: "📚", category: "training" },
  CCI:    { title: "Cabin Crew CRM Initial", emoji: "📚", category: "training" },
  CSRA:   { title: "CSV Refresher (AM)", emoji: "📚", category: "training" },
  CSTA:   { title: "Cabin Supervisor Trainee Program (AM)", emoji: "📚", category: "training" },
  CSTP:   { title: "Cabin Supervisor Trainee Programme", emoji: "📚", category: "training" },
  "DG-I": { title: "Dangerous Goods Initial", emoji: "📚", category: "training" },
  FA11:   { title: "SEP Airwing Group 1 (Day 1)", emoji: "📚", category: "training" },
  FA12:   { title: "SEP Airwing Group 1 (Day 2)", emoji: "📚", category: "training" },
  FG:     { title: "Airwing SEP", emoji: "📚", category: "training" },
  ER00:   { title: "Adhoc SEP CBA Resit", emoji: "📚", category: "training" },
  ER01:   { title: "Adhoc SEP CBA Resit", emoji: "📚", category: "training" },
  ER02:   { title: "Adhoc SEP CBA Resit", emoji: "📚", category: "training" },
  ER31:   { title: "SEP Recurrent A380/B777 Fleet", emoji: "📚", category: "training" },
  ER311:  { title: "SEP Recurrent A330/340/B777 (Day 1)", emoji: "📚", category: "training" },
  ER312:  { title: "SEP Recurrent A330/340/B777 (Day 2)", emoji: "📚", category: "training" },
  ER32:   { title: "SEP Recurrent A380/B777 Fleet", emoji: "📚", category: "training" },
  ER41:   { title: "SEP C Recurrent", emoji: "📚", category: "training" },
  ER51:   { title: "SEP C Recurrent", emoji: "📚", category: "training" },
  ER511:  { title: "SEP Recurrent A350/A380/B777 (Day 1)", emoji: "📚", category: "training" },
  ER512:  { title: "SEP Recurrent A350/A380/B777 (Day 2)", emoji: "📚", category: "training" },
  ER61:   { title: "SEP C Recurrent (Day 2)", emoji: "📚", category: "training" },
  ER71:   { title: "SEP C Recurrent", emoji: "📚", category: "training" },
  ER81:   { title: "A380/B777 SEP Recurrent", emoji: "📚", category: "training" },
  ER811:  { title: "SEP Recurrent A380/B777 (Day 1)", emoji: "📚", category: "training" },
  ER812:  { title: "SEP Recurrent A380/B777 (Day 2)", emoji: "📚", category: "training" },
  ER82:   { title: "A380/B777 SEP Recurrent", emoji: "📚", category: "training" },
  ER821:  { title: "SEP Recurrent A380/B777 (Day 1)", emoji: "📚", category: "training" },
  ER822:  { title: "SEP Recurrent A380/B777 (Day 2)", emoji: "📚", category: "training" },
  ER831:  { title: "SEP Recurrent A380/B777 (Day 1)", emoji: "📚", category: "training" },
  ER832:  { title: "SEP Recurrent A380/B777 (Day 2)", emoji: "📚", category: "training" },
  ER841:  { title: "SEP Recurrent A380/B777 (Day 1)", emoji: "📚", category: "training" },
  ER842:  { title: "SEP Recurrent A380/B777 (Day 2)", emoji: "📚", category: "training" },
  ER851:  { title: "SEP Recurrent A380/B777 (Day 1)", emoji: "📚", category: "training" },
  ER852:  { title: "SEP Recurrent A380/B777 (Day 2)", emoji: "📚", category: "training" },
  ER861:  { title: "SEP Recurrent A380/B777 (Day 1)", emoji: "📚", category: "training" },
  ER862:  { title: "SEP Recurrent A380/B777 (Day 2)", emoji: "📚", category: "training" },
  ER871:  { title: "SEP Recurrent A380/B777 (Day 1)", emoji: "📚", category: "training" },
  ER872:  { title: "SEP Recurrent A380/B777 (Day 2)", emoji: "📚", category: "training" },
  ER881:  { title: "SEP Recurrent A380/B777 (Day 1)", emoji: "📚", category: "training" },
  ER882:  { title: "SEP Recurrent A380/B777 (Day 2)", emoji: "📚", category: "training" },
  ER91:   { title: "A380/B777 SEP Recurrent", emoji: "📚", category: "training" },
  ER911:  { title: "SEP Recurrent A319 Fleet (Day 1)", emoji: "📚", category: "training" },
  ER912:  { title: "SEP Recurrent A319 Fleet (Day 2)", emoji: "📚", category: "training" },
  ER913:  { title: "SEP Recurrent A319 Fleet (Day 3)", emoji: "📚", category: "training" },
  ER92:   { title: "A380/B777 SEP Recurrent", emoji: "📚", category: "training" },
  FCP1:   { title: "First Class Plating (AM Session)", emoji: "📚", category: "training" },
  FCP1A:  { title: "First Class Plating (AM Session 2)", emoji: "📚", category: "training" },
  FCP2A:  { title: "First Class Plating (Mid Session 2)", emoji: "📚", category: "training" },
  MFP:    { title: "My Flight Performance (CC)", emoji: "📚", category: "training" },
  PSR:    { title: "Peer Support Refresher", emoji: "📚", category: "training" },
  RCY5A:  { title: "Aircraft Refresher A350", emoji: "📚", category: "training" },
  RCY5B:  { title: "Aircraft Refresher A350", emoji: "📚", category: "training" },
  RCY7:   { title: "Aircraft Refresher B777", emoji: "📚", category: "training" },
  RCY71:  { title: "Cabin Crew Aircraft Refresher B777", emoji: "📚", category: "training" },
  RCY73:  { title: "Cabin Crew Aircraft Refresher B777", emoji: "📚", category: "training" },
  RCY74:  { title: "Cabin Crew Aircraft Refresher B777", emoji: "📚", category: "training" },
  RCY8:   { title: "Aircraft Refresher A380", emoji: "📚", category: "training" },
  RCY81:  { title: "Cabin Crew Aircraft Refresher A380", emoji: "📚", category: "training" },
  RCY82:  { title: "Cabin Crew Aircraft Refresher A380", emoji: "📚", category: "training" },
  RCY83:  { title: "Cabin Crew Aircraft Refresher A380", emoji: "📚", category: "training" },
  RCY84:  { title: "Cabin Crew Aircraft Refresher A380", emoji: "📚", category: "training" },
  RMTA:   { title: "SEP Recurrent Remedial (GMT)", emoji: "📚", category: "training" },
  SIMUL:  { title: "Simulator Duty", emoji: "📚", category: "training" },
  SIM:    { title: "Simulator Duty", emoji: "📚", category: "training" },
  SRA4:   { title: "JCL Service Refresher Main Fleet (AM)", emoji: "📚", category: "training" },
  SRCA:   { title: "SEP Recall B777/A380", emoji: "📚", category: "training" },
  SRFF:   { title: "Security Referral", emoji: "📚", category: "training" },
  SRM:    { title: "Service Refresher (Mid Shift)", emoji: "📚", category: "training" },
  SRP2:   { title: "JCL Service Refresher Main Fleet (PM)", emoji: "📚", category: "training" },
  SYAB:   { title: "Ab-Initio Supy Crew", emoji: "📚", category: "training" },
  YSR:    { title: "YC Service Refresher", emoji: "📚", category: "training" },
  RSV:    { title: "Reserve Standby", emoji: "⏳", category: "standby" },
  S17:    { title: "Standby from 17:00 (CC)", emoji: "⏳", category: "standby" },
  S21:    { title: "Standby from 21:00 (CC)", emoji: "⏳", category: "standby" },
  SAB700: { title: "Airport Standby (07:00)", emoji: "🛃", category: "standby" },
  SD:     { title: "Stand Down Reserve", emoji: "🛋️", "category": "standby" },
  SO08:   { title: "Cross Qualification Standby (08:00)", emoji: "⏳", category: "standby" },
  SO21:   { title: "Cross Qualification Standby (21:00)", emoji: "⏳", category: "standby" },
  STBY:   { title: "Standby Reserve", emoji: "⏳", "category": "standby" },
  DO:     { title: "Day Off", emoji: "🏠", "category": "off", isAllDay: true },
  OFF:    { title: "Day Off", emoji: "🏠", "category": "off", isAllDay: true },
  AL:     { title: "Annual Leave", emoji: "🏖️", "category": "off", isAllDay: true },
  FI:     { title: "Emergency Leave", emoji: "🏖️", "category": "off", isAllDay: true },
  FP:     { title: "Folga Pedida (Requested Day Off)", emoji: "🏠", "category": "off", isAllDay: true },
  LV:     { title: "Normal Annual Leave", emoji: "🏖️", "category": "off", isAllDay: true },
  NPA:    { title: "No Planned Assignment", emoji: "🏠", "category": "off", isAllDay: true },
  PSB:    { title: "Peer Support Basic Day Off", emoji: "🏠", "category": "off", isAllDay: true },
  ROF:    { title: "Requested Day Off", emoji: "🏠", "category": "off", isAllDay: true },
  RW:     { title: "Return to Work", emoji: "🏠", "category": "off", isAllDay: true },
  RWS:    { title: "Return to Work Supy", emoji: "🏠", "category": "off", isAllDay: true },
  VA:     { title: "Late / Overdue Vacation", emoji: "🏖️", "category": "off", isAllDay: true },
  XX:     { title: "Day Off", emoji: "🏠", "category": "off", isAllDay: true },
  XXC:    { title: "Company Day Off", emoji: "🏠", "category": "off", isAllDay: true },
  XXP:    { title: "Day Off Planning", emoji: "🏠", "category": "off", isAllDay: true },
  XXR:    { title: "Day Off", emoji: "🏠", "category": "off", isAllDay: true },
  XXV:    { title: "Day Off (Visa Change)", emoji: "🏠", "category": "off", isAllDay: true },
  IV:     { title: "Office Interview", emoji: "👔", "category": "general" },
  O:      { title: "Office Duty", emoji: "🏢", "category": "general" },
  UIV:    { title: "US Visa Interview", emoji: "🛂", "category": "general" },
  UIV1:   { title: "US Visa Interview (AM)", emoji: "🛂", "category": "general" },
  YSA:    { title: "Service Assessment", emoji: "📋", "category": "general" }
};

// --- Global App State (Instant Memory Ready) ---
class AppState {
  constructor() {
    this.airports = { ...BUILTIN_AIRPORTS };
    this.eventCodes = { ...BUILTIN_EVENT_CODES };
    this.parsedEvents = [];
    this.timezoneMode = 'LOCAL';
    this.activeView = 'list';
    this.activeFilter = 'ALL';
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
    this.preferences = {
      calendarName: "Emirates Roster",
      flightTitleFormat: "CITY_IATA",
      dutyTitleFormat: "EMOJI_TITLE",
      includeReport: "HOME_ONLY",
      includeFR24: true,
      autoLayovers: true,
      includeLocal: true
    };
  }

  async init() {
    try {
      const [airportsRes, codesRes] = await Promise.all([
        fetch('airports.json').catch(() => null),
        fetch('event_codes.json').catch(() => null)
      ]);
      if (airportsRes && airportsRes.ok) {
        const data = await airportsRes.json().catch(() => null);
        if (data) this.airports = data;
      }
      if (codesRes && codesRes.ok) {
        const data = await codesRes.json().catch(() => null);
        if (data) this.eventCodes = data;
      }
    } catch (err) {
      console.log("ℹ️ Running in instant local memory mode.");
    }
  }
}
const state = new AppState();

// --- Formatting Engine (Clean Typography Notes) ---
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

  // Visual Card Notes (Using Universal 🌐 and ➡️ Symbols)
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
      const headerEmoji = isBeachLeave ? "🏖️" : "🏠";
      lines.push(`${headerEmoji} ROSTERED DAY OFF / LEAVE`);
      lines.push(`----------------------------------`);
      lines.push(`🔖 Code:   ${evt.code}`);
      lines.push(`📋 Status: ${evt.rawTitle || evt.title}`);
      lines.push(`----------------------------------`);
      lines.push(`ℹ️ Guaranteed 24-hour rest period free from duty assignments.`);
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
  static parseRawText(rawText) {
    const events = [];
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

    if (dayMarkers.length === 0) return events;

    for (let i = 0; i < dayMarkers.length; i++) {
      const currentMarker = dayMarkers[i];
      const currentDay = currentMarker.day;
      const nextIndex = (i + 1 < dayMarkers.length) ? dayMarkers[i + 1].index : rawText.length;
      const chunkText = rawText.substring(currentMarker.index, nextIndex).trim();

      const sectorRegex = /(?:(\d{2}:\d{2}|\d{4})\s*)?(?:EK)?(\d{1,4}(?:-[A-Z])?)\s*([A-Z]{3})\s*(\d{2}:\d{2}|\d{4})\s*([A-Z]{3})\s*(\d{2}:\d{2}|\d{4})/gi;
      let sectorMatch;
      let foundSector = false;

      while ((sectorMatch = sectorRegex.exec(chunkText)) !== null) {
        const rawRepTime = sectorMatch[1];
        const rawFlightNum = sectorMatch[2];
        const origin = sectorMatch[3].toUpperCase();
        const depTimeStr = sectorMatch[4].replace(':', '');
        const dest = sectorMatch[5].toUpperCase();
        const arrTimeStr = sectorMatch[6].replace(':', '');

        const origMeta = state.airports[origin] || BUILTIN_AIRPORTS[origin];
        const destMeta = state.airports[dest] || BUILTIN_AIRPORTS[dest];
        if (!origMeta || !destMeta) continue;

        foundSector = true;
        const flightNum = rawFlightNum.toUpperCase().startsWith("EK") ? rawFlightNum.toUpperCase() : `EK${rawFlightNum.toUpperCase()}`;
        const destCity = destMeta ? destMeta.city : dest;
        const repTime = rawRepTime ? rawRepTime.replace(':', '') : null;

        const startUtc = ParserEngine.parseToUtcDate(currentYear, currentMonth, currentDay, depTimeStr, origin);
        const endUtc = ParserEngine.parseToUtcDate(currentYear, currentMonth, currentDay, arrTimeStr, dest);

        if (endUtc < startUtc) {
          endUtc.setUTCDate(endUtc.getUTCDate() + 1);
        }

        const flightEvent = {
          id: `ek-flt-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
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
          month: currentMonth,
          year: currentYear,
          dateStr: `${String(currentDay).padStart(2, '0')} ${Object.keys(monthNames)[currentMonth]}`,
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
          let repStartUtc = ParserEngine.parseToUtcDate(currentYear, currentMonth, currentDay, repTime, origin);
          if (repStartUtc >= startUtc) {
            repStartUtc.setUTCDate(repStartUtc.getUTCDate() - 1);
          }

          const repEndUtc = new Date(repStartUtc.getTime() + 60 * 60 * 1000);
          const repEventDate = new Date(repStartUtc);
          const repDay = repEventDate.getUTCDate();
          const repMonth = repEventDate.getUTCMonth();
          const repYear = repEventDate.getUTCFullYear();
          
          let repEndTimeStr = "--:--";
          try {
              const ianaZone = origMeta && origMeta.iana ? origMeta.iana : "Asia/Dubai";
              const formatter = new Intl.DateTimeFormat('en-GB', { 
                  timeZone: ianaZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' 
              });
              repEndTimeStr = formatter.format(repEndUtc).replace(':', '');
          } catch(e) {
              const repOffset = (origMeta?.utc_offset !== undefined ? origMeta.utc_offset : HOME_UTC_OFFSET);
              const repEndMinutes = repEndUtc.getUTCHours() * 60 + repEndUtc.getUTCMinutes() + Math.round(repOffset * 60);
              const repEndH = ((Math.floor(repEndMinutes / 60) % 24) + 24) % 24;
              const repEndM = ((repEndMinutes % 60) + 60) % 60;
              repEndTimeStr = String(repEndH).padStart(2, '0') + String(repEndM).padStart(2, '0');
          }

          const reportEvent = {
            id: `ek-rep-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
            enabled: true,
            code: "REP",
            flightNum: flightNum,
            origin: origin,
            destination: origin,
            location: `${origMeta?.city || origin} (${origin}) - Crew Check-in / eGate`,
            startTime: repTime,
            endTime: repEndTimeStr,
            day: repDay,
            month: repMonth,
            year: repYear,
            dateStr: `${String(repDay).padStart(2, '0')} ${Object.keys(monthNames)[repMonth]}`,
            category: "report",
            emoji: "🕒",
            isAllDay: false,
            startUtc: repStartUtc,
            endUtc: repEndUtc,
            rawText: `Check-in Report ${repTime} for ${flightNum}`
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
        } else if (code.startsWith("ER") || code.startsWith("FR") || code.startsWith("C5") || code.startsWith("RCY") || code.startsWith("38") || code.startsWith("FA") || code.startsWith("FG")) {
          codeMeta = { title: `SEP / Aircraft Training (${code})`, emoji: "📚", category: "training", isAllDay: false };
        } else if (code.startsWith("AL") || code.startsWith("LV") || code === "FI" || code === "VA" || code === "LLV") {
          codeMeta = { title: `Leave (${code})`, emoji: "🏖️", category: "off", isAllDay: true };
        } else if (code.startsWith("XX") || code.startsWith("DO") || code.startsWith("OFF") || code.startsWith("ROF") || code === "FP" || code === "NPA" || code === "PSB" || code === "RW" || code === "RWS") {
          codeMeta = { title: `Day Off (${code})`, emoji: "🏠", category: "off", isAllDay: true };
        } else if (code.startsWith("SBY") || code.startsWith("SO") || code.startsWith("RSV") || code.startsWith("ASBY") || code.startsWith("ESBY") || code.startsWith("HSBY")) {
          codeMeta = { title: `Standby Reserve (${code})`, emoji: "⏳", category: "standby", isAllDay: false };
        } else if (code === "LAY" || code === "REST") {
          codeMeta = { title: "Layover Rest", emoji: "🏨", category: "layover", isAllDay: false };
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
        if (codeMeta.category === 'layover') {
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

      let spanDays = 1;
      const dayRangeMatch = chunkText.match(/(?:0[1-9]|[12][0-9]|3[01])\s*[-–to]+\s*(0[1-9]|[12][0-9]|3[01])/i);
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
        const targetDay = currentDay + dOffset;
        let startUtc, endUtc;

        if (isAllDay) {
          startUtc = new Date(Date.UTC(currentYear, currentMonth, targetDay, 0, 0, 0));
          endUtc = new Date(Date.UTC(currentYear, currentMonth, targetDay, 23, 59, 59));
        } else {
          startUtc = ParserEngine.parseToUtcDate(currentYear, currentMonth, targetDay, startTime, origin);
          endUtc = ParserEngine.parseToUtcDate(currentYear, currentMonth, targetDay, endTime, dest || origin);
          if (codeMeta.category === 'layover' || endUtc < startUtc) {
            endUtc.setUTCDate(endUtc.getUTCDate() + 1);
          }
        }

        const event = {
          id: `ek-duty-${Date.now()}-${i}-${dOffset}-${Math.random().toString(36).substr(2, 4)}`,
          enabled: true,
          code: code,
          emoji: codeMeta.emoji,
          rawTitle: codeMeta.title,
          day: targetDay,
          month: currentMonth,
          year: currentYear,
          dateStr: `${String(targetDay).padStart(2, '0')} ${Object.keys(monthNames)[currentMonth]}`,
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
    
    // Auto-detect layovers & turnarounds before enriching them
    ParserEngine.detectGroundTimes(events);
    ParserEngine.enrichLayoverRest(events);
    
    return events;
  }

  // --- Dynamic IANA Timezone Engine (DST Safe) ---
  static parseToUtcDate(year, monthIndex, day, timeStr, locationCode = HOME_BASE) {
    const cleanTime = (timeStr || "0000").replace('+1', '').replace(':', '');
    const hours = parseInt(cleanTime.slice(0, 2), 10) || 0;
    const minutes = parseInt(cleanTime.slice(2, 4), 10) || 0;

    const airport = state.airports[locationCode] || BUILTIN_AIRPORTS[locationCode];
    const ianaZone = airport && airport.iana ? airport.iana : "Asia/Dubai";

    // 1. Guess the UTC date as if the local time was UTC
    const targetUTC = new Date(Date.UTC(year, monthIndex, day, hours, minutes));

    try {
      // 2. Format the guessed date in the target IANA timezone
      let p = {};
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: ianaZone,
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hourCycle: 'h23'
      });
      
      formatter.formatToParts(targetUTC).forEach(part => p[part.type] = part.value);

      const formattedAsUtc = new Date(Date.UTC(
        parseInt(p.year, 10),
        parseInt(p.month, 10) - 1,
        parseInt(p.day, 10),
        parseInt(p.hour, 10),
        parseInt(p.minute, 10),
        parseInt(p.second, 10)
      ));

      // 3. Difference reveals the exact offset at that specific moment (including DST)
      const offsetMs = formattedAsUtc.getTime() - targetUTC.getTime();
      return new Date(targetUTC.getTime() - offsetMs);
      
    } catch (e) {
      // Fallback for invalid IANA strings or unsupported browsers
      const fallbackOffset = airport ? (airport.utc_offset !== undefined ? airport.utc_offset : HOME_UTC_OFFSET) : HOME_UTC_OFFSET;
      const totalMinutes = (hours * 60 + minutes) - (fallbackOffset * 60);
      const fallbackDate = new Date(Date.UTC(year, monthIndex, day, 0, 0));
      fallbackDate.setUTCHours(0, Math.round(totalMinutes), 0, 0);
      return fallbackDate;
    }
  }

  // --- Ground Time Detection (Layovers > 4hrs & Turnarounds < 4hrs) ---
  static detectGroundTimes(events) {
    if (state.preferences.autoLayovers === false) return;

    const flights = events.filter(e => e.category === 'flight').sort((a, b) => a.startUtc - b.startUtc);
    const groundEvents = [];

    for (let i = 0; i < flights.length - 1; i++) {
      const inbound = flights[i];
      const outbound = flights[i + 1];

      // Crew arrives at an outstation and departs from the same outstation
      if (inbound.destination !== HOME_BASE && inbound.destination === outbound.origin) {
        const diffMs = outbound.startUtc - inbound.endUtc;
        
        if (diffMs > 0) {
          const isLayover = diffMs > 4 * 60 * 60 * 1000;
          const totalMins = Math.round(diffMs / (1000 * 60));
          const hours = Math.floor(totalMins / 60);
          const mins = totalMins % 60;
          const durationStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
          
          const existingLayover = events.find(e => 
            e.category === 'layover' && 
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

            const formatLocal = (utcDate, locCode) => {
              try {
                const airportMeta = state.airports[locCode] || BUILTIN_AIRPORTS[locCode];
                const iana = airportMeta && airportMeta.iana ? airportMeta.iana : "Asia/Dubai";
                const formatter = new Intl.DateTimeFormat('en-GB', {
                  timeZone: iana,
                  hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
                });
                return formatter.format(utcDate).replace(':', '');
              } catch (e) { return "--:--"; }
            };

            const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

            if (isLayover) {
              groundEvents.push({
                id: `ek-auto-layover-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
                enabled: true,
                code: "LAY",
                emoji: "🏨",
                rawTitle: "Layover",
                day: startUtc.getUTCDate(),
                month: startUtc.getUTCMonth(),
                year: startUtc.getUTCFullYear(),
                dateStr: `${String(startUtc.getUTCDate()).padStart(2, '0')} ${monthNames[startUtc.getUTCMonth()]}`,
                origin: station,
                destination: station,
                locationCode: station,
                location: `${city} (${station}) — Layover (${durationStr})`,
                startTime: formatLocal(startUtc, station),
                endTime: formatLocal(endUtc, station),
                category: "layover",
                isAllDay: false,
                startUtc: startUtc,
                endUtc: endUtc,
                restDuration: durationStr,
                rawText: `Auto-generated layover at ${station}`
              });
            } else {
              groundEvents.push({
                id: `ek-auto-turnaround-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
                enabled: true,
                code: "TURN",
                emoji: "🔄",
                rawTitle: "Turnaround",
                day: startUtc.getUTCDate(),
                month: startUtc.getUTCMonth(),
                year: startUtc.getUTCFullYear(),
                dateStr: `${String(startUtc.getUTCDate()).padStart(2, '0')} ${monthNames[startUtc.getUTCMonth()]}`,
                origin: station,
                destination: station,
                locationCode: station,
                location: `${city} (${station}) — Turnaround (${durationStr})`,
                startTime: formatLocal(startUtc, station),
                endTime: formatLocal(endUtc, station),
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

  // --- Isolated Station Rest Calculator ---
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
          
          const diffMs = lay.endUtc - lay.startUtc;
          if (!isNaN(diffMs) && diffMs > 0) {
            const totalMins = Math.round(diffMs / (1000 * 60));
            const hours = Math.floor(totalMins / 60);
            const mins = totalMins % 60;
            
            lay.restDuration = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
            const airport = state.airports[station] || BUILTIN_AIRPORTS[station];
            const city = airport?.city || station;
            lay.location = `${city} (${station}) — Station Rest (${lay.restDuration})`;
            
            const formatLocal = (utcDate, locCode) => {
              try {
                const airportMeta = state.airports[locCode] || BUILTIN_AIRPORTS[locCode];
                const iana = airportMeta && airportMeta.iana ? airportMeta.iana : "Asia/Dubai";
                const formatter = new Intl.DateTimeFormat('en-GB', {
                  timeZone: iana,
                  hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
                });
                return formatter.format(utcDate).replace(':', '');
              } catch (e) { return "--:--"; }
            };
            lay.startTime = formatLocal(lay.startUtc, station);
            lay.endTime = formatLocal(lay.endUtc, station);
          }
        }
      });
    } catch (err) {
      console.warn("Layover rest enrichment safely bypassed:", err);
    }
  }
}

// --- iCal (.ics) Generator (Surrogate-Safe Line Folding) ---
class ICalGenerator {
  static generate(events) {
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
        "STATUS:CONFIRMED",
        "END:VEVENT"
      );
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

  // Safe folding algorithm that never splits surrogate pairs
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

  // --- SPA MAGIC MODE CONTROLLER ---
  const urlParams = new URLSearchParams(window.location.search);
  const isMagicMode = urlParams.get('magic') === 'true';

  const standardUiView = document.getElementById('standard-ui-view');
  const magicModeView = document.getElementById('magic-mode-view');
  const magicBtnExport = document.getElementById('magic-btn-export');
  const magicBtnReview = document.getElementById('magic-btn-review');

  if (isMagicMode && standardUiView && magicModeView) {
    standardUiView.classList.add('hidden');
    magicModeView.classList.remove('hidden');
    magicModeView.classList.add('flex');
    
    // Make the background transparent so the crew portal shows through
    document.documentElement.classList.add('magic-transparent');
    document.body.classList.add('magic-transparent');
  }

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'ROSTER_DATA') {
      const rawText = event.data.text;
      try {
        state.parsedEvents = ParserEngine.parseRawText(rawText);
        updateFilterCounts();
        renderActiveView();
        
        if (btnExport) btnExport.disabled = state.parsedEvents.length === 0;
        
        if (isMagicMode) {
          updateMagicStatistics();
        } else {
           if (rawInput) rawInput.value = rawText; 
        }
      } catch (err) {
        console.error("Magic mode parsing error:", err);
        alert("Failed to instantly parse roster. Please review manually.");
      }
    }
  });

  function updateMagicStatistics() {
    let flightCount = 0;
    let layoverCount = 0;
    let turnaroundCount = 0;
    let offCount = 0;
    let totalMs = 0;
    let totalEvents = state.parsedEvents.length;

    const monthNamesLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthTitle = document.getElementById('magic-month-title');
    if (monthTitle) monthTitle.innerText = `${monthNamesLong[state.currentMonth]} ${state.currentYear} Roster`;

    state.parsedEvents.forEach(evt => {
      if (evt.category === 'flight') {
        flightCount++;
        if (evt.startUtc && evt.endUtc) {
          totalMs += (evt.endUtc - evt.startUtc);
        }
      } else if (evt.category === 'layover') {
        layoverCount++;
      } else if (evt.category === 'turnaround') {
        turnaroundCount++;
      } else if (evt.category === 'off' && evt.isAllDay) {
        offCount++;
      }
    });

    const blockHours = Math.floor(totalMs / (1000 * 60 * 60));
    
    // NEW: Elegant Number Counter Animation Helper (with Delay)
    const animateValue = (id, endValue, suffix = '', duration = 1200, delayMs = 0) => {
      const obj = document.getElementById(id);
      if (!obj) return;
      
      // Ensure it starts at 0 visually before the delay finishes
      obj.innerText = "0" + suffix;

      setTimeout(() => {
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          // easeOutExpo for a rapid start and elegant slowdown
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          obj.innerText = Math.floor(easeProgress * endValue) + suffix;
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      }, delayMs);
    };

    // Trigger animations with staggered delays that fire right as the boxes finish sliding in.
    // The CSS animation takes ~800ms, and the boxes are delayed by 400, 500, 600... etc.
    animateValue('stat-flights', flightCount, '', 1200, 800);
    animateValue('stat-hours', blockHours, 'h', 1200, 900);
    animateValue('stat-layovers', layoverCount, '', 1200, 1000);
    animateValue('stat-turnarounds', turnaroundCount, '', 1200, 1100);
    animateValue('stat-off', offCount, '', 1200, 1200);
    animateValue('stat-events', totalEvents, '', 1200, 1300);

    if (magicBtnExport) {
      magicBtnExport.disabled = state.parsedEvents.length === 0;
    }
  }

  if (magicBtnExport) {
    magicBtnExport.addEventListener('click', () => {
      if(btnExport) btnExport.click(); 
    });
  }

  if (magicBtnReview) {
    magicBtnReview.addEventListener('click', () => {
      // If we exit magic mode, remove the transparency
      document.documentElement.classList.remove('magic-transparent');
      document.body.classList.remove('magic-transparent');
      
      if (magicModeView) {
        magicModeView.classList.remove('flex');
        magicModeView.classList.add('hidden');
      }
      if (standardUiView) {
        standardUiView.classList.remove('hidden');
      }
      
      const leftCol = document.querySelector('.lg\\:col-span-5');
      const rightCol = document.querySelector('.lg\\:col-span-7');
      if (leftCol) leftCol.classList.add('hidden');
      if (rightCol) rightCol.classList.replace('lg:col-span-7', 'lg:col-span-12');
    });
  }
  // --- END MAGIC MODE ---

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

  const previewFlight = document.getElementById("preview-flight-format");
  const previewDuty = document.getElementById("preview-duty-format");

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
        includeLocal: true
      };
      
      if (rawInput && rawInput.value.trim()) {
        try {
          state.parsedEvents = ParserEngine.parseRawText(rawInput.value);
          updateFilterCounts();
          if (eventCount) eventCount.innerText = `${state.parsedEvents.length} EK events ready for calendar sync`;
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
      btnViewList.className = "px-2.5 py-1 rounded-md font-semibold bg-blue-600 text-white transition cursor-pointer flex items-center space-x-1 text-xs shadow-sm";
      if (btnViewMonth) btnViewMonth.className = "px-2.5 py-1 rounded-md font-semibold text-slate-400 hover:text-white transition cursor-pointer flex items-center space-x-1 text-xs";
      listViewContainer.classList.remove("hidden");
      listToolbar.classList.remove("hidden");
      if (monthViewContainer) monthViewContainer.classList.add("hidden");
      renderTable();
    });
  }

  if (btnViewMonth && monthViewContainer) {
    btnViewMonth.addEventListener("click", () => {
      state.activeView = 'month';
      btnViewMonth.className = "px-2.5 py-1 rounded-md font-semibold bg-blue-600 text-white transition cursor-pointer flex items-center space-x-1 text-xs shadow-sm";
      if (btnViewList) btnViewList.className = "px-2.5 py-1 rounded-md font-semibold text-slate-400 hover:text-white transition cursor-pointer flex items-center space-x-1 text-xs";
      monthViewContainer.classList.remove("hidden");
      if (listViewContainer) listViewContainer.classList.add("hidden");
      if (listToolbar) listToolbar.classList.add("hidden");
      renderMonthView();
    });
  }

  if (tabText && panelText) {
    tabText.addEventListener("click", () => {
      tabText.className = "pb-1.5 border-b-2 border-blue-500 text-blue-400 px-2.5 cursor-pointer text-[10px] font-semibold tracking-wide uppercase transition";
      if (tabFile) tabFile.className = "pb-1.5 border-b-2 border-transparent text-slate-400 hover:text-slate-200 px-2.5 cursor-pointer text-[10px] font-semibold tracking-wide uppercase transition";
      panelText.classList.remove("hidden");
      if (panelFile) panelFile.classList.add("hidden");
    });
  }

  if (tabFile && panelFile) {
    tabFile.addEventListener("click", () => {
      tabFile.className = "pb-1.5 border-b-2 border-blue-500 text-blue-400 px-2.5 cursor-pointer text-[10px] font-semibold tracking-wide uppercase transition";
      if (tabText) tabText.className = "pb-1.5 border-b-2 border-transparent text-slate-400 hover:text-slate-200 px-2.5 cursor-pointer text-[10px] font-semibold tracking-wide uppercase transition";
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
        alert("Please paste your Emirates roster text first.");
        return;
      }
      
      try {
        state.parsedEvents = ParserEngine.parseRawText(text);
      } catch (err) {
        console.error("Fatal roster parsing error:", err);
        alert("An error occurred while parsing the roster text. Please check the content.");
        return;
      }

      try {
        updateFilterCounts();
        renderActiveView();
        
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
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `${state.preferences.calendarName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

    filteredEvents.forEach((evt, index) => {
      const tr = document.createElement("tr");
      tr.className = (evt.enabled ? "hover:bg-slate-800/40 transition" : "opacity-40 bg-slate-950/40 transition") + " animate-fade-in";
      tr.style.animationDelay = `${Math.min(index * 20, 350)}ms`;
      
      const formatTime = (utcDate) => {
        if (!utcDate || isNaN(utcDate.getTime())) return "--:--";
        if (state.timezoneMode === 'UTC') return utcDate.toISOString().slice(11, 16) + " Z";
        return utcDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      };

      const dynamicTitle = FormatEngine.getTitle(evt);
      const timeDisplay = evt.isAllDay ? `<span class="bg-emerald-950/90 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded text-[10px] font-semibold">All Day (24h)</span>` : `${formatTime(evt.startUtc)} - ${formatTime(evt.endUtc)}`;

      tr.innerHTML = `
        <td class="py-2.5 px-2.5"><input type="checkbox" ${evt.enabled ? 'checked' : ''} data-id="${evt.id}" class="row-toggle rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0 cursor-pointer w-4 h-4"></td>
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
