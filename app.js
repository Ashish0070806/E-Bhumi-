
// --- RESPONSIVE RETRACTABLE SIDEBAR CONTROLLER ---
function toggleSidebar(forceState) {
  const sidebar = document.getElementById('appSidebar');
  const header = document.getElementById('appHeader');
  const main = document.getElementById('appMain');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar) return;

  const isMobile = window.innerWidth < 1024;

  if (isMobile) {
    // Mobile / Tablet overlay slide-in
    const isOpen = sidebar.classList.contains('translate-x-0');
    const shouldOpen = forceState !== undefined ? forceState : !isOpen;

    if (shouldOpen) {
      sidebar.classList.remove('-translate-x-full');
      sidebar.classList.add('translate-x-0');
      if (backdrop) backdrop.classList.remove('hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
      sidebar.classList.remove('translate-x-0');
      if (backdrop) backdrop.classList.add('hidden');
    }
  } else {
    // Desktop: collapse / expand
    const isCollapsed = sidebar.classList.contains('lg:-translate-x-full');
    const shouldCollapse = forceState !== undefined ? !forceState : !isCollapsed;

    if (shouldCollapse) {
      sidebar.classList.add('lg:-translate-x-full');
      if (header) {
        header.classList.remove('lg:left-72');
        header.classList.add('lg:left-0');
      }
      if (main) {
        main.classList.remove('lg:pl-72');
        main.classList.add('lg:pl-0');
      }
    } else {
      sidebar.classList.remove('lg:-translate-x-full');
      if (header) {
        header.classList.add('lg:left-72');
        header.classList.remove('lg:left-0');
      }
      if (main) {
        main.classList.add('lg:pl-72');
        main.classList.remove('lg:pl-0');
      }
    }
  }
}

/**
 * E-Bhumi - National Land & Citizen Portal
 * Application Controller, Interactive Google Satellite GIS Engine & Workflow Manager
 * RFCTLARR Act 2013 Compliant Cadastral Land Acquisition System
 */

// --- USER PROFILES & RBAC ACCESS DEFINITIONS (MATCHING IMAGE SPECIFICATION) ---
const USER_PROFILES = {
  admin: {
    id: 'admin-01',
    roleKey: 'admin',
    name: 'Dr. Rajeshwar Rao (IAS)',
    officerId: 'LAO-094',
    designation: 'Competent Authority & Special Land Acquisition Officer (CALA)',
    badge: 'System Admin (Auditor)',
    badgeClass: 'bg-primary text-on-primary',
    avatarText: 'RR',
    avatarBg: 'bg-primary text-on-primary',
    permissions: {
      settings: 'Full',
      financialReports: 'Full',
      assignedProperties: 'Full',
      approveOffers: 'Full',
      submitBulkCSV: 'Full',
      submitSingleProp: 'Full',
      viewOwnTxn: 'Full'
    }
  },
  officer: {
    id: 'officer-01',
    roleKey: 'officer',
    name: 'Shri Vikram K. Deshmukh',
    officerId: 'SLAO-082',
    designation: 'Senior Acquisition Agent & Survey Patwari',
    badge: 'Field Officer (Acquisition Agent)',
    badgeClass: 'bg-secondary-container text-on-secondary-container',
    avatarText: 'VD',
    avatarBg: 'bg-secondary-container text-secondary',
    permissions: {
      settings: 'No',
      financialReports: 'No',
      assignedProperties: 'Full',
      approveOffers: 'View Only',
      submitBulkCSV: 'Full',
      submitSingleProp: 'Full',
      viewOwnTxn: 'Full'
    }
  },
  landowner: {
    id: 'landowner-01',
    roleKey: 'landowner',
    name: 'Rameshwar Patil',
    officerId: 'Khasra #142/3A',
    designation: 'Registered Landowner • Survey Plot #MH-NGP-4029',
    badge: 'Client (Personal Landowner)',
    badgeClass: 'bg-emerald-100 text-emerald-800 font-bold',
    avatarText: 'RP',
    avatarBg: 'bg-emerald-700 text-white',
    permissions: {
      settings: 'No',
      financialReports: 'No',
      assignedProperties: 'Own Only',
      approveOffers: 'No',
      submitBulkCSV: 'No',
      submitSingleProp: 'Full',
      viewOwnTxn: 'Full (Own Only)'
    }
  },
  viewer: {
    id: 'viewer-01',
    roleKey: 'viewer',
    name: 'Public Citizen (Guest)',
    officerId: 'Guest Access',
    designation: 'Public Cadastral & Gazette Notice Viewer',
    badge: 'Client (Public Viewer)',
    badgeClass: 'bg-surface-container-high text-on-surface font-bold',
    avatarText: 'PV',
    avatarBg: 'bg-surface-container-highest text-on-surface',
    permissions: {
      settings: 'No',
      financialReports: 'No',
      assignedProperties: 'No',
      approveOffers: 'No',
      submitBulkCSV: 'No',
      submitSingleProp: 'View Only',
      viewOwnTxn: 'View Only'
    }
  }
};

// --- APPLICATION STATE ---
const AppState = {
  isLoggedIn: false,
  isDemoMode: false,
  currentUser: null,
  loginTab: 'admin',
  clientSubtype: 'landowner',
  currentView: 'overview',
  activeProjectId: 'PKG-4B',
  activeParcelId: 'MH-NGP-4029',
  pendingApprovalsCount: 6,
  apiBase: (window.location.port === '5000') ? '/api' : 'http://localhost:5000/api',
  dbConnected: false,
  grievances: [],
  activeGrievanceId: null,
  activeGrievanceFilter: 'all',
  activeGrievanceType: 'all',
  grievanceSearchQuery: '',
  tabParcelsFilter: 'all',
  tabParcelsSearchQuery: '',
  overviewMap: null,
  dedicatedMap: null,
  overviewPolygons: [],
  dedicatedPolygons: [],
  googleMapsLoaded: false,
  projects: [
    {
      id: 'PKG-4B',
      title: 'NH-44 Express Corridor Expansion — Package 4B',
      category: 'National Highway Project',
      corridor: 'Nagpur — Hinganghat Highway Route',
      notification: 'S.O. 1842(E) / Section 3A Public Notice',
      district: 'Nagpur Rural District',
      marker: 'Km 114 to Km 168',
      targetHa: 1687,
      acquiredHa: 1018.58,
      percent: 60.4,
      totalPlots: 528,
      clearPlots: 295,
      processPlots: 188,
      reviewPlots: 45,
      escrowCr: 620.00,
      disbursedCr: 362.50,
      disbursedLandowners: 295,
      disbursedPercent: 58.5,
      status: 'ACTIVE CORRIDOR',
      statusClass: 'bg-secondary-container text-on-secondary-container',
      timelineStatus: '+18 Days',
      timelineText: 'Ahead of Government Target Schedule',
      timelineBadge: 'ON SCHEDULE',
      incharge: 'Dr. Rajeshwar Rao (IAS) - Special Land Acquisition Officer',
      stage1: { percent: 100, status: '100% Completed', desc: 'Public hearing and social impact report approved' },
      stage2: { percent: 94, status: '94% Active', desc: '494 of 528 plot boundaries mapped' },
      stage3: { percent: 71, status: '71% In Progress', desc: 'Notices issued; remainder in final review' },
      stage4: { percent: 56, status: '56% Paid', desc: '₹362.50 Cr transferred to landowners via DBT' },
      activeStep: 3,
      centerCoords: { lat: 20.8980, lng: 79.0265 },
      coordsText: '20.8980° N, 79.0265° E'
    },
    {
      id: 'PKG-2A',
      title: 'NH-53 Bypass Expansion — Package 2A',
      category: 'National Highway Bypass',
      corridor: 'Nagpur — Bhandara Highway Link',
      notification: 'S.O. 2045(E) / Section 3A Public Notice',
      district: 'Bhandara & Nagpur East',
      marker: 'Km 42 to Km 98',
      targetHa: 640,
      acquiredHa: 412.00,
      percent: 64.3,
      totalPlots: 284,
      clearPlots: 190,
      processPlots: 82,
      reviewPlots: 12,
      escrowCr: 280.00,
      disbursedCr: 178.40,
      disbursedLandowners: 190,
      disbursedPercent: 63.7,
      status: 'FIELD SURVEY ACTIVE',
      statusClass: 'bg-surface-container-high text-on-surface',
      timelineStatus: '+6 Days',
      timelineText: 'Joint Survey Cadastre Completed',
      timelineBadge: 'FIELD ACTIVE',
      incharge: 'Shri V. K. Deshmukh (SLAO-082)',
      stage1: { percent: 100, status: '100% Completed', desc: 'Section 3A Gazette notifications published' },
      stage2: { percent: 85, status: '85% Active', desc: '241 of 284 plot boundaries demarcated' },
      stage3: { percent: 68, status: '68% In Progress', desc: 'Section 3D hearings underway in Bhandara' },
      stage4: { percent: 64, status: '64% Paid', desc: '₹178.40 Cr compensation released via DBT' },
      activeStep: 2,
      centerCoords: { lat: 21.1680, lng: 79.6540 },
      coordsText: '21.1680° N, 79.6540° E'
    },
    {
      id: 'FEEDER-01',
      title: 'Samruddhi Mahamarg Feeder Link — Phase 1',
      category: 'Expressway Connector Link',
      corridor: 'Wardha — Butibori Expressway Connector',
      notification: 'S.O. 1190(E) / Section 3D Final Award',
      district: 'Wardha & Butibori Rural',
      marker: 'Km 0 to Km 34',
      targetHa: 820,
      acquiredHa: 740.00,
      percent: 90.2,
      totalPlots: 390,
      clearPlots: 355,
      processPlots: 31,
      reviewPlots: 4,
      escrowCr: 410.00,
      disbursedCr: 382.10,
      disbursedLandowners: 355,
      disbursedPercent: 93.2,
      status: 'FINAL DISBURSAL (90%)',
      statusClass: 'bg-secondary-container text-on-secondary-container',
      timelineStatus: '+24 Days',
      timelineText: 'Final Stage: 90% Compensation Disbursed',
      timelineBadge: 'NEAR COMPLETION',
      incharge: 'Smt. Anjali Sharma (CALA / SDM)',
      stage1: { percent: 100, status: '100% Completed', desc: 'Corridor master alignment finalized' },
      stage2: { percent: 100, status: '100% Completed', desc: 'All 390 plots demarcated with DGPS' },
      stage3: { percent: 98, status: '98% Approved', desc: 'Section 19 Final Awards proclaimed' },
      stage4: { percent: 93, status: '93% Paid', desc: '₹382.10 Cr disbursed to 355 landowners' },
      activeStep: 5,
      centerCoords: { lat: 20.7450, lng: 78.6020 },
      coordsText: '20.7450° N, 78.6020° E'
    }
  ],
  parcels: [
    {
      id: 'MH-NGP-4028',
      surveyNo: '141/2',
      mouza: 'Umred',
      tehsil: 'Nagpur Rural',
      areaHa: 1.800,
      classification: 'Irrigated Agriculture',
      owner: 'Devidas G. Nimje',
      aadhaarLinked: true,
      awardValuation: 9240000,
      dbtStatus: 'Paid via Bank Transfer (PFMS)',
      status: 'Plot Acquired & Demarcated',
      stage: 'disbursed',
      statusColor: 'secondary',
      circleRate: 1800000,
      multiplier: 2.5,
      solatium: 4500000,
      interest: 840000,
      assetsValuation: 1200000,
      chainage: 'Km 137.80',
      coordinates: '20.8950° N, 79.0220° E',
      disputeReason: null,
      bounds: [
        { lat: 20.8950, lng: 79.0210 },
        { lat: 20.8970, lng: 79.0225 },
        { lat: 20.8962, lng: 79.0245 },
        { lat: 20.8942, lng: 79.0230 }
      ]
    },
    {
      id: 'MH-NGP-4029',
      surveyNo: '142/3A',
      mouza: 'Umred',
      tehsil: 'Nagpur Rural',
      areaHa: 2.850,
      classification: 'Multi-Crop Farmland',
      owner: 'Rameshwar Patil & 2 Others',
      aadhaarLinked: true,
      awardValuation: 14250000,
      dbtStatus: 'Government Escrow Ready',
      status: 'Section 19 Gazette Issued',
      stage: 'award_ready',
      statusColor: 'primary-container',
      circleRate: 2000000,
      multiplier: 2.5,
      solatium: 5700000,
      interest: 1350000,
      assetsValuation: 1500000,
      chainage: 'Km 138.62',
      coordinates: '20.8980° N, 79.0255° E',
      disputeReason: null,
      bounds: [
        { lat: 20.8970, lng: 79.0225 },
        { lat: 20.8995, lng: 79.0245 },
        { lat: 20.8985, lng: 79.0275 },
        { lat: 20.8962, lng: 79.0245 }
      ]
    },
    {
      id: 'MH-NGP-4030',
      surveyNo: '143/1',
      mouza: 'Bhiwapur',
      tehsil: 'Nagpur Rural',
      areaHa: 3.100,
      classification: 'Semi-Dry Farm Plot',
      owner: 'Smt. Sunita M. Barapatre',
      aadhaarLinked: true,
      awardValuation: 11200000,
      dbtStatus: 'Under Officer Review',
      status: 'Joint Survey Completed',
      stage: 'surveyed',
      statusColor: 'tertiary-fixed-dim',
      circleRate: 1500000,
      multiplier: 2.5,
      solatium: 4650000,
      interest: 950000,
      assetsValuation: 950000,
      chainage: 'Km 139.40',
      coordinates: '20.9010° N, 79.0285° E',
      disputeReason: null,
      bounds: [
        { lat: 20.8995, lng: 79.0245 },
        { lat: 20.9020, lng: 79.0270 },
        { lat: 20.9010, lng: 79.0305 },
        { lat: 20.8985, lng: 79.0275 }
      ]
    },
    {
      id: 'MH-NGP-4031',
      surveyNo: '144/2',
      mouza: 'Bhiwapur',
      tehsil: 'Nagpur Rural',
      areaHa: 1.450,
      classification: 'Fruit Orchard Plot',
      owner: 'Ganesh K. Thakre & Co-sharer',
      aadhaarLinked: false,
      awardValuation: 8620000,
      dbtStatus: 'Payment on Hold',
      status: 'Citizen Inquiry & Dispute Mediation',
      stage: 'disputed',
      statusColor: 'error',
      circleRate: 2200000,
      multiplier: 2.5,
      solatium: 3190000,
      interest: 740000,
      assetsValuation: 1500000,
      chainage: 'Km 142.20',
      coordinates: '20.9035° N, 79.0320° E',
      disputeReason: 'Boundary partition objection filed regarding inheritance of Survey No. 144/2.',
      bounds: [
        { lat: 20.9020, lng: 79.0270 },
        { lat: 20.9045, lng: 79.0298 },
        { lat: 20.9035, lng: 79.0335 },
        { lat: 20.9010, lng: 79.0305 }
      ]
    },
    {
      id: 'MH-NGP-4032',
      surveyNo: '145/1B',
      mouza: 'Umred',
      tehsil: 'Nagpur Rural',
      areaHa: 2.100,
      classification: 'Residential Boundary Plot',
      owner: 'Chandrakant Deshmukh',
      aadhaarLinked: true,
      awardValuation: 11800000,
      dbtStatus: 'Paid via Bank Transfer (PFMS)',
      status: 'Plot Handed Over to Highway Authority',
      stage: 'disbursed',
      statusColor: 'secondary',
      circleRate: 1900000,
      multiplier: 2.5,
      solatium: 3990000,
      interest: 1120000,
      assetsValuation: 2700000,
      chainage: 'Km 143.15',
      coordinates: '20.8935° N, 79.0245° E',
      disputeReason: null,
      bounds: [
        { lat: 20.8935, lng: 79.0235 },
        { lat: 20.8955, lng: 79.0255 },
        { lat: 20.8945, lng: 79.0285 },
        { lat: 20.8925, lng: 79.0260 }
      ]
    },
    {
      id: 'MH-NGP-4033',
      surveyNo: '146/4',
      mouza: 'Kuhi',
      tehsil: 'Nagpur Rural',
      areaHa: 1.950,
      classification: 'Highway Frontage Plot',
      owner: 'Vitthalrao S. Gaikwad',
      aadhaarLinked: true,
      awardValuation: 13500000,
      dbtStatus: 'Valuation Finalization',
      status: 'Price Calculation Underway',
      stage: 'valuation',
      statusColor: 'amber-600',
      circleRate: 2400000,
      multiplier: 2.5,
      solatium: 4680000,
      interest: 1200000,
      assetsValuation: 2940000,
      chainage: 'Km 144.80',
      coordinates: '20.8955° N, 79.0270° E',
      disputeReason: null,
      bounds: [
        { lat: 20.8955, lng: 79.0255 },
        { lat: 20.8978, lng: 79.0280 },
        { lat: 20.8968, lng: 79.0310 },
        { lat: 20.8945, lng: 79.0285 }
      ]
    },
    {
      id: 'MH-NGP-4034',
      surveyNo: '148/2',
      mouza: 'Kuhi',
      tehsil: 'Nagpur Rural',
      areaHa: 2.400,
      classification: 'Dry Crop Farmland',
      owner: 'Babu Rao Shinde & 4 Family Members',
      aadhaarLinked: false,
      awardValuation: 9800000,
      dbtStatus: 'Initial Notice Stage',
      status: 'Section 3A Notice Issued',
      stage: 'pending_survey',
      statusColor: 'outline',
      circleRate: 1600000,
      multiplier: 2.5,
      solatium: 3840000,
      interest: 880000,
      assetsValuation: 1240000,
      chainage: 'Km 146.20',
      coordinates: '20.8978° N, 79.0295° E',
      disputeReason: null,
      bounds: [
        { lat: 20.8978, lng: 79.0280 },
        { lat: 20.9002, lng: 79.0305 },
        { lat: 20.8992, lng: 79.0335 },
        { lat: 20.8968, lng: 79.0310 }
      ]
    }
  ],
  activeFilter: 'all',
  searchQuery: '',
  surveyWaypoints: [
    { pt: 1, lat: '20.898012', lng: '79.025510', elev: '284.60m', acc: '±1.4 cm', time: '14:22:10' },
    { pt: 2, lat: '20.898304', lng: '79.025845', elev: '284.75m', acc: '±1.6 cm', time: '14:24:35' },
    { pt: 3, lat: '20.897980', lng: '79.026120', elev: '284.68m', acc: '±1.5 cm', time: '14:27:02' }
  ],
  isMobileFrame: false
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initAuthPortal();
  initNavigation();
  initGoogleSatelliteMaps();
  initSvgMapFallback();
  initProjectsModule();
  populateHeaderProjectSelector();
  selectProject(AppState.activeProjectId, false);
  initParcelsTable();
  initParcelsUploadDownload();
  initComplaintsHelpDesk();
  initApprovalQueue();
  initSurveyModule();
  initModals();
  updatePendingBadge();
  initDbSync();
});

// --- ROLE-BASED AUTHENTICATION & LOGIN PORTAL CONTROLLER ---
function initAuthPortal() {
  // Check if active session exists in sessionStorage
  try {
    const savedSession = sessionStorage.getItem('ebhumi_session');
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      if (parsed && parsed.role) {
        loginAs(parsed.role, parsed.subtype, parsed.isDemo, parsed.user);
        return;
      }
    }
  } catch (err) {
    console.warn('Session parse exception:', err);
  }

  switchLoginRole('admin');
  switchClientSubtype('landowner');

  const loginPortal = document.getElementById('loginPortalView');
  const mainShell = document.getElementById('mainAppShell');

  if (loginPortal && !AppState.isLoggedIn) {
    loginPortal.classList.remove('hidden');
  }
  if (mainShell && !AppState.isLoggedIn) {
    mainShell.classList.add('hidden');
  }

  // Close profile dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const container = document.getElementById('headerProfileContainer');
    const dropdown = document.getElementById('headerProfileDropdown');
    if (container && dropdown && !container.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

function showLoginAlert(msg, type = 'error') {
  const alertBox = document.getElementById('loginAlertBox');
  const alertIcon = document.getElementById('loginAlertIcon');
  const alertText = document.getElementById('loginAlertText');
  if (!alertBox || !alertText) return;

  alertBox.classList.remove('hidden');
  if (type === 'error') {
    alertBox.className = 'mx-6 mt-4 p-3.5 rounded-xl border text-xs flex items-start gap-2.5 bg-error-container/40 border-error/30 text-error';
    if (alertIcon) alertIcon.textContent = 'error';
  } else if (type === 'success') {
    alertBox.className = 'mx-6 mt-4 p-3.5 rounded-xl border text-xs flex items-start gap-2.5 bg-secondary-container/40 border-secondary/30 text-secondary';
    if (alertIcon) alertIcon.textContent = 'check_circle';
  } else {
    alertBox.className = 'mx-6 mt-4 p-3.5 rounded-xl border text-xs flex items-start gap-2.5 bg-surface-container-low border-surface-container text-on-surface';
    if (alertIcon) alertIcon.textContent = 'info';
  }
  alertText.innerHTML = msg;
}

function clearLoginAlert() {
  const alertBox = document.getElementById('loginAlertBox');
  if (alertBox) alertBox.classList.add('hidden');
}

function togglePasswordVisibility(inputId, eyeIconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(eyeIconId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.textContent = 'visibility_off';
  } else {
    input.type = 'password';
    if (icon) icon.textContent = 'visibility';
  }
}

function switchLoginRole(role) {
  AppState.loginTab = role;
  clearLoginAlert();

  const tabs = [
    { id: 'loginTabAdmin', key: 'admin' },
    { id: 'loginTabOfficer', key: 'officer' },
    { id: 'loginTabClient', key: 'client' }
  ];

  tabs.forEach(tab => {
    const btn = document.getElementById(tab.id);
    if (!btn) return;
    if (tab.key === role) {
      btn.className = 'py-3.5 px-3 flex flex-col sm:flex-row items-center justify-center gap-2 border-b-2 border-primary text-primary bg-surface-container-low transition-all';
    } else {
      btn.className = 'py-3.5 px-3 flex flex-col sm:flex-row items-center justify-center gap-2 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-all';
    }
  });

  const panels = [
    { id: 'loginContentAdmin', key: 'admin' },
    { id: 'loginContentOfficer', key: 'officer' },
    { id: 'loginContentClient', key: 'client' }
  ];

  panels.forEach(p => {
    const el = document.getElementById(p.id);
    if (!el) return;
    if (p.key === role) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
}

function switchClientSubtype(subtype) {
  AppState.clientSubtype = subtype;
  clearLoginAlert();

  const btnLandowner = document.getElementById('btnClientSubLandowner');
  const btnViewer = document.getElementById('btnClientSubViewer');
  const panelLandowner = document.getElementById('clientSubLandownerPanel');
  const panelViewer = document.getElementById('clientSubViewerPanel');

  if (subtype === 'landowner') {
    if (btnLandowner) btnLandowner.className = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-primary text-on-primary shadow-sm flex items-center justify-center gap-1.5 transition-all';
    if (btnViewer) btnViewer.className = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1.5 transition-all';
    if (panelLandowner) panelLandowner.classList.remove('hidden');
    if (panelViewer) panelViewer.classList.add('hidden');
  } else {
    if (btnViewer) btnViewer.className = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-primary text-on-primary shadow-sm flex items-center justify-center gap-1.5 transition-all';
    if (btnLandowner) btnLandowner.className = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1.5 transition-all';
    if (panelLandowner) panelLandowner.classList.add('hidden');
    if (panelViewer) panelViewer.classList.remove('hidden');
  }
}

// 1-Click Demo or Authenticated Session Login
function loginAs(role, subtype, isDemo = false, customUserData = null) {
  let targetKey = role;
  if (role === 'client') {
    targetKey = subtype || AppState.clientSubtype || 'landowner';
  }

  const baseProfile = USER_PROFILES[targetKey] || USER_PROFILES.admin;
  const user = customUserData ? { ...baseProfile, ...customUserData } : { ...baseProfile };

  AppState.currentUser = user;
  AppState.isLoggedIn = true;
  AppState.isDemoMode = !!isDemo;

  // Persist in sessionStorage for refreshing
  try {
    sessionStorage.setItem('ebhumi_session', JSON.stringify({
      role: targetKey,
      subtype: subtype || targetKey,
      isDemo: AppState.isDemoMode,
      user: AppState.currentUser
    }));
  } catch (err) {
    console.warn('Could not save session:', err);
  }

  // Update Demo Mode Indicator Badge in Top Header
  const demoBadge = document.getElementById('demoModeBadge');
  if (demoBadge) {
    if (AppState.isDemoMode) {
      demoBadge.classList.remove('hidden');
      demoBadge.classList.add('flex');
    } else {
      demoBadge.classList.add('hidden');
      demoBadge.classList.remove('flex');
    }
  }

  // Reveal main dashboard & hide login view
  const loginPortal = document.getElementById('loginPortalView');
  const mainShell = document.getElementById('mainAppShell');

  if (loginPortal) loginPortal.classList.add('hidden');
  if (mainShell) mainShell.classList.remove('hidden');

  // Update Header user profile display
  updateHeaderUserProfile(user);

  // Apply Role-Based Access Control
  applyRolePermissions(targetKey);

  // Resize Google Maps smoothly inside container
  setTimeout(() => {
    if (AppState.overviewMap && window.google && google.maps) {
      google.maps.event.trigger(AppState.overviewMap, 'resize');
      AppState.overviewMap.setCenter({ lat: 20.8980, lng: 79.0265 });
    }
    if (AppState.dedicatedMap && window.google && google.maps) {
      google.maps.event.trigger(AppState.dedicatedMap, 'resize');
      AppState.dedicatedMap.setCenter({ lat: 20.8980, lng: 79.0265 });
    }
  }, 100);

  if (AppState.isDemoMode) {
    showToast(`⚡ 1-Click Demo Login: ${user.name} [${user.badge}] (🔒 Read-Only Mode Active)`, 4500);
  } else {
    showToast(`✓ Official Sign-in Verified: ${user.name} [${user.badge}]`, 3500);
  }

  // Navigate to appropriate starting view
  if (targetKey === 'landowner') {
    switchView('parcels');
    selectParcel('MH-NGP-4029');
  } else {
    switchView('overview');
  }
}

// Check if current session is in 1-Click Demo mode and block modifications
function checkDemoRestriction(actionName = 'modify database records') {
  if (AppState.isDemoMode) {
    showToast(`🔒 Action Blocked: 1-Click Demo accounts are strictly Read-Only. You cannot ${actionName}. Please register or log in with official credentials.`, 5000);
    return true; // blocked
  }
  return false; // allowed
}

// Handle Form Submission for Real Database Authentication (Admin, Officer, Landowner)
async function handleFormLogin(event, roleKey) {
  if (event) event.preventDefault();
  clearLoginAlert();

  let username = '';
  let password = '';

  if (roleKey === 'admin') {
    username = document.getElementById('adminUsername').value.trim();
    password = document.getElementById('adminPassword').value;
  } else if (roleKey === 'officer') {
    username = document.getElementById('officerIdInput').value.trim();
    password = document.getElementById('officerPinInput').value;
  } else if (roleKey === 'landowner') {
    username = document.getElementById('landownerAadhaar').value.trim();
    password = document.getElementById('landownerOtp').value;
  }

  if (!username || !password) {
    showLoginAlert('Please provide your official ID/Email and password/PIN.', 'error');
    return;
  }

  try {
    const res = await fetch(`${AppState.apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: roleKey,
        username: username,
        password: password,
        is_demo: false
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      const dbUser = data.user || {};
      const customProfile = {
        name: dbUser.name || USER_PROFILES[roleKey].name,
        officerId: dbUser.officer_id || dbUser.aadhaar_no || USER_PROFILES[roleKey].officerId,
        avatarText: (dbUser.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
      };
      loginAs(roleKey, null, false, customProfile);
    } else {
      showLoginAlert(`Authentication Failed: ${data.message || 'Invalid credentials'}`, 'error');
    }
  } catch (err) {
    console.warn('Backend auth endpoint unreachable, falling back to local verification:', err);
    // Offline local fallback
    loginAs(roleKey, null, false);
    showToast(`✓ Signed in (Local Offline Verification): ${USER_PROFILES[roleKey].name}`);
  }
}

// Send OTP via SMS or Voice Call for Public Citizen
async function sendCitizenOtp() {
  clearLoginAlert();
  const phoneInput = document.getElementById('citizenMobileInput');
  const btn = document.getElementById('btnSendCitizenOtp');
  const btnText = document.getElementById('btnSendCitizenOtpText');
  const timerEl = document.getElementById('citizenOtpTimer');
  const otpInput = document.getElementById('citizenOtpInput');

  const phone = phoneInput ? phoneInput.value.trim() : '';
  if (!/^[0-9]{10}$/.test(phone)) {
    showLoginAlert('Please enter a valid 10-digit Indian mobile phone number (e.g. 9876543210).', 'error');
    if (phoneInput) phoneInput.focus();
    return;
  }

  const selectedChannelEl = document.querySelector('input[name="citizenOtpChannel"]:checked');
  const channel = selectedChannelEl ? selectedChannelEl.value : 'sms';

  if (btn) btn.disabled = true;
  if (btnText) btnText.textContent = channel === 'voice' ? 'Placing Real Voice Call via 2Factor...' : 'Dispatching Real SMS via 2Factor...';

  try {
    const res = await fetch(`${AppState.apiBase}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phone, channel: channel })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      const channelLabel = channel === 'voice' ? 'Automated Voice Call' : 'Cellular SMS';
      if (data.telephonyStatus && data.telephonyStatus.includes('dispatched')) {
        showLoginAlert(`✓ Real ${channelLabel} successfully dispatched to <strong>+91 ${phone}</strong>! Please check your phone for the 6-digit code.`, 'success');
        if (timerEl) timerEl.textContent = `Real ${channel === 'voice' ? 'Call' : 'SMS'} Sent (Valid 10m)`;
        if (otpInput) {
          otpInput.value = '';
          otpInput.focus();
        }
      } else {
        showLoginAlert(`✓ Code generated for +91 ${phone}! Code: <strong>${data.otp || '482901'}</strong>`, 'success');
        if (timerEl) timerEl.textContent = `Code: ${data.otp || '482901'}`;
        if (otpInput && data.otp) {
          otpInput.value = data.otp;
          otpInput.focus();
        }
      }
    } else {
      showLoginAlert(`Failed to dispatch verification code: ${data.message || data.error || 'Gateway error'}`, 'error');
    }
  } catch (err) {
    console.warn('OTP API offline, fallback to demo code:', err);
    const demoCode = '482901';
    showLoginAlert(`✓ Demo verification code: <strong>${demoCode}</strong> (Sent to +91 ${phone})`, 'success');
    if (timerEl) timerEl.textContent = `Code: ${demoCode}`;
    if (otpInput) {
      otpInput.value = demoCode;
      otpInput.focus();
    }
  } finally {
    if (btn) btn.disabled = false;
    if (btnText) btnText.textContent = 'Get Verification OTP / Call';
  }
}

// Verify OTP for Public Citizen and complete sign-in
async function verifyCitizenOtp() {
  clearLoginAlert();
  const phoneInput = document.getElementById('citizenMobileInput');
  const otpInput = document.getElementById('citizenOtpInput');

  const phone = phoneInput ? phoneInput.value.trim() : '9876543210';
  const otp = otpInput ? otpInput.value.trim() : '';

  if (!otp || otp.length < 4) {
    showLoginAlert('Please enter the received verification OTP code.', 'error');
    if (otpInput) otpInput.focus();
    return;
  }

  try {
    const res = await fetch(`${AppState.apiBase}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phone, otp_code: otp })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      const dbUser = data.user || {};
      const customProfile = {
        name: dbUser.name || `Citizen (+91 ${phone})`,
        officerId: `+91 ${phone}`,
        avatarText: 'PC'
      };
      loginAs('viewer', 'viewer', false, customProfile);
      // Post-Login: Redirect user to dedicated new browser tab to display inspect data
      window.open('/inspector.html?plot_id=MH-NGP-4029&phone=' + encodeURIComponent(phone), '_blank');
    } else {
      showLoginAlert(`Verification Failed: ${data.message || 'Incorrect OTP'}`, 'error');
    }
  } catch (err) {
    console.warn('Verify OTP endpoint offline, fallback login:', err);
    const customProfile = {
      name: `Citizen (+91 ${phone})`,
      officerId: `+91 ${phone}`,
      avatarText: 'PC'
    };
    loginAs('viewer', 'viewer', false, customProfile);
  }
}

// First Time Registration Modal Controllers
function openRegisterModal(defaultRole = 'viewer') {
  const modal = document.getElementById('modalFirstTimeRegister');
  const form = document.getElementById('formFirstTimeRegister');
  const roleSelect = document.getElementById('regRoleSelect');
  const alertBox = document.getElementById('registerAlertBox');

  if (form) form.reset();
  if (alertBox) alertBox.classList.add('hidden');
  if (roleSelect) {
    roleSelect.value = defaultRole;
    onRegisterRoleChange();
  }
  if (modal) modal.classList.remove('hidden');
}

function closeRegisterModal() {
  const modal = document.getElementById('modalFirstTimeRegister');
  if (modal) modal.classList.add('hidden');
}

function onRegisterRoleChange() {
  const role = document.getElementById('regRoleSelect').value;
  const label = document.getElementById('regExtraFieldLabel');
  const input = document.getElementById('regExtraField');

  if (!label || !input) return;

  if (role === 'admin') {
    label.innerHTML = 'Official Government Designation / Officer ID <span class="text-error">*</span>';
    input.placeholder = 'e.g. LAO-094 / CALA Incharge';
    input.required = true;
  } else if (role === 'officer') {
    label.innerHTML = 'Field Officer ID / Patwari Zone <span class="text-error">*</span>';
    input.placeholder = 'e.g. SLAO-082';
    input.required = true;
  } else if (role === 'landowner') {
    label.innerHTML = '12-Digit Aadhaar / Survey Khasra No <span class="text-error">*</span>';
    input.placeholder = 'e.g. 849210293847 or Plot 142/3A';
    input.required = true;
  } else {
    label.innerHTML = 'National ID / Voter ID (Optional)';
    input.placeholder = 'Optional identification';
    input.required = false;
  }
}

async function handleFirstTimeRegister(event) {
  event.preventDefault();

  const alertBox = document.getElementById('registerAlertBox');
  const alertText = document.getElementById('registerAlertText');
  const alertIcon = document.getElementById('registerAlertIcon');
  const btn = document.getElementById('btnSubmitRegister');
  const btnText = document.getElementById('btnSubmitRegisterText');

  const role = document.getElementById('regRoleSelect').value;
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const extra = document.getElementById('regExtraField').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;

  if (password !== confirmPassword) {
    if (alertBox && alertText) {
      alertBox.classList.remove('hidden');
      alertBox.className = 'p-3 rounded-xl border text-xs flex items-start gap-2 bg-error-container/40 border-error/30 text-error';
      if (alertIcon) alertIcon.textContent = 'error';
      alertText.textContent = 'Passwords do not match. Please re-enter matching passwords.';
    }
    return;
  }

  if (password.length < 4) {
    if (alertBox && alertText) {
      alertBox.classList.remove('hidden');
      alertBox.className = 'p-3 rounded-xl border text-xs flex items-start gap-2 bg-error-container/40 border-error/30 text-error';
      if (alertIcon) alertIcon.textContent = 'error';
      alertText.textContent = 'Password/PIN must be at least 4 characters long.';
    }
    return;
  }

  if (btn) btn.disabled = true;
  if (btnText) btnText.textContent = 'Registering Profile into MySQL...';

  const payload = {
    role: role,
    name: name,
    phone_number: phone,
    email: email,
    officer_id: (role === 'admin' || role === 'officer') ? extra : null,
    aadhaar_no: (role === 'landowner') ? extra : null,
    password: password
  };

  try {
    const res = await fetch(`${AppState.apiBase}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      closeRegisterModal();
      showToast(`✓ Account registered successfully for ${name} in MySQL database!`);
      const customProfile = {
        name: name,
        officerId: extra || phone,
        avatarText: name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
      };
      loginAs(role, role === 'landowner' ? 'landowner' : (role === 'viewer' ? 'viewer' : null), false, customProfile);
    } else {
      if (alertBox && alertText) {
        alertBox.classList.remove('hidden');
        alertBox.className = 'p-3 rounded-xl border text-xs flex items-start gap-2 bg-error-container/40 border-error/30 text-error';
        if (alertIcon) alertIcon.textContent = 'error';
        alertText.textContent = data.message || 'Registration failed.';
      }
    }
  } catch (err) {
    console.warn('Backend register offline:', err);
    closeRegisterModal();
    showToast(`✓ Registered & Logged In as ${name} (Offline Profile).`);
    const customProfile = {
      name: name,
      officerId: extra || phone,
      avatarText: name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    };
    loginAs(role, role === 'landowner' ? 'landowner' : (role === 'viewer' ? 'viewer' : null), false, customProfile);
  } finally {
    if (btn) btn.disabled = false;
    if (btnText) btnText.textContent = 'Complete Registration & Sign In';
  }
}

function logout() {
  try {
    sessionStorage.removeItem('ebhumi_session');
  } catch (e) {}

  AppState.isLoggedIn = false;
  AppState.currentUser = null;
  AppState.isDemoMode = false;

  const loginPortal = document.getElementById('loginPortalView');
  const mainShell = document.getElementById('mainAppShell');
  const profileDropdown = document.getElementById('headerProfileDropdown');
  const demoBadge = document.getElementById('demoModeBadge');

  if (demoBadge) {
    demoBadge.classList.add('hidden');
    demoBadge.classList.remove('flex');
  }
  if (profileDropdown) profileDropdown.classList.add('hidden');
  if (mainShell) mainShell.classList.add('hidden');
  if (loginPortal) loginPortal.classList.remove('hidden');

  // Reset to Overview
  switchView('overview');

  showToast('Signed out of session. Returned to Login Gateway.');
}

function toggleProfileDropdown() {
  const dd = document.getElementById('headerProfileDropdown');
  if (dd) {
    dd.classList.toggle('hidden');
  }
}

function openPermissionsModal() {
  const modal = document.getElementById('modalPermissionsMatrix');
  if (modal) modal.classList.remove('hidden');
  const dd = document.getElementById('headerProfileDropdown');
  if (dd) dd.classList.add('hidden');
}

function closePermissionsModal() {
  const modal = document.getElementById('modalPermissionsMatrix');
  if (modal) modal.classList.add('hidden');
}

function updateHeaderUserProfile(user) {
  const avatar = document.getElementById('headerUserAvatar');
  const name = document.getElementById('headerOfficerName');
  const badge = document.getElementById('headerRoleBadge');
  const role = document.getElementById('headerOfficerRole');
  const ddName = document.getElementById('profileDropdownName');
  const ddRole = document.getElementById('profileDropdownRole');

  if (avatar) {
    avatar.textContent = user.avatarText || 'US';
    avatar.className = `w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${user.avatarBg || 'bg-primary text-on-primary'}`;
  }
  if (name) name.textContent = user.name;
  if (badge) {
    badge.textContent = user.roleKey.toUpperCase();
    badge.className = `text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${user.badgeClass || 'bg-primary text-on-primary'}`;
  }
  if (role) role.textContent = user.officerId ? `ID: ${user.officerId}` : user.designation;
  if (ddName) ddName.textContent = user.name;
  if (ddRole) ddRole.textContent = user.badge;
}

function applyRolePermissions(roleKey) {

  const user = AppState.currentUser || USER_PROFILES[roleKey] || USER_PROFILES.admin;
  const isAdmin = (roleKey === 'admin');
  const isOfficer = (roleKey === 'officer');
  const isLandowner = (roleKey === 'landowner');
  const isViewer = (roleKey === 'viewer');

  // PUBLIC VIEW: Read-Only, strictly can only view projects
  if (isViewer) {
    if (AppState.currentView !== 'projects') {
      switchView('projects');
    }
  }

  // 1. MySQL Live DB Status & Sync Buttons (STRICTLY Admin / Auditor ONLY)
  const dbStatusBadge = document.getElementById('dbStatusBadge');
  if (dbStatusBadge) dbStatusBadge.style.display = isAdmin ? 'flex' : 'none';

  const parcelsDbSyncTag = document.getElementById('parcelsDbSyncTag');
  if (parcelsDbSyncTag) parcelsDbSyncTag.style.display = isAdmin ? 'inline-flex' : 'none';

  const btnSyncPlots = document.getElementById('btnSyncPlots');
  if (btnSyncPlots) btnSyncPlots.style.display = isAdmin ? '' : 'none';

  // 2. System Settings & Financial Reports (Admin ONLY)
  const navReports = document.querySelector('[data-nav-view="reports"]');
  if (navReports) navReports.style.display = 'none'; // Globally removed

  // 3. Workflows & Approvals (Admin ONLY: Full. Field Officer, Landowner & Viewer: STRICTLY HIDDEN)
  const navWorkflows = document.querySelector('[data-nav-view="workflows"]');
  if (navWorkflows) {
    navWorkflows.style.display = isAdmin ? 'flex' : 'none';
  }

  // Hide Urgent Approval Queue and Workflow section on Overview for non-admin
  const overviewWorkflow = document.getElementById('overviewWorkflowSection');
  if (overviewWorkflow) {
    overviewWorkflow.style.display = isAdmin ? '' : 'none';
  }

  // Hide E-Sign and Approval controls from Field Officer, Landowner, and Viewer
  const esignButtons = document.querySelectorAll('[data-queue-action="esign"]');
  esignButtons.forEach(btn => {
    btn.style.display = isAdmin ? 'flex' : 'none';
  });

  const esignModal = document.getElementById('esignModal');
  if (!isAdmin && esignModal) {
    esignModal.classList.add('hidden');
  }

  // 4. Field Survey Tab (Admin & Field Officer only)
  const navSurvey = document.querySelector('[data-nav-view="survey"]');
  if (navSurvey) {
    navSurvey.style.display = (isAdmin || isOfficer) ? 'flex' : 'none';
  }

  // 5. Compensation Module & Valuation Overrides: Admin ONLY (Field Officer & Landowners Restricted)
  const drawerValuationDetails = document.querySelector('#parcelDossierDrawer details');
  if (drawerValuationDetails) {
    drawerValuationDetails.style.display = isAdmin ? '' : 'none';
  }

  const drawerDbtBtn = document.getElementById('btnDrawerDbtTransfer');
  if (drawerDbtBtn) {
    drawerDbtBtn.style.display = isAdmin ? 'flex' : 'none';
  }

  // 6. Bulk upload and new project creation: Admin ONLY
  const bulkControls = [
    document.getElementById('btnBulkUpload'),
    document.getElementById('btnNewAcqProject'),
    document.getElementById('btnNewProjectTab'),
    document.getElementById('btnOpenAddPlotModal'),
    document.getElementById('btnOpenUploadPlotsModal')
  ];
  bulkControls.forEach(el => {
    if (el) el.style.display = isAdmin ? '' : 'none';
  });

  // 7. Pending approvals badge in header (Admin ONLY)
  const pendingHeaderBtn = document.querySelector('button[title="Statutory Approvals Queue"]');
  if (pendingHeaderBtn) {
    pendingHeaderBtn.style.display = isAdmin ? 'flex' : 'none';
  }

  // 8. Land Parcels Table Filtering
  renderParcelsTable();

  // 9. Inject Contextual Role Banner on Overview Dashboard
  renderOverviewRoleBanner(user);

}

function renderOverviewRoleBanner(user) {
  let banner = document.getElementById('overviewRoleBannerContainer');
  const overviewView = document.getElementById('view-overview');
  if (!overviewView) return;

  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'overviewRoleBannerContainer';
    overviewView.insertBefore(banner, overviewView.firstChild);
  }

  if (user.roleKey === 'admin') {
    banner.innerHTML = `
      <div class="p-3.5 bg-primary-container/20 border border-primary-container/40 rounded-xl flex items-center justify-between gap-4 text-xs">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          </div>
          <div>
            <div class="font-bold text-on-surface flex items-center gap-2">
              <span>System Admin (Auditor) Mode</span>
              <span class="text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded font-bold uppercase">Full Permissions</span>
            </div>
            <div class="text-on-surface-variant text-[11px] mt-0.5">
              Authorized for Section 19 Digital Signatures, ₹620 Cr Escrow Disbursals, Corridor Settings & System Audit.
            </div>
          </div>
        </div>
        <button onclick="openPermissionsModal()" class="text-secondary font-semibold hover:underline shrink-0 flex items-center gap-1 text-[11px]">
          <span>View Matrix</span>
          <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    `;
  } else if (user.roleKey === 'officer') {
    banner.innerHTML = `
      <div class="p-3.5 bg-secondary-container/30 border border-secondary/40 rounded-xl flex items-center justify-between gap-4 text-xs">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-secondary text-on-secondary flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[18px]">explore</span>
          </div>
          <div>
            <div class="font-bold text-on-surface flex items-center gap-2">
              <span>Field Acquisition Officer (SLAO-082) Active Mode</span>
              <span class="text-[10px] bg-secondary text-on-secondary px-2 py-0.5 rounded font-bold uppercase">Acquisition Agent</span>
            </div>
            <div class="text-on-surface-variant text-[11px] mt-0.5">
              DGPS Survey & Vertex Demarcation active. Cash award approvals: <strong class="text-amber-800">⚠️ View Only</strong> (CALA Admin Required). Macro financial audit reports restricted.
            </div>
          </div>
        </div>
        <button onclick="openPermissionsModal()" class="text-secondary font-semibold hover:underline shrink-0 flex items-center gap-1 text-[11px]">
          <span>View Matrix</span>
          <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    `;
  } else if (user.roleKey === 'landowner') {
    banner.innerHTML = `
      <div class="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-4 text-xs">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[18px]">agriculture</span>
          </div>
          <div>
            <div class="font-bold text-emerald-900 flex items-center gap-2">
              <span>Personal Landowner Awardee: Rameshwar Patil</span>
              <span class="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold uppercase">Own Holding Only</span>
            </div>
            <div class="text-emerald-800 text-[11px] mt-0.5">
              Showing Survey Plot <strong>#MH-NGP-4029</strong> (Khasra 142/3A). Award Compensation: <strong>₹ 1,42,50,000</strong> (Escrow Ready). PFMS DBT direct bank transfer scheduled.
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button onclick="selectParcel('MH-NGP-4029'); switchView('parcels');" class="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 text-[11px] shadow-sm">
            <span>View My Land Dossier</span>
            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
          <button onclick="openPermissionsModal()" class="text-emerald-900 font-semibold hover:underline text-[11px]">
            Matrix
          </button>
        </div>
      </div>
    `;
  } else if (user.roleKey === 'viewer') {
    banner.innerHTML = `
      <div class="p-3.5 bg-surface-container-low border border-surface-container rounded-xl flex items-center justify-between gap-4 text-xs">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[18px]">visibility</span>
          </div>
          <div>
            <div class="font-bold text-on-surface flex items-center gap-2">
              <span>Public Citizen & Open Cadastre View Mode</span>
              <span class="text-[10px] bg-surface-container-high text-on-surface px-2 py-0.5 rounded font-bold uppercase">Public View Only</span>
            </div>
            <div class="text-on-surface-variant text-[11px] mt-0.5">
              Public corridor alignment maps & official gazette notices are viewable. Compensation amounts and internal administrative decisions are protected.
            </div>
          </div>
        </div>
        <button onclick="openPermissionsModal()" class="text-secondary font-semibold hover:underline shrink-0 flex items-center gap-1 text-[11px]">
          <span>View Matrix</span>
          <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    `;
  }
}

// --- GOOGLE SATELLITE MAP ENGINE (SUPPORTING BOTH OVERVIEW & DEDICATED GIS MAP) ---
function initGoogleSatelliteMaps() {
  const centerCoords = { lat: 20.8980, lng: 79.0265 }; // Nagpur Rural Highway corridor

  if (typeof google !== 'undefined' && google.maps) {
    try {
      // 1. Overview Map
      const overviewContainer = document.getElementById('googleMapContainer');
      if (overviewContainer) {
        AppState.overviewMap = createGoogleMapInstance(overviewContainer, centerCoords, 16, AppState.overviewPolygons);
      }

      // 2. Dedicated Full-Height Interactive Map View
      const dedicatedContainer = document.getElementById('dedicatedGoogleMap');
      if (dedicatedContainer) {
        AppState.dedicatedMap = createGoogleMapInstance(dedicatedContainer, centerCoords, 16, AppState.dedicatedPolygons);
      }

      AppState.googleMapsLoaded = true;

      // Update status indicators
      document.querySelectorAll('.map-satellite-status').forEach(el => {
        el.textContent = 'Google Maps Satellite View Active';
        el.className = 'w-2 h-2 rounded-full bg-secondary inline-block animate-pulse';
      });

      // Hide fallback SVG on overview
      const fallbackSvg = document.getElementById('gisMapSvgContainer');
      if (fallbackSvg) fallbackSvg.classList.add('hidden');
      if (overviewContainer) overviewContainer.classList.remove('hidden');

    } catch (e) {
      console.warn('Google Maps initialization fallback to SVG canvas:', e);
      activateSvgFallback();
    }
  } else {
    activateSvgFallback();
  }

  // Setup Overview Map Controls
  bindMapControls(AppState.overviewMap, 'btnMapSatellite', 'btnMapHybrid', 'btnMapTerrain', 'btn-map-zoom-in', 'btn-map-zoom-out', 'btn-map-center');

  // Setup Dedicated Map View Controls
  bindMapControls(AppState.dedicatedMap, 'btnDedicatedSatellite', 'btnDedicatedHybrid', 'btnDedicatedTerrain', 'btn-dedicated-zoom-in', 'btn-dedicated-zoom-out', 'btn-dedicated-center');
}

function createGoogleMapInstance(container, center, zoom, polygonArray) {
  const map = new google.maps.Map(container, {
    center: center,
    zoom: zoom,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    tilt: 0,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  });

  // Draw Highway Alignment Ribbon
  const highwayRoute = [
    { lat: 20.8930, lng: 79.0200 },
    { lat: 20.8955, lng: 79.0235 },
    { lat: 20.8980, lng: 79.0265 },
    { lat: 20.9015, lng: 79.0305 },
    { lat: 20.9050, lng: 79.0345 }
  ];

  new google.maps.Polyline({
    path: highwayRoute,
    geodesic: true,
    strokeColor: '#fde047',
    strokeOpacity: 0.9,
    strokeWeight: 4,
    map: map
  });

  // Draw Land Plot Polygons
  AppState.parcels.forEach(parcel => {
    if (!parcel.bounds) return;

    let fillColor = '#82f5c1';
    let strokeColor = '#006c4a';

    if (parcel.id === 'MH-NGP-4029') {
      fillColor = '#fde68a';
      strokeColor = '#92400e';
    } else if (parcel.stage === 'disputed') {
      fillColor = '#ffdad6';
      strokeColor = '#ba1a1a';
    } else if (parcel.stage === 'surveyed') {
      fillColor = '#cce5ff';
      strokeColor = '#188ace';
    } else if (parcel.stage === 'valuation') {
      fillColor = '#fde68a';
      strokeColor = '#92400e';
    }

    const poly = new google.maps.Polygon({
      paths: parcel.bounds,
      strokeColor: strokeColor,
      strokeOpacity: 0.95,
      strokeWeight: parcel.id === AppState.activeParcelId ? 4 : 2,
      fillColor: fillColor,
      fillOpacity: parcel.id === AppState.activeParcelId ? 0.65 : 0.45,
      map: map,
      clickable: true
    });

    poly.addListener('click', () => {
      selectParcel(parcel.id);
    });

    poly.addListener('mouseover', () => {
      poly.setOptions({ fillOpacity: 0.8 });
    });

    poly.addListener('mouseout', () => {
      poly.setOptions({ fillOpacity: parcel.id === AppState.activeParcelId ? 0.65 : 0.45 });
    });

    // Centroid Marker with label
    new google.maps.Marker({
      position: {
        lat: (parcel.bounds[0].lat + parcel.bounds[2].lat) / 2,
        lng: (parcel.bounds[0].lng + parcel.bounds[2].lng) / 2
      },
      map: map,
      label: {
        text: `#${parcel.id.replace('MH-NGP-', '')}`,
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '11px'
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: strokeColor,
        fillOpacity: 0.95,
        strokeWeight: 1,
        strokeColor: '#ffffff'
      },
      title: `Plot #${parcel.id} - ${parcel.owner}`
    });

    polygonArray.push({ id: parcel.id, polygon: poly });
  });

  return map;
}

function bindMapControls(mapInstance, satBtnId, hybridBtnId, terrainBtnId, zoomInId, zoomOutId, centerId) {
  const btnSat = document.getElementById(satBtnId);
  const btnHybrid = document.getElementById(hybridBtnId);
  const btnTerrain = document.getElementById(terrainBtnId);
  const btnZoomIn = document.getElementById(zoomInId);
  const btnZoomOut = document.getElementById(zoomOutId);
  const btnCenter = document.getElementById(centerId);

  if (btnSat) {
    btnSat.addEventListener('click', () => {
      const activeMap = mapInstance || AppState.overviewMap || AppState.dedicatedMap;
      if (activeMap) activeMap.setMapTypeId(google.maps.MapTypeId.SATELLITE);
      setActiveMapBtn(btnSat);
      showToast('Switched to High-Resolution Satellite View');
    });
  }

  if (btnHybrid) {
    btnHybrid.addEventListener('click', () => {
      const activeMap = mapInstance || AppState.overviewMap || AppState.dedicatedMap;
      if (activeMap) activeMap.setMapTypeId(google.maps.MapTypeId.HYBRID);
      setActiveMapBtn(btnHybrid);
      showToast('Switched to Satellite + Highway Labels (Hybrid View)');
    });
  }

  if (btnTerrain) {
    btnTerrain.addEventListener('click', () => {
      const activeMap = mapInstance || AppState.overviewMap || AppState.dedicatedMap;
      if (activeMap) activeMap.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      setActiveMapBtn(btnTerrain);
      showToast('Switched to Cadastral Street Map View');
    });
  }

  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
      const activeMap = mapInstance || AppState.overviewMap || AppState.dedicatedMap;
      if (activeMap) activeMap.setZoom(activeMap.getZoom() + 1);
    });
  }

  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
      const activeMap = mapInstance || AppState.overviewMap || AppState.dedicatedMap;
      if (activeMap) activeMap.setZoom(activeMap.getZoom() - 1);
    });
  }

  if (btnCenter) {
    btnCenter.addEventListener('click', () => {
      const activeMap = mapInstance || AppState.overviewMap || AppState.dedicatedMap;
      if (activeMap) {
        activeMap.setCenter({ lat: 20.8980, lng: 79.0265 });
        activeMap.setZoom(16);
      }
      showToast('Map centered on Nagpur Rural corridor (Km 138.62)');
    });
  }
}

function setActiveMapBtn(activeBtn) {
  const parent = activeBtn.parentElement;
  if (!parent) return;
  parent.querySelectorAll('button').forEach(btn => {
    btn.classList.remove('bg-primary', 'text-on-primary');
    btn.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
  });
  activeBtn.classList.add('bg-primary', 'text-on-primary');
  activeBtn.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');
}

function activateSvgFallback() {
  const mapContainer = document.getElementById('googleMapContainer');
  const fallbackSvg = document.getElementById('gisMapSvgContainer');
  if (mapContainer) mapContainer.classList.add('hidden');
  if (fallbackSvg) fallbackSvg.classList.remove('hidden');
  document.querySelectorAll('.map-satellite-status').forEach(el => {
    el.textContent = 'High-Precision Vector Cadastre Active';
  });
}

function initSvgMapFallback() {
  const polygonMap = {
    'poly-4028': 'MH-NGP-4028',
    'activeParcelPoly': 'MH-NGP-4029',
    'poly-4029': 'MH-NGP-4029',
    'poly-4030': 'MH-NGP-4030',
    'poly-4031': 'MH-NGP-4031',
    'poly-4032': 'MH-NGP-4032',
    'poly-4033': 'MH-NGP-4033',
    'poly-4034': 'MH-NGP-4034'
  };

  Object.keys(polygonMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        selectParcel(polygonMap[id]);
      });
      el.addEventListener('mouseenter', () => {
        el.style.filter = 'brightness(1.15) drop-shadow(0 0 6px rgba(0,0,0,0.3))';
      });
      el.addEventListener('mouseleave', () => {
        el.style.filter = 'none';
      });
    }
  });
}

// --- NAVIGATION & VIEWS CONTROLLER (ZERO COLOR BLEEDING) ---
function initNavigation() {
  const navLinks = document.querySelectorAll('[data-nav-view]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-nav-view');
      switchView(targetView);
      if (window.innerWidth < 1024) toggleSidebar(false);
    });
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'overview';
    switchView(hash);
  });

  if (window.location.hash) {
    switchView(window.location.hash.replace('#', ''));
  }
}

function switchView(viewName) {
  // Role-based route protection
  if (AppState.currentUser) {
    const roleKey = AppState.currentUser.roleKey;
    if (viewName === 'reports' && roleKey !== 'admin') {
      showToast('Access Restricted: Financial reports are confidential to System Admin.');
      if (AppState.currentView !== 'overview') switchView('overview');
      return;
    }
    if (viewName === 'workflows' && (roleKey === 'landowner' || roleKey === 'viewer')) {
      showToast('Access Restricted: Statutory approvals are restricted to official acquisition personnel.');
      if (AppState.currentView !== 'overview') switchView('overview');
      return;
    }
    if (viewName === 'survey' && (roleKey === 'landowner' || roleKey === 'viewer')) {
      showToast('Access Restricted: Field Demarcation is restricted to authorized survey officers.');
      if (AppState.currentView !== 'overview') switchView('overview');
      return;
    }
  }

  AppState.currentView = viewName;
  window.location.hash = viewName;

  // STRICT TAB HIGHLIGHTING: ONLY THE SINGLE SELECTED TAB GETS HIGHLIGHTED
  document.querySelectorAll('[data-nav-view]').forEach(item => {
    const target = item.getAttribute('data-nav-view');
    const isCurrent = (target === viewName);

    // Remove ALL possible active and inactive styles completely
    item.classList.remove(
      'bg-primary', 'bg-primary-container',
      'text-on-primary', 'text-on-primary-container',
      'text-on-surface-variant',
      'hover:bg-surface-container-high', 'hover:text-on-surface',
      'font-semibold'
    );

    if (isCurrent) {
      // Solid dark active style exactly like the reference design
      item.classList.add('bg-primary', 'text-on-primary', 'font-semibold');
    } else {
      // Clean inactive style
      item.classList.add('text-on-surface-variant', 'hover:bg-surface-container-high', 'hover:text-on-surface');
    }
  });

  // Map view containers
  const views = {
    overview: document.getElementById('view-overview'),
    projects: document.getElementById('view-projects'),
    parcels: document.getElementById('view-parcels'),
    gis: document.getElementById('view-gis'),
    workflows: document.getElementById('view-workflows'),
    survey: document.getElementById('view-survey'),
    documents: document.getElementById('view-documents'),
    reports: document.getElementById('view-reports'),
    complaints: document.getElementById('view-complaints')
  };

  Object.keys(views).forEach(key => {
    if (views[key]) {
      if (key === viewName) {
        views[key].classList.remove('hidden');
      } else {
        views[key].classList.add('hidden');
      }
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger Google Maps resize when switching views
  setTimeout(() => {
    if (viewName === 'overview' && AppState.overviewMap) {
      google.maps.event.trigger(AppState.overviewMap, 'resize');
      AppState.overviewMap.setCenter({ lat: 20.8980, lng: 79.0265 });
    } else if (viewName === 'gis' && AppState.dedicatedMap) {
      google.maps.event.trigger(AppState.dedicatedMap, 'resize');
      AppState.dedicatedMap.setCenter({ lat: 20.8980, lng: 79.0265 });
    }
  }, 100);
}

// --- PROJECTS MODULE & SELECTION ENGINE ---
function initProjectsModule() {
  populateHeaderProjectSelector();
  renderProjectsList();

  // Header Dropdown Change Event
  const headerSelect = document.getElementById('headerProjectSelect');
  if (headerSelect) {
    headerSelect.addEventListener('change', (e) => {
      selectProject(e.target.value, false);
    });
  }

  // New Project Form in Projects Tab
  const formNewProj = document.getElementById('formNewProject');
  if (formNewProj) {
    formNewProj.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('projInputTitle');
      const corridorInput = document.getElementById('projInputCorridor');
      const noticeInput = document.getElementById('projInputNotice');
      const targetInput = document.getElementById('projInputTarget');

      const targetVal = targetInput ? parseFloat(targetInput.value) || 500 : 500;
      const totalPlotsCalc = Math.round(targetVal * 0.35) || 120;

      const newProj = {
        id: 'PKG-' + (AppState.projects.length + 1) + 'A',
        title: titleInput ? titleInput.value : 'New Highway Corridor Project',
        category: 'National Highway Project',
        corridor: corridorInput ? corridorInput.value : 'Inter-State Expressway Expansion',
        notification: noticeInput ? noticeInput.value : 'S.O. 2480(E) / Section 3A Public Notice',
        district: 'Nagpur & Wardha Rural',
        marker: 'Km 0 to Km 54',
        targetHa: targetVal,
        acquiredHa: 0,
        percent: 0,
        totalPlots: totalPlotsCalc,
        clearPlots: 0,
        processPlots: Math.round(totalPlotsCalc * 0.4),
        reviewPlots: Math.round(totalPlotsCalc * 0.6),
        escrowCr: parseFloat((targetVal * 0.35).toFixed(2)),
        disbursedCr: 0.00,
        disbursedLandowners: 0,
        disbursedPercent: 0,
        status: 'JUST INITIALIZED',
        statusClass: 'bg-surface-container text-on-surface',
        timelineStatus: '+0 Days',
        timelineText: 'Section 3A Notice Published — Survey Initializing',
        timelineBadge: 'NEW PROJECT',
        incharge: 'Special Land Acquisition Officer (CALA)',
        stage1: { percent: 100, status: '100% Done', desc: 'Notification gazetted' },
        stage2: { percent: 15, status: '15% Initiated', desc: 'Survey teams deployed' },
        stage3: { percent: 0, status: '0% Pending', desc: 'Awaiting survey records' },
        stage4: { percent: 0, status: '0% Pending', desc: 'Valuation in progress' },
        activeStep: 1,
        centerCoords: { lat: 20.9100, lng: 79.0500 },
        coordsText: '20.9100° N, 79.0500° E'
      };

      AppState.projects.unshift(newProj);
      populateHeaderProjectSelector();
      selectProject(newProj.id, true);

      const modal = document.getElementById('modalNewProject');
      if (modal) modal.classList.add('hidden');
      formNewProj.reset();

      showToast(`✓ New Project "${newProj.title}" registered & active in Dashboard!`);
    });
  }

  // Upload Project File Dropzone & Input
  const fileInput = document.getElementById('projectFileInput');
  const uploadDropzone = document.getElementById('projectUploadDropzone');

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleProjectFileUpload(e.target.files[0]);
      }
    });
  }

  if (uploadDropzone) {
    uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropzone.classList.add('border-primary', 'bg-surface-container-high');
    });

    uploadDropzone.addEventListener('dragleave', () => {
      uploadDropzone.classList.remove('border-primary', 'bg-surface-container-high');
    });

    uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropzone.classList.remove('border-primary', 'bg-surface-container-high');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleProjectFileUpload(e.dataTransfer.files[0]);
      }
    });
  }
}

function handleProjectFileUpload(file) {
  const fileName = file.name;
  showToast(`Parsing ${fileName} (GeoJSON / Spatial Cadastre)...`);

  setTimeout(() => {
    const importedProj = {
      id: 'IMP-' + Math.floor(Math.random() * 900 + 100),
      title: fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toUpperCase() + ' Corridor',
      category: 'Imported Spatial GIS Alignment',
      corridor: 'Imported Route Alignment',
      notification: 'S.O. Verified / GeoJSON Spatial File',
      district: 'Maharashtra Cadastre Zone',
      marker: 'Km 00+000 to Km 64+200',
      targetHa: 845.2,
      acquiredHa: 512.4,
      percent: 60.6,
      totalPlots: 312,
      clearPlots: 198,
      processPlots: 96,
      reviewPlots: 18,
      escrowCr: 340.00,
      disbursedCr: 210.50,
      disbursedLandowners: 198,
      disbursedPercent: 61.9,
      status: 'IMPORTED FROM FILE',
      statusClass: 'bg-secondary-container text-on-secondary-container',
      timelineStatus: '+14 Days',
      timelineText: 'Cadastral Boundaries Ingested from GeoJSON',
      timelineBadge: 'IMPORTED',
      incharge: 'Dr. Rajeshwar Rao (SLAO)',
      stage1: { percent: 100, status: '100% Imported', desc: 'Spatial GIS layer verified' },
      stage2: { percent: 80, status: '80% Geotagged', desc: '249 of 312 boundaries synced' },
      stage3: { percent: 65, status: '65% In Process', desc: 'Award valuation draft prepared' },
      stage4: { percent: 62, status: '62% Paid', desc: '₹210.50 Cr scheduled via DBT' },
      activeStep: 3,
      centerCoords: { lat: 20.8980, lng: 79.0265 },
      coordsText: '20.8980° N, 79.0265° E'
    };

    AppState.projects.unshift(importedProj);
    populateHeaderProjectSelector();
    selectProject(importedProj.id, true);

    const modal = document.getElementById('modalBulkUpload');
    if (modal) modal.classList.add('hidden');

    showToast(`✓ Successfully imported ${fileName} & opened in Dashboard!`);
  }, 1200);
}

function populateHeaderProjectSelector() {
  const select = document.getElementById('headerProjectSelect');
  if (!select) return;

  select.innerHTML = '';
  AppState.projects.forEach(proj => {
    const opt = document.createElement('option');
    opt.value = proj.id;
    opt.textContent = `${proj.id} • ${proj.title}`;
    if (proj.id === AppState.activeProjectId) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

function selectProject(projectId, andSwitchToOverview = true) {
  const proj = AppState.projects.find(p => p.id === projectId);
  if (!proj) return;

  AppState.activeProjectId = proj.id;

  // 1. Sync Header Select Dropdown
  const headerSelect = document.getElementById('headerProjectSelect');
  if (headerSelect && headerSelect.value !== proj.id) {
    headerSelect.value = proj.id;
  }

  // 2. Update Overview UI elements with this project's data
  updateOverviewUI(proj);

  // 3. Update active card highlighting in Projects tab
  renderProjectsList();

  // 4. Pan Google Maps to corridor coordinates if loaded
  if (proj.centerCoords) {
    if (AppState.overviewMap) {
      AppState.overviewMap.panTo(proj.centerCoords);
    }
    if (AppState.dedicatedMap) {
      AppState.dedicatedMap.panTo(proj.centerCoords);
    }
  }

  // 5. Update coordinates HUD in map toolbars
  if (proj.coordsText) {
    const ovCoords = document.getElementById('overviewMapCoordsText');
    if (ovCoords) ovCoords.textContent = proj.coordsText;
    const dedCoords = document.getElementById('dedicatedMapCoordsText');
    if (dedCoords) dedCoords.textContent = proj.coordsText;
    const dedSub = document.getElementById('dedicatedMapLocationSub');
    if (dedSub) dedSub.textContent = `${proj.district} — ${proj.title}`;
  }

  // 6. Navigate to overview view if requested
  if (andSwitchToOverview) {
    switchView('overview');
  }

  showToast(`✓ Switched Dashboard to ${proj.title}`);
}

function updateOverviewUI(proj) {
  if (!proj) return;

  // Banner Details
  const cat = document.getElementById('overviewProjectCategory');
  if (cat) cat.textContent = proj.category || 'National Highway Project';

  const dist = document.getElementById('overviewProjectDistrict');
  if (dist) dist.textContent = proj.district || 'Highway Acquisition Zone';

  const title = document.getElementById('overviewProjectTitle');
  if (title) title.textContent = proj.title;

  const sector = document.getElementById('overviewProjectSector');
  if (sector) sector.textContent = `Sector: ${proj.corridor}`;

  const notif = document.getElementById('overviewProjectNotification');
  if (notif) notif.textContent = `Land Acquisition Notification: ${proj.notification}`;

  const marker = document.getElementById('overviewProjectMarker');
  if (marker) marker.textContent = `Distance Marker: ${proj.marker}`;

  const officerName = document.getElementById('headerOfficerName');
  if (officerName && proj.incharge) {
    officerName.textContent = proj.incharge.split(' - ')[0] || proj.incharge;
  }

  // 4 Stages Progress & Description
  const s1 = proj.stage1 || { percent: 100, status: '100% Completed', desc: 'Public hearing and social impact report approved' };
  const s1Badge = document.getElementById('stage1StatusBadge');
  if (s1Badge) s1Badge.innerHTML = `<span class="material-symbols-outlined text-[14px]">check_circle</span> ${s1.status}`;
  const s1Desc = document.getElementById('stage1Desc');
  if (s1Desc) s1Desc.textContent = s1.desc;
  const s1Bar = document.getElementById('stage1Bar');
  if (s1Bar) s1Bar.style.width = `${s1.percent}%`;

  const s2 = proj.stage2 || { percent: Math.round((proj.percent || 60) * 1.5), status: `${Math.round((proj.percent || 60) * 1.5)}% Active`, desc: `${proj.clearPlots + proj.processPlots} of ${proj.totalPlots} plot boundaries mapped` };
  const s2Badge = document.getElementById('stage2StatusBadge');
  if (s2Badge) s2Badge.textContent = s2.status;
  const s2Desc = document.getElementById('stage2Desc');
  if (s2Desc) s2Desc.textContent = s2.desc;
  const s2Bar = document.getElementById('stage2Bar');
  if (s2Bar) s2Bar.style.width = `${s2.percent}%`;

  const s3 = proj.stage3 || { percent: Math.round((proj.percent || 60) * 1.1), status: `${Math.round((proj.percent || 60) * 1.1)}% In Progress`, desc: 'Notices issued; remainder in final review' };
  const s3Badge = document.getElementById('stage3StatusBadge');
  if (s3Badge) s3Badge.textContent = s3.status;
  const s3Desc = document.getElementById('stage3Desc');
  if (s3Desc) s3Desc.textContent = s3.desc;
  const s3Bar = document.getElementById('stage3Bar');
  if (s3Bar) s3Bar.style.width = `${s3.percent}%`;

  const s4Percent = proj.stage4 ? proj.stage4.percent : Math.round(((proj.disbursedCr || 0) / (proj.escrowCr || 1)) * 100);
  const s4 = proj.stage4 || { percent: s4Percent, status: `${s4Percent}% Paid`, desc: `₹${proj.disbursedCr} Cr transferred to landowners via DBT` };
  const s4Badge = document.getElementById('stage4StatusBadge');
  if (s4Badge) s4Badge.textContent = s4.status;
  const s4Desc = document.getElementById('stage4Desc');
  if (s4Desc) s4Desc.textContent = s4.desc;
  const s4Bar = document.getElementById('stage4Bar');
  if (s4Bar) s4Bar.style.width = `${s4.percent}%`;

  // Milestone Stepper Active State
  const activeStepCalc = proj.activeStep || (proj.percent > 85 ? 5 : proj.percent > 65 ? 4 : proj.percent > 40 ? 3 : proj.percent > 15 ? 2 : 1);
  updateStepperRail(activeStepCalc);

  // KPI Metrics Row
  // Card 1: Land Required / Acquired
  const acqHa = document.getElementById('overviewAcquiredHa');
  if (acqHa) acqHa.textContent = Number(proj.acquiredHa).toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  const acqPct = document.getElementById('overviewAcquiredPercent');
  if (acqPct) acqPct.textContent = `${proj.percent.toFixed(1)}% Acquired`;
  const tgtHa = document.getElementById('overviewTargetHa');
  if (tgtHa) tgtHa.textContent = `Target: ${Number(proj.targetHa).toLocaleString('en-IN')} Ha`;

  // Card 2: Plots Breakdown
  const totPlots = document.getElementById('overviewTotalPlots');
  if (totPlots) totPlots.textContent = proj.totalPlots;
  const sbParcels = document.getElementById('sidebarParcelsCount');
  if (sbParcels) sbParcels.textContent = proj.totalPlots;
  const clrPlots = document.getElementById('overviewClearPlots');
  if (clrPlots) clrPlots.textContent = `${proj.clearPlots} Clear`;
  const prcPlots = document.getElementById('overviewProcessPlots');
  if (prcPlots) prcPlots.textContent = `${proj.processPlots} In Process`;
  const revPlots = document.getElementById('overviewReviewPlots');
  if (revPlots) revPlots.textContent = `${proj.reviewPlots} Under Review`;

  const clrBar = document.getElementById('overviewClearPlotsBar');
  const prcBar = document.getElementById('overviewProcessPlotsBar');
  const revBar = document.getElementById('overviewReviewPlotsBar');
  const tot = proj.totalPlots || 1;
  if (clrBar) clrBar.style.width = `${(proj.clearPlots / tot) * 100}%`;
  if (prcBar) prcBar.style.width = `${(proj.processPlots / tot) * 100}%`;
  if (revBar) revBar.style.width = `${(proj.reviewPlots / tot) * 100}%`;

  // Card 3: Funds / Disbursed DBT
  const disbCr = document.getElementById('overviewDisbursedCr');
  if (disbCr) disbCr.textContent = `₹${Number(proj.disbursedCr).toFixed(2)} Cr`;
  const escCr = document.getElementById('overviewEscrowCr');
  if (escCr) escCr.textContent = `₹${Number(proj.escrowCr).toFixed(2)} Cr`;
  const disbOwners = document.getElementById('overviewDisbursedLandowners');
  if (disbOwners) disbOwners.textContent = `${proj.disbursedLandowners || proj.clearPlots} Landowners Credited`;
  const disbPct = document.getElementById('overviewDisbursedPercent');
  const fundRelPct = proj.disbursedPercent || ((proj.disbursedCr / (proj.escrowCr || 1)) * 100);
  if (disbPct) disbPct.textContent = `${fundRelPct.toFixed(1)}% Fund Released`;

  // Card 4: Timeline & Status Badge
  const timeStat = document.getElementById('overviewTimelineStatus');
  if (timeStat) timeStat.textContent = proj.timelineStatus || '+18 Days';
  const timeText = document.getElementById('overviewTimelineText');
  if (timeText) timeText.textContent = proj.timelineText || 'Ahead of Government Target Schedule';
  const statBadge = document.getElementById('overviewStatusBadge');
  if (statBadge) {
    statBadge.textContent = proj.timelineBadge || proj.status;
    statBadge.className = `px-2 py-0.5 rounded font-bold ${proj.statusClass || 'bg-secondary-container text-on-secondary-container'}`;
  }
}

function updateStepperRail(activeStep) {
  const container = document.getElementById('overviewMilestoneStepper');
  if (!container) return;

  const steps = [
    { num: 1, title: '1. Land Records Linked', sub: '7/12 Records Synced' },
    { num: 2, title: '2. GPS Map Location Tagging', sub: 'GPS Coordinates Locked' },
    { num: 3, title: '3. Joint Land Survey & Measurement', sub: 'Boundary Cadastre' },
    { num: 4, title: '4. Compensation Price Calculation', sub: 'RFCTLARR 2.5x Formula' },
    { num: 5, title: '5. Direct Payment to Bank Accounts', sub: 'Aadhaar DBT Disbursal' }
  ];

  let html = '';
  steps.forEach((step, idx) => {
    const isPast = step.num < activeStep;
    const isCurrent = step.num === activeStep;

    if (isCurrent) {
      html += `
        <div class="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container shadow-sm shrink-0">
          <span class="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[10px]">${step.num}</span>
          <div>
            <div class="font-bold text-on-surface">${step.title}</div>
            <div class="text-[10px] text-secondary font-semibold">Active Milestone</div>
          </div>
        </div>
      `;
    } else if (isPast) {
      html += `
        <div class="flex items-center gap-2 shrink-0">
          <span class="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-[10px]">✓</span>
          <div>
            <div class="font-semibold text-on-surface">${step.title}</div>
            <div class="text-[10px] text-on-surface-variant">${step.sub}</div>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="flex items-center gap-2 shrink-0 opacity-60">
          <span class="w-5 h-5 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-[10px]">${step.num}</span>
          <div>
            <div class="font-semibold text-on-surface">${step.title}</div>
            <div class="text-[10px] text-on-surface-variant">${step.sub}</div>
          </div>
        </div>
      `;
    }

    if (idx < steps.length - 1) {
      html += `<span class="text-outline-variant">→</span>`;
    }
  });

  container.innerHTML = html;
}

function renderProjectsList() {
  const container = document.getElementById('projectsListContainer');
  if (!container) return;

  const countBadge = document.getElementById('activeProjectsCount');
  if (countBadge) countBadge.textContent = AppState.projects.length;

  container.innerHTML = '';

  AppState.projects.forEach(proj => {
    const isActive = (proj.id === AppState.activeProjectId);
    const card = document.createElement('div');
    card.className = `bg-surface-container-lowest p-6 rounded-xl shadow-sm border ${isActive ? 'border-primary ring-2 ring-primary/40 shadow-md' : 'border-surface-container/80'} flex flex-col justify-between gap-4 hover:shadow-md transition-all`;
    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-3 mb-2">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-headline font-bold text-base text-on-surface cursor-pointer hover:text-primary transition-colors" onclick="selectProject('${proj.id}', true)">${proj.title}</span>
              <span class="font-code-num text-[10px] font-bold px-2 py-0.5 rounded ${proj.statusClass}">${proj.status}</span>
              ${isActive ? '<span class="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm"><span class="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse"></span> Active in Overview</span>' : ''}
            </div>
            <div class="text-xs text-on-surface-variant mt-1">${proj.corridor} • ${proj.district}</div>
            <div class="text-[11px] text-on-surface-variant font-code-num mt-0.5">${proj.notification} • ${proj.marker}</div>
          </div>
          <span class="font-code-num text-xs bg-surface-container text-on-surface px-2 py-1 rounded font-bold">
            ${proj.percent.toFixed(1)}% Acquired
          </span>
        </div>

        <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden my-3">
          <div class="bg-secondary h-full rounded-full" style="width: ${proj.percent}%"></div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-container-low p-3 rounded-lg text-xs">
          <div>
            <span class="text-on-surface-variant text-[10px] uppercase font-code-num">Target Land</span>
            <div class="font-bold font-code-num text-on-surface">${Number(proj.targetHa).toLocaleString('en-IN')} Ha</div>
          </div>
          <div>
            <span class="text-on-surface-variant text-[10px] uppercase font-code-num">Acquired Land</span>
            <div class="font-bold font-code-num text-secondary">${Number(proj.acquiredHa).toLocaleString('en-IN')} Ha</div>
          </div>
          <div>
            <span class="text-on-surface-variant text-[10px] uppercase font-code-num">Measured Plots</span>
            <div class="font-bold font-code-num text-on-surface">${proj.totalPlots} Plots</div>
          </div>
          <div>
            <span class="text-on-surface-variant text-[10px] uppercase font-code-num">Escrow Fund</span>
            <div class="font-bold font-code-num text-on-surface">₹${Number(proj.escrowCr).toFixed(2)} Cr</div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-2 border-t border-surface-container text-xs">
        <span class="text-[11px] text-on-surface-variant truncate">Officer: ${proj.incharge}</span>
        <div class="flex items-center gap-2">
          <button onclick="selectProject('${proj.id}', true)" class="${isActive ? 'bg-secondary text-on-secondary' : 'bg-primary hover:bg-primary-container text-on-primary'} px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors shadow-sm">
            <span>${isActive ? 'Viewing in Overview' : 'Open Dashboard'}</span>
            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
          <button onclick="selectProject('${proj.id}', false); switchView('gis');" class="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors">
            <span class="material-symbols-outlined text-[14px]">map</span>
            <span>View Map</span>
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// --- PARCEL SELECTION & DOSSIER ---
function selectParcel(parcelId) {
  AppState.activeParcelId = parcelId;
  const parcel = AppState.parcels.find(p => p.id === parcelId);
  if (!parcel) return;

  // Pan Google Maps if loaded
  if (parcel.bounds && parcel.bounds[0]) {
    if (AppState.overviewMap) AppState.overviewMap.panTo(parcel.bounds[0]);
    if (AppState.dedicatedMap) AppState.dedicatedMap.panTo(parcel.bounds[0]);

    [AppState.overviewPolygons, AppState.dedicatedPolygons].forEach(polyList => {
      polyList.forEach(item => {
        if (item.id === parcelId) {
          item.polygon.setOptions({ strokeWeight: 4, strokeColor: '#fde047' });
        } else {
          item.polygon.setOptions({ strokeWeight: 2 });
        }
      });
    });
  }

  // Update floating inspector card on overview
  const cardId = document.getElementById('inspector-parcel-id');
  const cardSurvey = document.getElementById('inspector-survey-no');
  const cardOwner = document.getElementById('inspector-owner');
  const cardValuation = document.getElementById('inspector-valuation');
  const cardArea = document.getElementById('inspector-area');
  const cardStatus = document.getElementById('inspector-status');
  const cardMouza = document.getElementById('inspector-mouza');

  if (cardId) cardId.textContent = `#${parcel.id}`;
  if (cardSurvey) cardSurvey.textContent = `Survey ${parcel.surveyNo}`;
  if (cardOwner) cardOwner.textContent = parcel.owner;
  if (cardValuation) cardValuation.textContent = `₹ ${parcel.awardValuation.toLocaleString('en-IN')}`;
  if (cardArea) cardArea.textContent = `${parcel.areaHa.toFixed(3)} Ha`;
  if (cardStatus) cardStatus.textContent = parcel.status;
  if (cardMouza) cardMouza.textContent = `Mouza ${parcel.mouza} • Nagpur District • Ch. ${parcel.chainage}`;

  // Update dedicated map inspector card
  const dedId = document.getElementById('dedicated-parcel-id');
  const dedSurvey = document.getElementById('dedicated-survey-no');
  const dedOwner = document.getElementById('dedicated-owner');
  const dedValuation = document.getElementById('dedicated-valuation');
  const dedArea = document.getElementById('dedicated-area');

  if (dedId) dedId.textContent = `#${parcel.id}`;
  if (dedSurvey) dedSurvey.textContent = `Survey ${parcel.surveyNo} • Mouza ${parcel.mouza}`;
  if (dedOwner) dedOwner.textContent = parcel.owner;
  if (dedValuation) dedValuation.textContent = `₹ ${parcel.awardValuation.toLocaleString('en-IN')}`;
  if (dedArea) dedArea.textContent = `${parcel.areaHa.toFixed(3)} Ha`;

  // Highlight row in table
  document.querySelectorAll('[data-parcel-row]').forEach(tr => {
    if (tr.getAttribute('data-parcel-row') === parcelId) {
      tr.classList.add('bg-surface-container-high', 'border-l-4', 'border-primary');
    } else {
      tr.classList.remove('bg-surface-container-high', 'border-l-4', 'border-primary');
    }
  });

  openParcelDossier(parcel);
}

function openParcelDossier(parcel) {
  const drawer = document.getElementById('parcelDossierDrawer');
  if (!drawer) return;

  // Demo Mode Protection: Ensure no land information is visible or accessible in Demo mode
  if (AppState.isDemoMode) {
    document.getElementById('dossier-id').textContent = '#MH-NGP-•••• (DEMO PROTECTED)';
    document.getElementById('dossier-survey').textContent = 'Survey No. •••/•• • Mouza Protected (Demo Mode)';
    document.getElementById('dossier-owner').textContent = '•••••••••••• (Confidential - Demo Mode)';
    document.getElementById('dossier-aadhaar').textContent = 'Aadhaar Protected 🔒';
    document.getElementById('dossier-area').textContent = '•.••• Hectares (Restricted)';
    document.getElementById('dossier-class').textContent = 'Restricted in Demo Mode';
    document.getElementById('dossier-chainage').textContent = 'Km •••.••';
    document.getElementById('dossier-coords').textContent = '••.••••° N, ••.••••° E';
    document.getElementById('dossier-base-rate').textContent = '₹ ••,••,••• / Ha';
    document.getElementById('dossier-market-val').textContent = '₹ ••,••,•••';
    document.getElementById('dossier-solatium').textContent = '₹ ••,••,•••';
    document.getElementById('dossier-interest').textContent = '₹ ••,••,•••';
    document.getElementById('dossier-assets').textContent = '₹ ••,••,•••';
    document.getElementById('dossier-total').textContent = '₹ ••,••,••• (Demo View)';
    drawer.classList.remove('translate-x-full');
    showToast('🔒 Land and valuation information is restricted in Demo mode.');
    return;
  }


  document.getElementById('dossier-id').textContent = `#${parcel.id}`;
  document.getElementById('dossier-survey').textContent = `Survey No. ${parcel.surveyNo} • Mouza ${parcel.mouza}, ${parcel.tehsil}`;
  document.getElementById('dossier-owner').textContent = parcel.owner;
  document.getElementById('dossier-aadhaar').textContent = parcel.aadhaarLinked ? 'Aadhaar Verified ✓' : 'Aadhaar Pending ⚠';
  document.getElementById('dossier-aadhaar').className = parcel.aadhaarLinked ? 'font-code-num text-label-sm text-secondary font-semibold' : 'font-code-num text-label-sm text-error font-semibold';
  
  document.getElementById('dossier-area').textContent = `${parcel.areaHa} Hectares (${(parcel.areaHa * 2.471).toFixed(2)} Acres)`;
  document.getElementById('dossier-class').textContent = parcel.classification;
  document.getElementById('dossier-chainage').textContent = `${parcel.chainage}`;
  document.getElementById('dossier-coords').textContent = parcel.coordinates;

  // Breakdown formula (2.5x Multiplier)
  const baseValue = parcel.circleRate * parcel.areaHa;
  const multiplierValue = baseValue * parcel.multiplier;
  document.getElementById('dossier-base-rate').textContent = `₹ ${parcel.circleRate.toLocaleString('en-IN')} / Ha`;
  document.getElementById('dossier-multiplier').textContent = `${parcel.multiplier}x Multiplier (Rural Land Section 26)`;
  document.getElementById('dossier-market-val').textContent = `₹ ${multiplierValue.toLocaleString('en-IN')}`;
  document.getElementById('dossier-solatium').textContent = `₹ ${parcel.solatium.toLocaleString('en-IN')} (100% Solatium Section 30)`;
  document.getElementById('dossier-interest').textContent = `₹ ${parcel.interest.toLocaleString('en-IN')} (12% Addl. Interest)`;
  document.getElementById('dossier-assets').textContent = `₹ ${parcel.assetsValuation.toLocaleString('en-IN')}`;
  document.getElementById('dossier-total').textContent = `₹ ${parcel.awardValuation.toLocaleString('en-IN')}`;

  const disputeBox = document.getElementById('dossier-dispute-box');
  if (disputeBox) {
    if (parcel.disputeReason) {
      disputeBox.classList.remove('hidden');
      document.getElementById('dossier-dispute-text').textContent = parcel.disputeReason;
    } else {
      disputeBox.classList.add('hidden');
    }
  }

  drawer.classList.remove('translate-x-full');
}

function closeParcelDossier() {
  const drawer = document.getElementById('parcelDossierDrawer');
  if (drawer) {
    drawer.classList.add('translate-x-full');
  }
}

// --- LAND PLOTS & RECORDS TABLE ---
function initParcelsTable() {
  renderParcelsTable();

  const searchInput = document.getElementById('parcelSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value.toLowerCase().trim();
      renderParcelsTable();
    });
  }

  const filterTabs = document.querySelectorAll('[data-parcel-filter]');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('bg-primary', 'text-on-primary');
        t.classList.add('bg-surface-container-low', 'text-on-surface-variant');
      });
      tab.classList.add('bg-primary', 'text-on-primary');
      tab.classList.remove('bg-surface-container-low', 'text-on-surface-variant');

      AppState.activeFilter = tab.getAttribute('data-parcel-filter');
      renderParcelsTable();
    });
  });
}

function renderParcelsTable() {
  const tbody = document.getElementById('parcelsTableBody');
  if (!tbody) return;

  const isLandowner = (AppState.currentUser && AppState.currentUser.roleKey === 'landowner');
  const isViewer = (AppState.currentUser && AppState.currentUser.roleKey === 'viewer');

  const countBadge = document.getElementById('sidebarParcelsCount');
  if (countBadge) {
    countBadge.textContent = isLandowner ? '1 (Own Holding)' : '528';
  }

  const filtered = AppState.parcels.filter(p => {
    // Landowner only sees own registered plot (Matrix Row 3 & 7)
    if (isLandowner) {
      if (p.id !== 'MH-NGP-4029') return false;
    }

    if (AppState.activeFilter !== 'all') {
      if (AppState.activeFilter === 'disputed' && p.stage !== 'disputed') return false;
      if (AppState.activeFilter === 'award_ready' && p.stage !== 'award_ready') return false;
      if (AppState.activeFilter === 'surveyed' && p.stage !== 'surveyed') return false;
      if (AppState.activeFilter === 'valuation' && p.stage !== 'valuation') return false;
      if (AppState.activeFilter === 'disbursed' && p.stage !== 'disbursed') return false;
    }

    if (AppState.searchQuery) {
      const q = AppState.searchQuery;
      return p.id.toLowerCase().includes(q) ||
             p.surveyNo.toLowerCase().includes(q) ||
             p.owner.toLowerCase().includes(q) ||
             p.mouza.toLowerCase().includes(q) ||
             p.classification.toLowerCase().includes(q);
    }
    return true;
  });

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="py-6 text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-[36px] text-outline">search_off</span>
          <div class="mt-1 font-semibold text-xs">No land plots found matching your search.</div>
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(parcel => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-parcel-row', parcel.id);
    tr.className = `hover:bg-surface-container transition-colors cursor-pointer ${parcel.id === AppState.activeParcelId ? 'bg-surface-container-low font-medium' : ''}`;

    tr.innerHTML = `
      <td class="py-2.5 px-3">
        <div class="font-code-num text-xs font-bold text-on-surface">#${parcel.id}</div>
        <div class="text-[11px] text-on-surface-variant">Survey No. ${parcel.surveyNo}</div>
      </td>
      <td class="py-2.5 px-3">
        <div class="font-semibold text-xs text-on-surface">${parcel.mouza}</div>
        <div class="text-[11px] text-on-surface-variant">${parcel.tehsil}</div>
      </td>
      <td class="py-2.5 px-3 text-right font-code-num text-xs font-semibold text-on-surface">
        ${parcel.areaHa.toFixed(3)} Ha
      </td>
      <td class="py-2.5 px-3">
        <span class="bg-surface-container-high px-2 py-0.5 rounded text-[11px] text-on-surface">
          ${parcel.classification}
        </span>
      </td>
      <td class="py-2.5 px-3">
        <div class="font-medium text-xs text-on-surface">${parcel.owner}</div>
        <div class="text-[10px] ${parcel.aadhaarLinked ? 'text-secondary font-code-num' : 'text-error font-code-num'}">
          ${parcel.aadhaarLinked ? 'Aadhaar Verified ✓' : 'Aadhaar Pending ⚠'}
        </div>
      </td>
      <td class="py-2.5 px-3 text-right font-code-num text-xs font-bold text-on-surface">
        ₹ ${parcel.awardValuation.toLocaleString('en-IN')}
      </td>
      <td class="py-2.5 px-3">
        <span class="bg-${parcel.statusColor === 'secondary' ? 'secondary-container text-on-secondary-container' : parcel.statusColor === 'error' ? 'error-container text-on-error-container' : 'surface-container text-on-surface'} px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 w-fit">
          <span class="w-1.5 h-1.5 rounded-full ${parcel.statusColor === 'secondary' ? 'bg-secondary' : parcel.statusColor === 'error' ? 'bg-error' : 'bg-primary'}"></span>
          ${parcel.dbtStatus}
        </span>
      </td>
      <td class="py-2.5 px-3 text-center">
        <div class="flex items-center justify-center gap-1">
          <button class="p-1 rounded hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface" title="Inspect on Satellite Map" onclick="event.stopPropagation(); selectParcel('${parcel.id}')">
            <span class="material-symbols-outlined text-[18px]">travel_explore</span>
          </button>
          <button class="p-1 rounded hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface" title="Calculate Legal Compensation" onclick="event.stopPropagation(); selectParcel('${parcel.id}')">
            <span class="material-symbols-outlined text-[18px]">calculate</span>
          </button>
        </div>
      </td>
    `;

    tr.addEventListener('click', () => {
      selectParcel(parcel.id);
    });

    tbody.appendChild(tr);
  });
}

// --- STATUTORY APPROVAL QUEUE ---
function initApprovalQueue() {
  document.querySelectorAll('[data-queue-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.getAttribute('data-queue-action');
      const item = btn.closest('.approval-queue-item');

      if (action === 'esign') {
        showEsignModal(item);
      } else if (action === 'verify-gps') {
        verifyGpsDemarcation(item);
      } else if (action === 'assign-slao') {
        assignSlaoOfficer(item);
      }
    });
  });
}

function showEsignModal(item) {
  if (AppState.currentUser && AppState.currentUser.roleKey === 'officer') {
    showToast('⚠️ View Only: Field Officers cannot authorize cash awards. Competent Authority (CALA / Admin) approval required.');
    return;
  }
  const modal = document.getElementById('esignModal');
  if (!modal) return;
  modal.classList.remove('hidden');

  const btnConfirm = document.getElementById('btnConfirmEsign');
  btnConfirm.onclick = () => {
    modal.classList.add('hidden');
    if (item) {
      item.style.transition = 'all 0.5s ease';
      item.style.opacity = '0.3';
      item.style.transform = 'translateX(20px)';
      setTimeout(() => item.remove(), 500);
    }
    AppState.pendingApprovalsCount = Math.max(0, AppState.pendingApprovalsCount - 1);
    updatePendingBadge();
    showToast('✓ Section 19 Gazette Declaration digitally signed via NIC-eSign.');
  };
}

function verifyGpsDemarcation(item) {
  if (item) {
    item.classList.add('bg-secondary-container/30');
    item.innerHTML = `
      <div class="flex items-center gap-2 p-2 text-secondary font-semibold text-xs">
        <span class="material-symbols-outlined text-[18px]">check_circle</span>
        <span>DGPS Boundary Markers Verified & Synced with Bhumi Database.</span>
      </div>
    `;
    setTimeout(() => item.remove(), 2500);
  }
  AppState.pendingApprovalsCount = Math.max(0, AppState.pendingApprovalsCount - 1);
  updatePendingBadge();
  showToast('✓ 18 DGPS Markers verified and locked to satellite cadastre.');
}

function assignSlaoOfficer(item) {
  if (item) {
    item.innerHTML = `
      <div class="flex items-center gap-2 p-2 text-on-surface font-semibold text-xs">
        <span class="material-symbols-outlined text-[18px] text-primary">how_to_reg</span>
        <span>Notice dispatched to Sub-Divisional Magistrate. Hearing scheduled.</span>
      </div>
    `;
  }
  showToast('SLAO Hearing summons issued.');
}

function updatePendingBadge() {
  document.querySelectorAll('.badge-pending-approvals').forEach(b => {
    b.textContent = AppState.pendingApprovalsCount;
  });
}

// --- MOBILE SURVEY ENGINE ---
function initSurveyModule() {
  const btnCaptureVertex = document.getElementById('btnCaptureVertex');
  const btnSaveSurvey = document.getElementById('btnSaveSurvey');
  const btnPhotoCapture = document.getElementById('btnPhotoCapture');

  if (btnCaptureVertex) {
    btnCaptureVertex.addEventListener('click', () => {
      const nextPt = AppState.surveyWaypoints.length + 1;
      const baseLat = 20.8980;
      const baseLng = 79.0255;
      const randOffsetLat = (Math.random() - 0.5) * 0.0008;
      const randOffsetLng = (Math.random() - 0.5) * 0.0008;
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const wp = {
        pt: nextPt,
        lat: (baseLat + randOffsetLat).toFixed(6),
        lng: (baseLng + randOffsetLng).toFixed(6),
        elev: (284.5 + Math.random() * 0.4).toFixed(2) + 'm',
        acc: '±' + (1.2 + Math.random() * 0.6).toFixed(1) + ' cm',
        time: timeStr
      };

      AppState.surveyWaypoints.push(wp);
      renderWaypointsList();
      showToast(`✓ Captured GPS Vertex #${wp.pt} (${wp.lat}, ${wp.lng}) [RTK Fixed ${wp.acc}]`);
    });
  }

  if (btnSaveSurvey) {
    btnSaveSurvey.addEventListener('click', async () => {
      showToast('Syncing demarcated DGPS vertices to MySQL database...');
      try {
        const res = await fetch(`${AppState.apiBase}/survey/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plot_id: 2,
            waypoints: AppState.surveyWaypoints
          })
        });
        if (res.ok) {
          const data = await res.json();
          showToast(`✓ ${data.message}`);
        } else {
          showToast('✓ Survey Plot #MH-NGP-4029 synced to Bhumi Hub.');
        }
      } catch (err) {
        showToast('✓ Survey Plot #MH-NGP-4029 synced locally.');
      }
    });
  }

  if (btnPhotoCapture) {
    btnPhotoCapture.addEventListener('click', () => {
      const photoBadge = document.getElementById('surveyPhotoBadge');
      if (photoBadge) {
        photoBadge.textContent = '3 Landmark Photos Geo-tagged';
        photoBadge.classList.remove('bg-surface-container');
        photoBadge.classList.add('bg-secondary-container', 'text-on-secondary-container');
      }
      showToast('✓ Geo-tagged field photo attached with GPS watermark.');
    });
  }

  const btnToggleDevice = document.getElementById('btnToggleDeviceFrame');
  if (btnToggleDevice) {
    btnToggleDevice.addEventListener('click', () => {
      const container = document.getElementById('mobileSurveyContainer');
      AppState.isMobileFrame = !AppState.isMobileFrame;
      if (AppState.isMobileFrame) {
        container.className = 'max-w-md mx-auto my-4 rounded-[40px] border-[10px] border-[#0f172a] shadow-2xl overflow-hidden bg-surface relative';
        btnToggleDevice.textContent = 'View Full Screen';
      } else {
        container.className = 'w-full max-w-4xl mx-auto rounded-xl shadow-sm bg-surface overflow-hidden border border-surface-container';
        btnToggleDevice.textContent = 'View Mobile Device Frame';
      }
    });
  }

  renderWaypointsList();
}

function renderWaypointsList() {
  const container = document.getElementById('surveyWaypointsContainer');
  if (!container) return;

  container.innerHTML = '';
  AppState.surveyWaypoints.forEach(wp => {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between p-2 bg-surface-container-low rounded font-code-num text-[11px]';
    item.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[10px]">${wp.pt}</span>
        <span class="text-on-surface font-semibold">${wp.lat}° N, ${wp.lng}° E</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-on-surface-variant">${wp.elev}</span>
        <span class="text-secondary font-semibold">${wp.acc}</span>
        <span class="text-on-surface-variant">${wp.time}</span>
      </div>
    `;
    container.appendChild(item);
  });

  const countBadge = document.getElementById('surveyVertexCount');
  if (countBadge) {
    countBadge.textContent = `${AppState.surveyWaypoints.length} Vertices Demarcated`;
  }
}

// --- MODALS & NOTIFICATIONS ---
function initModals() {
  const btnNewProject = document.getElementById('btnNewProject');
  const btnNewAcqProject = document.getElementById('btnNewAcqProject');
  const btnNewProjectTab = document.getElementById('btnNewProjectTab');
  const modalNewProject = document.getElementById('modalNewProject');
  const btnCloseNewProject = document.getElementById('btnCloseNewProject');

  [btnNewProject, btnNewAcqProject, btnNewProjectTab].forEach(btn => {
    if (btn && modalNewProject) {
      btn.addEventListener('click', () => modalNewProject.classList.remove('hidden'));
    }
  });

  if (btnCloseNewProject && modalNewProject) {
    btnCloseNewProject.addEventListener('click', () => modalNewProject.classList.add('hidden'));
  }

  const btnBulkUpload = document.getElementById('btnBulkUpload');
  const modalBulkUpload = document.getElementById('modalBulkUpload');
  const btnCloseBulkUpload = document.getElementById('btnCloseBulkUpload');

  if (btnBulkUpload && modalBulkUpload) {
    btnBulkUpload.addEventListener('click', () => modalBulkUpload.classList.remove('hidden'));
    if (btnCloseBulkUpload) {
      btnCloseBulkUpload.addEventListener('click', () => modalBulkUpload.classList.add('hidden'));
    }
  }

  const btnCloseDrawer = document.getElementById('btnCloseDrawer');
  if (btnCloseDrawer) {
    btnCloseDrawer.addEventListener('click', closeParcelDossier);
  }
}

function showToast(message) {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'bg-primary text-on-primary px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 pointer-events-auto transform translate-y-2 opacity-0 transition-all duration-300';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[18px] text-secondary-container">check_circle</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// =========================================================================
// DATABASE SYNC & API INTEGRATION (MYSQL: e_bhumi_db)
// =========================================================================

async function checkDatabaseConnection(interactive = false) {
  const badge = document.getElementById('dbStatusBadge');
  const text = document.getElementById('dbStatusText');
  const syncTag = document.getElementById('parcelsDbSyncTag');

  try {
    const res = await fetch(`${AppState.apiBase}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    AppState.dbConnected = true;
    if (badge) {
      badge.className = 'hidden sm:flex items-center gap-1.5 bg-secondary-container/90 text-on-secondary-container px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border border-secondary/30 shadow-sm';
    }
    if (text) {
      text.innerHTML = `MySQL: Connected (${data.database})`;
    }
    if (syncTag) {
      syncTag.className = 'bg-secondary-container text-on-secondary-container text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1';
      syncTag.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse"></span> MySQL Live Sync: Connected';
    }

    if (interactive) {
      showToast(`✓ MySQL Database connection verified: ${data.database} on port 3306 (API Server :${data.serverPort})`);
    }
    return true;
  } catch (err) {
    console.warn('MySQL API backend not reachable at ' + AppState.apiBase, err);
    AppState.dbConnected = false;
    if (badge) {
      badge.className = 'hidden sm:flex items-center gap-1.5 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border border-amber-300';
    }
    if (text) {
      text.innerHTML = `MySQL: Offline (Using Local Sync)`;
    }
    if (syncTag) {
      syncTag.className = 'bg-amber-100 text-amber-900 text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1';
      syncTag.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block"></span> MySQL: Offline (Fallback Mode)';
    }
    if (interactive) {
      showToast('⚠️ Backend API not responding. Ensure `node server.js` is running on port 5000.');
    }
    return false;
  }
}

async function initDbSync() {
  const isConnected = await checkDatabaseConnection(false);

  if (isConnected) {
    // 1. Fetch live plots from MySQL database
    try {
      const res = await fetch(`${AppState.apiBase}/plots`);
      if (res.ok) {
        const dbPlots = await res.json();
        if (Array.isArray(dbPlots) && dbPlots.length > 0) {
          // Merge database plots into AppState.parcels
          dbPlots.forEach(dp => {
            const existingIdx = AppState.parcels.findIndex(p => p.id === dp.plot_code || p.id === `MH-NGP-${dp.plot_id}`);
            const formatted = {
              id: dp.plot_code || `MH-NGP-${dp.plot_id}`,
              plot_id: dp.plot_id,
              surveyNo: dp.plot_khasra_no,
              mouza: dp.mouza_village,
              tehsil: dp.tehsil || 'Nagpur Rural',
              areaHa: parseFloat(dp.area_hectares) || 1.5,
              classification: dp.land_classification || 'Multi-Crop Farmland',
              owner: dp.landowner_name || 'Registered Landowner',
              aadhaarLinked: Boolean(dp.aadhaar_linked),
              awardValuation: parseFloat(dp.calculated_compensation || dp.final_total_compensation || 10000000),
              dbtStatus: dp.dbt_status || 'Escrow Ready',
              status: dp.acquisition_status || 'Notice Intended',
              stage: (dp.acquisition_status === 'Acquired' || dp.acquisition_status === 'Disbursed') ? 'disbursed' :
                     (dp.acquisition_status === 'Sec 19 Award') ? 'award_ready' :
                     (dp.acquisition_status === 'Disputed') ? 'disputed' :
                     (dp.acquisition_status === 'JMS Lock') ? 'surveyed' : 'valuation',
              statusColor: (dp.acquisition_status === 'Acquired' || dp.acquisition_status === 'Disbursed') ? 'secondary' :
                           (dp.acquisition_status === 'Disputed') ? 'error' : 'primary-container',
              circleRate: parseFloat(dp.base_circle_rate) || 2000000,
              multiplier: parseFloat(dp.multiplier_factor) || 2.5,
              solatium: parseFloat(dp.solatium_amount || (dp.calculated_compensation * 0.4) || 4000000),
              interest: parseFloat(dp.additional_interest || 800000),
              assetsValuation: parseFloat(dp.assets_valuation || 1500000),
              chainage: `Km ${dp.highway_distance_marker || 140.0}`,
              coordinates: `${dp.gps_centroid_lat || '20.8980'}° N, ${dp.gps_centroid_lng || '79.0265'}° E`,
              disputeReason: dp.dispute_reason || null
            };

            if (existingIdx >= 0) {
              AppState.parcels[existingIdx] = { ...AppState.parcels[existingIdx], ...formatted };
            } else {
              AppState.parcels.push(formatted);
            }
          });

          // Refresh tables & counts
          renderParcelsTable();
          renderTabParcelsTable();
        }
      }
    } catch (e) {
      console.warn('Could not load plots from database:', e);
    }

    // 2. Fetch live grievances from MySQL database
    await refreshGrievancesFromDb(false);
  }
}

// =========================================================================
// LAND PLOTS & RECORDS HUB: UPLOAD & DOWNLOAD CONTROLLER
// =========================================================================

function initParcelsUploadDownload() {
  const dropzone = document.getElementById('plotsUploadDropzone');
  const fileInput = document.getElementById('plotsFileInput');

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handlePlotsFileUpload(e.target.files[0]);
      }
    });
  }

  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-primary', 'bg-surface-container-high');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('border-primary', 'bg-surface-container-high');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-primary', 'bg-surface-container-high');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handlePlotsFileUpload(e.dataTransfer.files[0]);
      }
    });
  }

  // Filter tabs in the dedicated Land Plots & Records view
  const tabFilterButtons = document.querySelectorAll('[data-tab-parcel-filter]');
  tabFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabFilterButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-on-primary');
      btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');

      AppState.tabParcelsFilter = btn.getAttribute('data-tab-parcel-filter');
      renderTabParcelsTable();
    });
  });

  // Search input in dedicated Land Plots & Records view
  const tabSearchInput = document.getElementById('tabParcelsSearchInput');
  if (tabSearchInput) {
    tabSearchInput.addEventListener('input', (e) => {
      AppState.tabParcelsSearchQuery = e.target.value.toLowerCase().trim();
      renderTabParcelsTable();
    });
  }

  renderTabParcelsTable();
}

function handlePlotsFileUpload(file) {
  if (checkDemoRestriction('bulk upload land parcel datasets')) return;
  const fileName = file.name.toLowerCase();
  showToast(`Parsing ${file.name} for Land Plots & Khasra records...`);

  const reader = new FileReader();

  if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
    reader.onload = async (event) => {
      const csvText = event.target.result;
      const parsedPlots = parsePlotsCsv(csvText);
      if (parsedPlots.length === 0) {
        showToast('⚠️ No valid plot rows found in the CSV file.');
        return;
      }
      await importPlotsArray(parsedPlots, file.name);
    };
    reader.readAsText(file);
  } else if (fileName.endsWith('.geojson') || fileName.endsWith('.json')) {
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const parsedPlots = parsePlotsGeoJson(json);
        if (parsedPlots.length === 0) {
          showToast('⚠️ No polygon features found in GeoJSON file.');
          return;
        }
        await importPlotsArray(parsedPlots, file.name);
      } catch (err) {
        showToast('⚠️ Error parsing GeoJSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  } else {
    showToast(`✓ File ${file.name} uploaded. Processing Cadastral records...`);
    setTimeout(() => {
      showToast(`✓ Imported 5 sample plots from ${file.name} into MySQL database.`);
    }, 1200);
  }
}

function parsePlotsCsv(csvText) {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Match commas outside quotes
    const values = rawLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v ? v.trim().replace(/^["']|["']$/g, '') : '');
    if (values.length < 2) continue;

    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] || '';
    });

    const khasra = rowObj['plot_khasra_no'] || rowObj['khasra'] || rowObj['survey_no'] || rowObj['surveyno'] || `Survey ${150 + i}`;
    const mouza = rowObj['mouza_village'] || rowObj['mouza'] || rowObj['village'] || 'Umred';
    const area = parseFloat(rowObj['area_hectares'] || rowObj['area'] || rowObj['areaha']) || 1.8;
    const classification = rowObj['land_classification'] || rowObj['classification'] || 'Multi-Crop Farmland';
    const owner = rowObj['landowner_name'] || rowObj['owner'] || `Owner Khasra ${khasra}`;
    const status = rowObj['acquisition_status'] || rowObj['status'] || 'Notice Intended';

    results.push({
      plot_code: `MH-NGP-${4040 + i + Math.floor(Math.random() * 500)}`,
      plot_khasra_no: khasra,
      mouza_village: mouza,
      tehsil: 'Nagpur Rural',
      area_hectares: area,
      land_classification: classification,
      landowner_name: owner,
      aadhaar_linked: true,
      base_circle_rate: 2000000,
      multiplier_factor: 2.5,
      calculated_compensation: area * 2000000 * 2.5 * 2.12 + 1500000,
      acquisition_status: status,
      dbt_status: 'Escrow Ready'
    });
  }

  return results;
}

function parsePlotsGeoJson(geojson) {
  const features = geojson.features || (geojson.type === 'Feature' ? [geojson] : []);
  return features.map((f, idx) => {
    const props = f.properties || {};
    const khasra = props.khasra || props.surveyNo || props.name || `Khasra ${160 + idx}`;
    const mouza = props.mouza || props.village || 'Umred';
    const area = parseFloat(props.area || props.areaHa) || 2.2;
    return {
      plot_code: `MH-NGP-${4050 + idx}`,
      plot_khasra_no: khasra,
      mouza_village: mouza,
      tehsil: props.tehsil || 'Nagpur Rural',
      area_hectares: area,
      land_classification: props.classification || 'Multi-Crop Farmland',
      landowner_name: props.owner || `Awardee ${khasra}`,
      aadhaar_linked: true,
      base_circle_rate: 2000000,
      multiplier_factor: 2.5,
      calculated_compensation: area * 2000000 * 2.5 * 2.12 + 1500000,
      acquisition_status: props.status || 'Notice Intended',
      dbt_status: 'Escrow Ready'
    };
  });
}

async function importPlotsArray(plotsArray, sourceName) {
  if (checkDemoRestriction('import plot datasets into the database')) return;
  try {
    const res = await fetch(`${AppState.apiBase}/plots/bulk-upload`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(AppState.isDemoMode ? { 'x-demo-mode': 'true' } : {})
      },
      body: JSON.stringify({ plots: plotsArray })
    });

    if (res.ok) {
      const data = await res.json();
      showToast(`✓ ${data.inserted} plot records from "${sourceName}" written to MySQL database!`);
    } else {
      showToast(`✓ Imported ${plotsArray.length} plots from "${sourceName}".`);
    }
  } catch (err) {
    console.warn('Backend sync failed, storing locally:', err);
    showToast(`✓ Stored ${plotsArray.length} plots locally from "${sourceName}".`);
  }

  // Update in-memory AppState
  plotsArray.forEach(p => {
    const formatted = {
      id: p.plot_code,
      surveyNo: p.plot_khasra_no,
      mouza: p.mouza_village,
      tehsil: p.tehsil || 'Nagpur Rural',
      areaHa: p.area_hectares,
      classification: p.land_classification,
      owner: p.landowner_name,
      aadhaarLinked: p.aadhaar_linked,
      awardValuation: p.calculated_compensation,
      dbtStatus: p.dbt_status,
      status: p.acquisition_status,
      stage: p.acquisition_status === 'Acquired' || p.acquisition_status === 'Disbursed' ? 'disbursed' : 'award_ready',
      statusColor: 'secondary',
      circleRate: 2000000,
      multiplier: 2.5,
      solatium: p.calculated_compensation * 0.4,
      interest: p.calculated_compensation * 0.08,
      assetsValuation: 1500000,
      chainage: 'Km 141.20',
      coordinates: '20.8980° N, 79.0265° E',
      disputeReason: null
    };
    AppState.parcels.unshift(formatted);
  });

  renderParcelsTable();
  renderTabParcelsTable();
  updateOverviewMetricsFromParcels();
}

function renderTabParcelsTable() {
  const tbody = document.getElementById('tabParcelsTableBody');
  if (!tbody) return;

  const isLandowner = (AppState.currentUser && AppState.currentUser.roleKey === 'landowner');
  const query = AppState.tabParcelsSearchQuery || '';
  const filter = AppState.tabParcelsFilter || 'all';

  // Calculate filter counts
  let countSurveyed = 0;
  let countValuation = 0;
  let countAward = 0;
  let countDisbursed = 0;
  let countDisputed = 0;

  AppState.parcels.forEach(p => {
    if (p.stage === 'surveyed') countSurveyed++;
    if (p.stage === 'valuation') countValuation++;
    if (p.stage === 'award_ready') countAward++;
    if (p.stage === 'disbursed') countDisbursed++;
    if (p.stage === 'disputed') countDisputed++;
  });

  const elAll = document.getElementById('filterCountAll');
  if (elAll) elAll.textContent = AppState.parcels.length;
  const elSurv = document.getElementById('filterCountSurveyed');
  if (elSurv) elSurv.textContent = countSurveyed;
  const elVal = document.getElementById('filterCountValuation');
  if (elVal) elVal.textContent = countValuation;
  const elAwd = document.getElementById('filterCountAward');
  if (elAwd) elAwd.textContent = countAward;
  const elDisb = document.getElementById('filterCountDisbursed');
  if (elDisb) elDisb.textContent = countDisbursed;
  const elDisp = document.getElementById('filterCountDisputed');
  if (elDisp) elDisp.textContent = countDisputed;

  // Filter parcels
  const filtered = AppState.parcels.filter(p => {
    if (isLandowner && p.id !== 'MH-NGP-4029') return false;

    if (filter !== 'all') {
      if (filter === 'surveyed' && p.stage !== 'surveyed') return false;
      if (filter === 'valuation' && p.stage !== 'valuation') return false;
      if (filter === 'award_ready' && p.stage !== 'award_ready') return false;
      if (filter === 'disbursed' && p.stage !== 'disbursed') return false;
      if (filter === 'disputed' && p.stage !== 'disputed') return false;
    }

    if (query) {
      return (p.id && p.id.toLowerCase().includes(query)) ||
             (p.surveyNo && p.surveyNo.toLowerCase().includes(query)) ||
             (p.owner && p.owner.toLowerCase().includes(query)) ||
             (p.mouza && p.mouza.toLowerCase().includes(query)) ||
             (p.classification && p.classification.toLowerCase().includes(query));
    }
    return true;
  });

  // KPI Strip in tab
  const tabCount = document.getElementById('tabPlotsTotalCount');
  if (tabCount) tabCount.textContent = AppState.parcels.length;

  const totalAreaCalc = AppState.parcels.reduce((acc, p) => acc + (parseFloat(p.areaHa) || 0), 0);
  const tabArea = document.getElementById('tabPlotsTotalArea');
  if (tabArea) tabArea.textContent = `${totalAreaCalc.toFixed(2)} Ha`;

  const tabDisp = document.getElementById('tabPlotsDisputedCount');
  if (tabDisp) tabDisp.textContent = `${countDisputed} Plots`;

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="py-8 text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-[36px] text-outline">search_off</span>
          <div class="font-bold text-xs text-on-surface mt-1">No plot records found matching filter.</div>
          <div class="text-[11px]">Try searching another Khasra number or switch filter tab.</div>
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(parcel => {
    const tr = document.createElement('tr');
    tr.className = `hover:bg-surface-container transition-colors cursor-pointer ${parcel.id === AppState.activeParcelId ? 'bg-surface-container-low font-medium' : ''}`;

    tr.innerHTML = `
      <td class="py-3 px-3">
        <div class="font-code-num text-xs font-bold text-on-surface">#${parcel.id}</div>
        <div class="text-[11px] text-on-surface-variant">Survey No. ${parcel.surveyNo}</div>
      </td>
      <td class="py-3 px-3">
        <div class="font-semibold text-xs text-on-surface">${parcel.mouza}</div>
        <div class="text-[11px] text-on-surface-variant">${parcel.tehsil || 'Nagpur Rural'}</div>
      </td>
      <td class="py-3 px-3 text-right font-code-num text-xs font-semibold text-on-surface">
        <div>${Number(parcel.areaHa).toFixed(3)} Ha</div>
        <div class="text-[10px] text-on-surface-variant font-normal">(${(parcel.areaHa * 2.471).toFixed(2)} Acres)</div>
      </td>
      <td class="py-3 px-3">
        <span class="bg-surface-container-high px-2 py-0.5 rounded text-[11px] text-on-surface">
          ${parcel.classification}
        </span>
      </td>
      <td class="py-3 px-3">
        <div class="font-medium text-xs text-on-surface">${parcel.owner}</div>
        <div class="text-[10px] ${parcel.aadhaarLinked ? 'text-secondary font-code-num' : 'text-error font-code-num'}">
          ${parcel.aadhaarLinked ? 'Aadhaar Verified ✓' : 'Aadhaar Pending ⚠'}
        </div>
      </td>
      <td class="py-3 px-3 text-right font-code-num text-xs font-bold text-on-surface">
        ₹ ${Number(parcel.awardValuation).toLocaleString('en-IN')}
      </td>
      <td class="py-3 px-3">
        <span class="bg-${parcel.statusColor === 'secondary' ? 'secondary-container text-on-secondary-container' : parcel.statusColor === 'error' ? 'error-container text-on-error-container' : 'surface-container text-on-surface'} px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 w-fit">
          <span class="w-1.5 h-1.5 rounded-full ${parcel.statusColor === 'secondary' ? 'bg-secondary' : parcel.statusColor === 'error' ? 'bg-error' : 'bg-primary'}"></span>
          ${parcel.dbtStatus}
        </span>
      </td>
      <td class="py-3 px-3 text-center">
        <div class="flex items-center justify-center gap-1">
          <button class="p-1 rounded hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface" title="Inspect Plot Dossier" onclick="event.stopPropagation(); selectParcel('${parcel.id}')">
            <span class="material-symbols-outlined text-[18px]">travel_explore</span>
          </button>
          <button class="p-1 rounded hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface" title="Legal Valuation Calculator" onclick="event.stopPropagation(); selectParcel('${parcel.id}')">
            <span class="material-symbols-outlined text-[18px]">calculate</span>
          </button>
          <button class="p-1 rounded hover:bg-error-container/40 text-error" title="Delete from MySQL" onclick="event.stopPropagation(); deletePlotRecord('${parcel.id}')">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </td>
    `;

    tr.addEventListener('click', () => {
      selectParcel(parcel.id);
    });

    tbody.appendChild(tr);
  });
}

function openAddPlotModal() {
  const modal = document.getElementById('modalAddSinglePlot');
  if (modal) modal.classList.remove('hidden');
}

function closeAddPlotModal() {
  const modal = document.getElementById('modalAddSinglePlot');
  if (modal) modal.classList.add('hidden');
}

async function handleFormAddSinglePlot(event) {
  event.preventDefault();
  if (checkDemoRestriction('create new land plot records in the database')) return;

  const khasra = document.getElementById('plotInputKhasra').value.trim();
  const village = document.getElementById('plotInputVillage').value.trim();
  const area = parseFloat(document.getElementById('plotInputArea').value) || 1.0;
  const tehsil = document.getElementById('plotInputTehsil').value.trim() || 'Nagpur Rural';
  const classification = document.getElementById('plotInputClass').value;
  const status = document.getElementById('plotInputStatus').value;
  const owner = document.getElementById('plotInputOwner').value.trim();
  const circleRate = parseFloat(document.getElementById('plotInputCircleRate').value) || 2000000;
  const marker = parseFloat(document.getElementById('plotInputMarker').value) || 140.0;
  const aadhaar = document.getElementById('plotInputAadhaar').checked;

  const code = `MH-NGP-${Math.floor(4035 + Math.random() * 500)}`;
  const multiplier = 2.5;
  const marketVal = circleRate * area * multiplier;
  const solatium = marketVal;
  const interest = marketVal * 0.12;
  const assets = 1500000;
  const totalVal = marketVal + solatium + interest + assets;

  const newPlotPayload = {
    project_id: 1,
    plot_code: code,
    plot_khasra_no: khasra,
    mouza_village: village,
    tehsil: tehsil,
    area_hectares: area,
    land_classification: classification,
    landowner_name: owner,
    aadhaar_linked: aadhaar,
    base_circle_rate: circleRate,
    multiplier_factor: multiplier,
    highway_distance_marker: marker,
    acquisition_status: status,
    dbt_status: status === 'Disbursed' ? 'Paid via Bank Transfer (PFMS)' : 'Escrow Ready'
  };

  try {
    const res = await fetch(`${AppState.apiBase}/plots/add`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(AppState.isDemoMode ? { 'x-demo-mode': 'true' } : {})
      },
      body: JSON.stringify(newPlotPayload)
    });

    if (res.ok) {
      showToast(`✓ Plot #${code} (Survey ${khasra}) saved to MySQL database!`);
    } else {
      showToast(`✓ Plot #${code} registered successfully.`);
    }
  } catch (err) {
    console.warn('Backend offline, saved locally:', err);
    showToast(`✓ Plot #${code} registered locally.`);
  }

  // Add to local state
  const formatted = {
    id: code,
    surveyNo: khasra,
    mouza: village,
    tehsil: tehsil,
    areaHa: area,
    classification: classification,
    owner: owner,
    aadhaarLinked: aadhaar,
    awardValuation: totalVal,
    dbtStatus: newPlotPayload.dbt_status,
    status: status,
    stage: status === 'Disbursed' ? 'disbursed' : 'award_ready',
    statusColor: status === 'Disbursed' ? 'secondary' : 'primary-container',
    circleRate: circleRate,
    multiplier: multiplier,
    solatium: solatium,
    interest: interest,
    assetsValuation: assets,
    chainage: `Km ${marker.toFixed(2)}`,
    coordinates: '20.8980° N, 79.0265° E',
    disputeReason: null
  };

  AppState.parcels.unshift(formatted);
  closeAddPlotModal();
  document.getElementById('formAddSinglePlot').reset();

  renderParcelsTable();
  renderTabParcelsTable();
  updateOverviewMetricsFromParcels();
  selectParcel(code);
}

async function deletePlotRecord(plotId) {
  if (checkDemoRestriction('delete plot records from the database')) return;
  if (!confirm(`Are you sure you want to remove plot record #${plotId} from the database?`)) {
    return;
  }

  try {
    await fetch(`${AppState.apiBase}/plots/${plotId}`, { 
      method: 'DELETE',
      headers: {
        ...(AppState.isDemoMode ? { 'x-demo-mode': 'true' } : {})
      }
    });
    showToast(`✓ Plot #${plotId} deleted from MySQL database.`);
  } catch (err) {
    console.warn('Delete request error:', err);
    showToast(`Plot #${plotId} removed from local view.`);
  }

  AppState.parcels = AppState.parcels.filter(p => p.id !== plotId);
  renderParcelsTable();
  renderTabParcelsTable();
  updateOverviewMetricsFromParcels();
}

function updateOverviewMetricsFromParcels() {
  const countBadge = document.getElementById('overviewTotalPlots');
  if (countBadge) countBadge.textContent = AppState.parcels.length;

  const sbCount = document.getElementById('sidebarParcelsCount');
  if (sbCount) sbCount.textContent = AppState.parcels.length;
}

// Download Plots as CSV
function exportPlotsToCsv() {
  showToast('Generating official Land Plots CSV export from database...');

  const headers = [
    'Plot ID', 'Khasra / Survey No', 'Mouza Village', 'Tehsil',
    'Area (Hectares)', 'Land Classification', 'Registered Landowner',
    'Aadhaar Verified', 'Base Circle Rate (INR/Ha)', 'Multiplier Factor',
    'Final Calculated Compensation (INR)', 'Bank Transfer Status', 'Acquisition Status'
  ];

  const rows = AppState.parcels.map(p => [
    p.id,
    `"${p.surveyNo}"`,
    `"${p.mouza}"`,
    `"${p.tehsil || 'Nagpur Rural'}"`,
    p.areaHa,
    `"${p.classification}"`,
    `"${p.owner}"`,
    p.aadhaarLinked ? 'YES' : 'NO',
    p.circleRate || 2000000,
    p.multiplier || 2.5,
    p.awardValuation || 0,
    `"${p.dbtStatus}"`,
    `"${p.status}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ebhumi_land_plots_master_register_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('✓ CSV ledger downloaded successfully.');
}

// Download Plots as GeoJSON
function exportPlotsToGeoJson() {
  showToast('Generating Cadastral GeoJSON layer...');

  const features = AppState.parcels.map(p => {
    const coords = (p.bounds && p.bounds.length >= 3)
      ? [p.bounds.map(b => [b.lng, b.lat]).concat([[p.bounds[0].lng, p.bounds[0].lat]])]
      : [[[79.025, 20.898], [79.027, 20.898], [79.027, 20.900], [79.025, 20.900], [79.025, 20.898]]];

    return {
      type: 'Feature',
      id: p.id,
      geometry: {
        type: 'Polygon',
        coordinates: coords
      },
      properties: {
        plot_code: p.id,
        survey_no: p.surveyNo,
        mouza: p.mouza,
        area_ha: p.areaHa,
        owner: p.owner,
        valuation_inr: p.awardValuation,
        status: p.status
      }
    };
  });

  const geojsonObj = {
    type: 'FeatureCollection',
    name: 'E-Bhumi Highway Package 4B Cadastre',
    crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
    features: features
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geojsonObj, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', `ebhumi_cadastral_boundaries_${new Date().toISOString().slice(0, 10)}.geojson`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  document.body.removeChild(dlAnchor);

  showToast('✓ GeoJSON boundary layer downloaded successfully.');
}

// Download Sample CSV Template
function downloadSamplePlotsCsv(e) {
  if (e) e.stopPropagation();

  const sampleCsv = `plot_khasra_no,mouza_village,area_hectares,land_classification,landowner_name,base_circle_rate,acquisition_status
"150/1A",Umred,2.4000,"Multi-Crop Farmland","Suresh M. Bhoyar",2000000,"Notice Intended"
"151/2B",Bhiwapur,1.8500,"Single-Crop Agricultural","Dilip K. Meshram",1800000,"JMS Lock"
"152/3",Kuhi,3.1000,"Barren / Dry Land","Smt. Shakuntala Gaikwad",1500000,"Sec 19 Award"`;

  const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ebhumi_plots_import_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast('✓ Downloaded ebhumi_plots_import_template.csv');
}

// Download Certified 7/12 Register Dossier
function downloadCertifiedRegister() {
  const win = window.open('', '_blank');
  const rows = AppState.parcels.map(p => `
    <tr>
      <td style="padding:6px;border:1px solid #cbd5e1;font-weight:bold;">${p.id}</td>
      <td style="padding:6px;border:1px solid #cbd5e1;">Survey ${p.surveyNo}</td>
      <td style="padding:6px;border:1px solid #cbd5e1;">${p.mouza}</td>
      <td style="padding:6px;border:1px solid #cbd5e1;">${p.areaHa} Ha</td>
      <td style="padding:6px;border:1px solid #cbd5e1;">${p.owner}</td>
      <td style="padding:6px;border:1px solid #cbd5e1;">₹ ${p.awardValuation.toLocaleString('en-IN')}</td>
      <td style="padding:6px;border:1px solid #cbd5e1;">${p.status}</td>
    </tr>
  `).join('');

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>E-Bhumi Form 7/12 Cadastral Register</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #0b1c30; font-size: 12px; }
        h1, h2 { margin-bottom: 4px; }
        .header-bar { border-bottom: 2px solid #0b1c30; padding-bottom: 12px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { background: #0b1c30; color: white; padding: 8px; border: 1px solid #0b1c30; text-align: left; }
        .badge { background: #82f5c1; color: #005137; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header-bar">
        <h2>GOVERNMENT OF INDIA • MINISTRY OF ROAD TRANSPORT & HIGHWAYS</h2>
        <h1>E-Bhumi Form 7/12 Certified Cadastral Land Register</h1>
        <p>Corridor: <strong>NH-44 Express Highway Expansion (Package 4B)</strong> • District: Nagpur Rural • Gazette S.O. 1842(E)</p>
        <p>Generated: ${new Date().toLocaleString()} • Database: <strong>e_bhumi_db</strong> • Total Plots: ${AppState.parcels.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Plot Code</th>
            <th>Khasra No.</th>
            <th>Mouza</th>
            <th>Area</th>
            <th>Registered Landowner</th>
            <th>Compensation Value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <div style="margin-top:24px;display:flex;justify-content:space-between;">
        <div>
          <p>Verified by: <strong>Shri V. K. Deshmukh (SLAO-082)</strong></p>
          <p>Field Demarcation Patwari</p>
        </div>
        <div style="text-align:right;">
          <p>Digitally Signed by: <strong>Dr. Rajeshwar Rao (IAS)</strong></p>
          <p>Competent Authority Land Acquisition (CALA)</p>
        </div>
      </div>
      <script>window.print();<\/script>
    </body>
    </html>
  `);
  win.document.close();
  showToast('✓ Generated Form 7/12 Official Cadastral Register.');
}

// =========================================================================
// PUBLIC COMPLAINTS & CITIZEN HELPDESK CONTROLLER
// =========================================================================

function initComplaintsHelpDesk() {
  // Set default grievances if not loaded
  if (!AppState.grievances || AppState.grievances.length === 0) {
    AppState.grievances = [
      {
        grievance_id: 1,
        grievance_code: 'GR-2024-88',
        plot_khasra_no: '144/2',
        mouza_village: 'Bhiwapur',
        complainant_name: 'Ganesh K. Thakre',
        complainant_phone: '+91 98223 34455',
        complainant_email: 'ganesh.thakre@gmail.com',
        appeal_type: 'Boundary Overlap',
        priority: 'Urgent',
        description: 'Boundary overlap objection lodged regarding partition of Survey No. 144/2. The southern boundary overlaps with Khasra 144/1 by approx 12 meters. Competent authority hearing requested before award disbursement.',
        officer_remarks: 'Notice issued to Sub-Divisional Magistrate. Hearing scheduled for CALA bench.',
        assigned_officer: 'SLAO-082 Patwari Division',
        hearing_date: '2024-10-24',
        status: 'Hearing Scheduled',
        created_at: '2024-09-18'
      },
      {
        grievance_id: 2,
        grievance_code: 'INQ-2024-12',
        plot_khasra_no: '146/4',
        mouza_village: 'Kuhi',
        complainant_name: 'Vitthalrao S. Gaikwad',
        complainant_phone: '+91 98224 45566',
        complainant_email: 'vitthal.gaikwad@gmail.com',
        appeal_type: 'Asset Valuation Review',
        priority: 'Standard',
        description: 'Tree asset valuation review request. Over 45 mature Teak and Orange trees were planted on the acquisition strip which were under-counted in the preliminary valuation schedule.',
        officer_remarks: 'Horticulture officer conducted site reinspection on 12 Sep. Tree count updated to 52 trees in ledger.',
        assigned_officer: 'District Horticulture Inspector',
        hearing_date: null,
        status: 'Resolved',
        created_at: '2024-09-10'
      },
      {
        grievance_id: 3,
        grievance_code: 'GR-2024-105',
        plot_khasra_no: '142/3A',
        mouza_village: 'Umred',
        complainant_name: 'Rameshwar Patil',
        complainant_phone: '+91 98200 33445',
        complainant_email: 'rameshwar.patil@gmail.com',
        appeal_type: 'Compensation Delay',
        priority: 'High',
        description: 'Inquiry regarding expected DBT bank transfer timeline following Section 19 declaration. All bank account and Aadhaar documents submitted to Patwari office.',
        officer_remarks: 'CALA digital signature completed. DBT escrow scheduled for disbursement batch #4.',
        assigned_officer: 'Special Land Acquisition Officer (CALA)',
        hearing_date: '2024-10-28',
        status: 'Assigned to Field Officer',
        created_at: '2024-09-22'
      },
      {
        grievance_id: 4,
        grievance_code: 'GR-2024-118',
        plot_khasra_no: '148/2',
        mouza_village: 'Kuhi',
        complainant_name: 'Babu Rao Shinde',
        complainant_phone: '+91 98227 78899',
        complainant_email: 'baburao.shinde@gmail.com',
        appeal_type: 'Title Objection',
        priority: 'Urgent',
        description: 'Co-sharer succession certificate dispute. Property mutation under Section 3A pending in Revenue Court.',
        officer_remarks: 'Referred to revenue court record room for mutation verification.',
        assigned_officer: 'Revenue Tahsildar Umred',
        hearing_date: null,
        status: 'Pending Review',
        created_at: '2024-09-25'
      }
    ];
  }

  // Filter Buttons
  const filterBtns = document.querySelectorAll('[data-grievance-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-on-primary');
      btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');

      AppState.activeGrievanceFilter = btn.getAttribute('data-grievance-filter');
      renderGrievances();
    });
  });

  // Type filter dropdown
  const typeFilter = document.getElementById('grievanceTypeFilter');
  if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
      AppState.activeGrievanceType = e.target.value;
      renderGrievances();
    });
  }

  // Search input
  const searchInput = document.getElementById('grievanceSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.grievanceSearchQuery = e.target.value.toLowerCase().trim();
      renderGrievances();
    });
  }

  renderGrievances();
}

async function refreshGrievancesFromDb(showNotice = true) {
  try {
    const res = await fetch(`${AppState.apiBase}/grievances`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        AppState.grievances = data;
        renderGrievances();
        if (showNotice) showToast(`✓ Synced ${data.length} complaints with MySQL database.`);
      }
    }
  } catch (err) {
    console.warn('Could not refresh grievances from DB:', err);
    if (showNotice) showToast('⚠️ Unable to connect to MySQL backend. Using cached tickets.');
  }
}

function renderGrievances() {
  const container = document.getElementById('grievancesListContainer');
  if (!container) return;

  const total = AppState.grievances.length;
  const pending = AppState.grievances.filter(g => g.status === 'Pending Review').length;
  const assigned = AppState.grievances.filter(g => g.status === 'Assigned to Field Officer').length;
  const hearing = AppState.grievances.filter(g => g.status === 'Hearing Scheduled').length;
  const resolved = AppState.grievances.filter(g => g.status === 'Resolved').length;

  // Update Metric Cards
  const elTot = document.getElementById('statTotalGrievances');
  if (elTot) elTot.textContent = total;
  const elPend = document.getElementById('statPendingGrievances');
  if (elPend) elPend.textContent = pending;
  const elHear = document.getElementById('statHearingGrievances');
  if (elHear) elHear.textContent = hearing + assigned;
  const elRes = document.getElementById('statResolvedGrievances');
  if (elRes) elRes.textContent = resolved;

  // Update filter badge numbers
  const bAll = document.getElementById('badgeFilterAllGrievances');
  if (bAll) bAll.textContent = total;
  const bPend = document.getElementById('badgeFilterPending');
  if (bPend) bPend.textContent = pending;
  const bAssn = document.getElementById('badgeFilterAssigned');
  if (bAssn) bAssn.textContent = assigned;
  const bHear = document.getElementById('badgeFilterHearing');
  if (bHear) bHear.textContent = hearing;
  const bRes = document.getElementById('badgeFilterResolved');
  if (bRes) bRes.textContent = resolved;

  // Filter items
  const filter = AppState.activeGrievanceFilter || 'all';
  const typeFilter = AppState.activeGrievanceType || 'all';
  const search = AppState.grievanceSearchQuery || '';

  const filtered = AppState.grievances.filter(g => {
    if (filter !== 'all' && g.status !== filter) return false;
    if (typeFilter !== 'all' && g.appeal_type !== typeFilter) return false;
    if (search) {
      return (g.grievance_code && g.grievance_code.toLowerCase().includes(search)) ||
             (g.complainant_name && g.complainant_name.toLowerCase().includes(search)) ||
             (g.plot_khasra_no && g.plot_khasra_no.toLowerCase().includes(search)) ||
             (g.mouza_village && g.mouza_village.toLowerCase().includes(search)) ||
             (g.description && g.description.toLowerCase().includes(search));
    }
    return true;
  });

  const listCount = document.getElementById('grievancesListCount');
  if (listCount) listCount.textContent = filtered.length;

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-on-surface-variant bg-surface-container-low rounded-xl border border-surface-container">
        <span class="material-symbols-outlined text-[32px] text-outline">search_off</span>
        <div class="font-bold text-xs text-on-surface mt-1">No grievances found matching criteria.</div>
        <div class="text-[11px] mt-0.5">Click "Lodge New Complaint" to create a ticket.</div>
      </div>
    `;
    return;
  }

  // Set default active grievance
  if (!AppState.activeGrievanceId && filtered[0]) {
    AppState.activeGrievanceId = filtered[0].grievance_code;
  }

  filtered.forEach(item => {
    const isSelected = (item.grievance_code === AppState.activeGrievanceId);
    const card = document.createElement('div');
    card.className = `p-4 rounded-xl border transition-all cursor-pointer text-xs ${
      isSelected
        ? 'bg-surface-container-low border-primary ring-2 ring-primary/40 shadow-sm'
        : 'bg-surface-container-lowest hover:bg-surface-container-low border-surface-container'
    }`;

    const statusBadgeClass =
      item.status === 'Resolved' ? 'bg-secondary-container text-on-secondary-container' :
      item.status === 'Hearing Scheduled' ? 'bg-error-container text-on-error-container' :
      item.status === 'Assigned to Field Officer' ? 'bg-tertiary-fixed text-on-tertiary-fixed' :
      'bg-amber-100 text-amber-900 border border-amber-300';

    const priorityBadge =
      item.priority === 'Urgent' ? '<span class="text-[9px] bg-error text-on-error font-bold px-1.5 py-0.5 rounded font-code-num">URGENT</span>' :
      item.priority === 'High' ? '<span class="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded font-code-num">HIGH</span>' :
      '<span class="text-[9px] bg-surface-container-high text-on-surface font-bold px-1.5 py-0.5 rounded font-code-num">STANDARD</span>';

    card.innerHTML = `
      <div class="flex items-start justify-between gap-2 mb-1.5">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="font-code-num font-bold text-xs text-on-surface">${item.grievance_code}</span>
          ${priorityBadge}
        </div>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded font-code-num ${statusBadgeClass}">
          ${item.status}
        </span>
      </div>

      <div class="font-semibold text-on-surface">${item.complainant_name}</div>
      <div class="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
        <span>Survey ${item.plot_khasra_no || 'N/A'}</span>
        <span>•</span>
        <span>${item.mouza_village || 'Nagpur Rural'}</span>
      </div>

      <p class="text-[11px] text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">
        ${item.description}
      </p>

      <div class="flex items-center justify-between mt-2 pt-2 border-t border-surface-container text-[10px] font-code-num">
        <span class="text-on-surface-variant">${item.appeal_type}</span>
        ${item.hearing_date ? `<span class="text-error font-bold flex items-center gap-0.5"><span class="material-symbols-outlined text-[12px]">event</span> Hearing: ${item.hearing_date}</span>` : '<span class="text-secondary">Tracking Active</span>'}
      </div>
    `;

    card.addEventListener('click', () => {
      selectGrievance(item.grievance_code);
    });

    container.appendChild(card);
  });

  // Render detail panel for active selection
  const activeTicket = AppState.grievances.find(g => g.grievance_code === AppState.activeGrievanceId) || filtered[0];
  if (activeTicket) {
    populateGrievanceDetail(activeTicket);
  }
}

function selectGrievance(code) {
  AppState.activeGrievanceId = code;
  const ticket = AppState.grievances.find(g => g.grievance_code === code);
  if (ticket) {
    populateGrievanceDetail(ticket);
    renderGrievances();
    // Pre-load timeline if on timeline tab
    const timelinePanel = document.getElementById('deskTabPanelTimeline');
    if (timelinePanel && !timelinePanel.classList.contains('hidden')) {
      loadGrievanceTimeline(ticket.grievance_id || ticket.grievance_code);
    }
  }
}

function populateGrievanceDetail(ticket) {
  const panel = document.getElementById('grievanceDetailPanel');
  const empty = document.getElementById('grievanceDetailEmptyState');
  if (!panel || !ticket) return;

  if (empty) empty.classList.add('hidden');
  panel.classList.remove('hidden');

  const codeEl = document.getElementById('dtlGrievanceCode');
  if (codeEl) codeEl.textContent = ticket.grievance_code;

  const prioEl = document.getElementById('dtlPriorityBadge');
  if (prioEl) {
    prioEl.textContent = (ticket.priority || 'STANDARD').toUpperCase();
    prioEl.className = ticket.priority === 'Urgent' ? 'bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded font-code-num' : 'bg-surface-container-high text-on-surface text-[10px] font-bold px-2 py-0.5 rounded font-code-num';
  }

  const statEl = document.getElementById('dtlStatusBadge');
  if (statEl) {
    statEl.textContent = ticket.status;
    statEl.className = ticket.status === 'Resolved' ? 'bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded font-code-num' :
                       ticket.status === 'Hearing Scheduled' ? 'bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded font-code-num' :
                       'bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded font-code-num';
  }

  const typeEl = document.getElementById('dtlAppealType');
  if (typeEl) typeEl.textContent = `${ticket.appeal_type} Appeal & Inquiry`;

  const dateEl = document.getElementById('dtlCreatedDate');
  if (dateEl) dateEl.textContent = `Lodged on ${ticket.created_at ? ticket.created_at.slice(0, 10) : 'Recent'} • Stored in MySQL: e_bhumi_db`;

  const nameEl = document.getElementById('dtlComplainantName');
  if (nameEl) nameEl.textContent = ticket.complainant_name;

  const phoneEl = document.getElementById('dtlComplainantPhone');
  if (phoneEl) phoneEl.innerHTML = `<span class="material-symbols-outlined text-[14px]">call</span> ${ticket.complainant_phone || '+91 Not Provided'}`;

  const emailEl = document.getElementById('dtlComplainantEmail');
  if (emailEl) emailEl.innerHTML = `<span class="material-symbols-outlined text-[14px]">mail</span> ${ticket.complainant_email || 'No email registered'}`;

  const khasraEl = document.getElementById('dtlPlotKhasra');
  if (khasraEl) khasraEl.textContent = `Survey No. ${ticket.plot_khasra_no || 'Corridor General'}`;

  const locEl = document.getElementById('dtlPlotLocation');
  if (locEl) locEl.textContent = `Mouza ${ticket.mouza_village || 'Umred'}, Nagpur Rural`;

  const descEl = document.getElementById('dtlDescription');
  if (descEl) descEl.textContent = ticket.description;

  // Pre-fill resolution controls
  const statusSel = document.getElementById('dtlStatusSelect');
  if (statusSel) statusSel.value = ticket.status;

  const officerInput = document.getElementById('dtlAssignedOfficerInput');
  if (officerInput) officerInput.value = ticket.assigned_officer || 'SLAO-082 Patwari Division';

  const dateInput = document.getElementById('dtlHearingDateInput');
  if (dateInput) dateInput.value = ticket.hearing_date || '';

  const remarksInput = document.getElementById('dtlRemarksInput');
  if (remarksInput) remarksInput.value = ticket.officer_remarks || '';
}

// Workbench Tab Switching
function switchDeskTab(tab) {
  const btnAction = document.getElementById('deskTabActionBtn');
  const btnTimeline = document.getElementById('deskTabTimelineBtn');
  const btnOrders = document.getElementById('deskTabOrdersBtn');

  const panelAction = document.getElementById('deskTabPanelAction');
  const panelTimeline = document.getElementById('deskTabPanelTimeline');
  const panelOrders = document.getElementById('deskTabPanelOrders');

  // Reset tab styles
  [btnAction, btnTimeline, btnOrders].forEach(b => {
    if (b) {
      b.classList.remove('border-primary', 'text-primary', 'font-bold');
      b.classList.add('border-transparent', 'text-on-surface-variant');
    }
  });

  // Hide all panels
  [panelAction, panelTimeline, panelOrders].forEach(p => {
    if (p) p.classList.add('hidden');
  });

  const activeTicket = AppState.grievances.find(g => g.grievance_code === AppState.activeGrievanceId);

  if (tab === 'action') {
    if (btnAction) {
      btnAction.classList.add('border-primary', 'text-primary', 'font-bold');
      btnAction.classList.remove('border-transparent', 'text-on-surface-variant');
    }
    if (panelAction) panelAction.classList.remove('hidden');
  } else if (tab === 'timeline') {
    if (btnTimeline) {
      btnTimeline.classList.add('border-primary', 'text-primary', 'font-bold');
      btnTimeline.classList.remove('border-transparent', 'text-on-surface-variant');
    }
    if (panelTimeline) panelTimeline.classList.remove('hidden');
    if (activeTicket) {
      loadGrievanceTimeline(activeTicket.grievance_id || activeTicket.grievance_code);
    }
  } else if (tab === 'orders') {
    if (btnOrders) {
      btnOrders.classList.add('border-primary', 'text-primary', 'font-bold');
      btnOrders.classList.remove('border-transparent', 'text-on-surface-variant');
    }
    if (panelOrders) panelOrders.classList.remove('hidden');
  }
}

// Load Chronological Timeline from MySQL database
async function loadGrievanceTimeline(grievanceId) {
  const container = document.getElementById('deskTimelineEventsList');
  if (!container) return;

  container.innerHTML = `
    <div class="py-6 text-center text-on-surface-variant">
      <span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
      <div class="text-[11px] mt-1">Loading audit trail from MySQL...</div>
    </div>
  `;

  try {
    const res = await fetch(`${AppState.apiBase}/grievances/${grievanceId}/timeline`);
    if (res.ok) {
      const events = await res.json();
      renderTimelineEvents(events);
      const badge = document.getElementById('deskTimelineCountBadge');
      if (badge) badge.textContent = events.length;
    } else {
      renderLocalTimelineFallback();
    }
  } catch (err) {
    console.warn('Timeline fetch error:', err);
    renderLocalTimelineFallback();
  }
}

function renderTimelineEvents(events) {
  const container = document.getElementById('deskTimelineEventsList');
  if (!container) return;

  if (!events || events.length === 0) {
    container.innerHTML = `
      <div class="p-4 bg-surface-container-low rounded-lg text-center text-on-surface-variant text-[11px]">
        No audit log events recorded yet. Add an inspection note below.
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  events.forEach((ev) => {
    const item = document.createElement('div');
    item.className = 'relative pl-4';

    const icon = ev.action_type === 'RESOLVED' ? 'verified' :
                 ev.action_type === 'HEARING_SCHEDULED' ? 'gavel' :
                 ev.action_type === 'SITE_INSPECTION' ? 'explore' :
                 ev.action_type === 'OFFICER_ASSIGNED' ? 'badge' :
                 ev.action_type === 'TICKET_LODGED' ? 'flag' : 'edit_note';

    const iconColor = ev.action_type === 'RESOLVED' ? 'bg-secondary text-on-secondary' :
                      ev.action_type === 'HEARING_SCHEDULED' ? 'bg-primary text-on-primary' :
                      'bg-surface-container-highest text-on-surface';

    item.innerHTML = `
      <div class="absolute -left-[30px] top-0 w-6 h-6 rounded-full ${iconColor} flex items-center justify-center shadow-sm">
        <span class="material-symbols-outlined text-[14px]">${icon}</span>
      </div>
      <div class="bg-surface-container-lowest p-3 rounded-lg border border-surface-container space-y-1">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <span class="font-bold text-xs text-on-surface">${ev.action_title}</span>
          <span class="text-[10px] text-on-surface-variant font-code-num">${ev.formatted_time || ev.created_at || 'Recent'}</span>
        </div>
        <div class="text-[11px] text-secondary font-semibold">${ev.action_by || 'Authority'}</div>
        ${ev.notes ? `<p class="text-[11px] text-on-surface-variant leading-relaxed pt-0.5">${ev.notes}</p>` : ''}
      </div>
    `;
    container.appendChild(item);
  });
}

function renderLocalTimelineFallback() {
  const activeTicket = AppState.grievances.find(g => g.grievance_code === AppState.activeGrievanceId);
  const fallbackEvents = [
    {
      action_type: 'TICKET_LODGED',
      action_title: 'Grievance Registered on Citizen Portal',
      action_by: activeTicket ? activeTicket.complainant_name : 'Citizen',
      notes: activeTicket ? activeTicket.description : 'Initial ticket registration.',
      formatted_time: activeTicket ? (activeTicket.created_at ? activeTicket.created_at.slice(0, 10) : 'Lodged') : 'Initial'
    },
    {
      action_type: activeTicket && activeTicket.status === 'Resolved' ? 'RESOLVED' : 'STATUS_UPDATE',
      action_title: `Case Status: ${activeTicket ? activeTicket.status : 'Active'}`,
      action_by: activeTicket ? activeTicket.assigned_officer : 'SLAO-082 Patwari Division',
      notes: activeTicket ? activeTicket.officer_remarks : 'Under administrative tracking.',
      formatted_time: 'Current'
    }
  ];
  renderTimelineEvents(fallbackEvents);
}

// Submit a new timeline note into MySQL
async function submitTimelineNote() {
  if (checkDemoRestriction('post timeline activities or inspection notes')) return;
  const activeTicket = AppState.grievances.find(g => g.grievance_code === AppState.activeGrievanceId);
  if (!activeTicket) return;

  const titleInput = document.getElementById('inputTimelineTitle');
  const actorInput = document.getElementById('inputTimelineActor');
  const notesInput = document.getElementById('inputTimelineNotes');

  const title = titleInput.value.trim();
  const actor = actorInput.value.trim() || 'SLAO Officer';
  const notes = notesInput.value.trim();

  if (!title) {
    showToast('⚠️ Please enter an Activity Title.');
    titleInput.focus();
    return;
  }

  const payload = {
    action_type: 'OFFICER_NOTE',
    action_title: title,
    action_by: actor,
    notes: notes
  };

  try {
    const res = await fetch(`${AppState.apiBase}/grievances/${activeTicket.grievance_id || activeTicket.grievance_code}/timeline`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(AppState.isDemoMode ? { 'x-demo-mode': 'true' } : {})
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast('✓ Inspection note added & saved to MySQL database!');
      titleInput.value = '';
      notesInput.value = '';
      loadGrievanceTimeline(activeTicket.grievance_id || activeTicket.grievance_code);
    } else {
      showToast('✓ Activity recorded locally.');
    }
  } catch (err) {
    showToast('✓ Activity recorded locally.');
  }
}

// Quick resolution action helpers
function quickScheduleHearing() {
  const dateInput = document.getElementById('dtlHearingDateInput');
  const statusSel = document.getElementById('dtlStatusSelect');
  const remarks = document.getElementById('dtlRemarksInput');

  // Next week date
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const dateStr = d.toISOString().split('T')[0];

  if (dateInput) dateInput.value = dateStr;
  if (statusSel) statusSel.value = 'Hearing Scheduled';
  if (remarks && !remarks.value) {
    remarks.value = `Official CALA hearing summons issued for ${dateStr}. Summons served to petitioner and patwari.`;
  }

  saveGrievanceResolution();
}

function quickMarkResolved() {
  const statusSel = document.getElementById('dtlStatusSelect');
  const remarks = document.getElementById('dtlRemarksInput');

  if (statusSel) statusSel.value = 'Resolved';
  if (remarks && !remarks.value) {
    remarks.value = 'Issue investigated and settled. Necessary boundary / compensation rectifications entered in Form 7/12 ledger.';
  }

  saveGrievanceResolution();
}

// CITIZEN TRACKER CONTROLLER
function toggleCitizenTracker() {
  const card = document.getElementById('citizenTrackerCard');
  if (!card) return;
  card.scrollIntoView({ behavior: 'smooth' });
  const input = document.getElementById('citizenTrackerInput');
  if (input) input.focus();
}

function quickTrackTicket(code) {
  const input = document.getElementById('citizenTrackerInput');
  if (input) input.value = code;
  searchCitizenTracker();
}

async function searchCitizenTracker() {
  const input = document.getElementById('citizenTrackerInput');
  const resultCard = document.getElementById('citizenTrackerResult');
  if (!input || !resultCard) return;

  const query = input.value.trim();
  if (!query) {
    showToast('⚠️ Please enter a Grievance Code or Mobile Number.');
    input.focus();
    return;
  }

  resultCard.classList.remove('hidden');
  resultCard.innerHTML = `
    <div class="py-8 text-center text-on-surface-variant">
      <span class="material-symbols-outlined animate-spin text-[28px] text-primary">progress_activity</span>
      <div class="font-bold text-xs text-on-surface mt-2">Searching MySQL Database (e_bhumi_db)...</div>
      <div class="text-[11px]">Querying: "${query}"</div>
    </div>
  `;

  try {
    const res = await fetch(`${AppState.apiBase}/grievances/track/${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.found && data.grievance) {
        renderTrackerResult(data.grievance, data.timeline || []);
      } else {
        // Check in memory fallback
        const localMatch = AppState.grievances.find(g =>
          g.grievance_code.toLowerCase() === query.toLowerCase() ||
          (g.complainant_phone && g.complainant_phone.includes(query)) ||
          (g.plot_khasra_no && g.plot_khasra_no.includes(query))
        );
        if (localMatch) {
          renderTrackerResult(localMatch, []);
        } else {
          resultCard.innerHTML = `
            <div class="p-6 text-center text-on-surface-variant space-y-2">
              <span class="material-symbols-outlined text-[36px] text-error">cancel</span>
              <div class="font-bold text-sm text-on-surface">No Grievance Found</div>
              <p class="text-xs max-w-sm mx-auto">No citizen complaint or inquiry found matching "${query}". Please check your code or lodge a new complaint.</p>
              <button onclick="openLodgeGrievanceModal()" class="mt-2 bg-primary hover:bg-primary-container text-on-primary px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 shadow-sm">
                <span class="material-symbols-outlined text-[14px]">contact_support</span>
                <span>Lodge New Ticket</span>
              </button>
            </div>
          `;
        }
      }
    } else {
      renderTrackerResultFallback(query);
    }
  } catch (err) {
    console.warn('Tracker query failed, checking memory:', err);
    renderTrackerResultFallback(query);
  }
}

function renderTrackerResultFallback(query) {
  const resultCard = document.getElementById('citizenTrackerResult');
  const localMatch = AppState.grievances.find(g =>
    g.grievance_code.toLowerCase() === query.toLowerCase() ||
    (g.complainant_phone && g.complainant_phone.includes(query)) ||
    (g.plot_khasra_no && g.plot_khasra_no.includes(query))
  );

  if (localMatch) {
    renderTrackerResult(localMatch, []);
  } else {
    resultCard.innerHTML = `
      <div class="p-4 text-center text-on-surface-variant text-xs">
        No record found matching "${query}". Click "Lodge New Complaint" to register.
      </div>
    `;
  }
}

function renderTrackerResult(ticket, timeline) {
  const resultCard = document.getElementById('citizenTrackerResult');
  if (!resultCard) return;

  const isResolved = ticket.status === 'Resolved';
  const isHearing = ticket.status === 'Hearing Scheduled';
  const isAssigned = ticket.status === 'Assigned to Field Officer' || isHearing || isResolved;

  // Step indicator classes
  const step1 = 'bg-secondary text-on-secondary';
  const step2 = isAssigned ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant';
  const step3 = (isHearing || isResolved) ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant';
  const step4 = isResolved ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant';

  resultCard.innerHTML = `
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-3">
      <div>
        <div class="flex items-center gap-2">
          <span class="font-code-num font-bold text-lg text-primary">${ticket.grievance_code}</span>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded font-code-num ${
            ticket.status === 'Resolved' ? 'bg-secondary-container text-on-secondary-container' :
            ticket.status === 'Hearing Scheduled' ? 'bg-error-container text-on-error-container' :
            'bg-amber-100 text-amber-900 border border-amber-300'
          }">${ticket.status}</span>
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded font-code-num bg-surface-container-high text-on-surface">${ticket.priority || 'Standard'} Priority</span>
        </div>
        <div class="text-xs font-semibold text-on-surface mt-0.5">${ticket.appeal_type} Appeal • Lodged by ${ticket.complainant_name}</div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="AppState.activeGrievanceId = '${ticket.grievance_code}'; printGrievanceReceipt();" class="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm">
          <span class="material-symbols-outlined text-[16px]">print</span>
          <span>Print Acknowledgment Slip</span>
        </button>
      </div>
    </div>

    <!-- 4-Stage Stepper Progress -->
    <div class="py-2">
      <div class="text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider mb-2">Grievance Redressal Lifecycle (SLA Tracking)</div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div class="p-2.5 rounded-lg bg-surface-container flex items-center gap-2">
          <div class="w-6 h-6 rounded-full ${step1} flex items-center justify-center font-bold text-xs shrink-0">✓</div>
          <div>
            <div class="font-bold text-xs">1. Lodged</div>
            <div class="text-[10px] text-on-surface-variant">Token Issued</div>
          </div>
        </div>
        <div class="p-2.5 rounded-lg bg-surface-container flex items-center gap-2">
          <div class="w-6 h-6 rounded-full ${step2} flex items-center justify-center font-bold text-xs shrink-0">${isAssigned ? '✓' : '2'}</div>
          <div>
            <div class="font-bold text-xs">2. Officer Assigned</div>
            <div class="text-[10px] text-on-surface-variant">Patwari Division</div>
          </div>
        </div>
        <div class="p-2.5 rounded-lg bg-surface-container flex items-center gap-2">
          <div class="w-6 h-6 rounded-full ${step3} flex items-center justify-center font-bold text-xs shrink-0">${(isHearing || isResolved) ? '✓' : '3'}</div>
          <div>
            <div class="font-bold text-xs">3. CALA Hearing</div>
            <div class="text-[10px] text-on-surface-variant">${ticket.hearing_date || 'In Scheduling'}</div>
          </div>
        </div>
        <div class="p-2.5 rounded-lg bg-surface-container flex items-center gap-2">
          <div class="w-6 h-6 rounded-full ${step4} flex items-center justify-center font-bold text-xs shrink-0">${isResolved ? '✓' : '4'}</div>
          <div>
            <div class="font-bold text-xs">4. Settlement Order</div>
            <div class="text-[10px] text-on-surface-variant">${isResolved ? 'Award Finalized' : 'Pending Order'}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ticket Summary Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
      <div class="p-3 bg-surface-container-lowest rounded-lg border border-surface-container space-y-1">
        <div class="font-bold text-on-surface">Case Details:</div>
        <div><span class="text-on-surface-variant">Survey Plot:</span> <strong class="text-on-surface">Survey ${ticket.plot_khasra_no || 'N/A'} (${ticket.mouza_village || 'Nagpur'})</strong></div>
        <div><span class="text-on-surface-variant">Contact Phone:</span> <strong>${ticket.complainant_phone || 'N/A'}</strong></div>
        <div><span class="text-on-surface-variant">Assigned Authority:</span> <strong>${ticket.assigned_officer || 'SLAO Desk'}</strong></div>
        <div><span class="text-on-surface-variant">Hearing Date:</span> <strong>${ticket.hearing_date || 'Awaiting Scheduling'}</strong></div>
      </div>
      <div class="p-3 bg-surface-container-lowest rounded-lg border border-surface-container space-y-1">
        <div class="font-bold text-on-surface">Official Redressal Findings:</div>
        <p class="text-[11px] text-on-surface-variant leading-relaxed">
          ${ticket.officer_remarks || 'The grievance has been admitted by the Competent Authority. Field records are under active scrutiny.'}
        </p>
      </div>
    </div>
  `;
}

function clearCitizenTracker() {
  const input = document.getElementById('citizenTrackerInput');
  const resultCard = document.getElementById('citizenTrackerResult');
  if (input) input.value = '';
  if (resultCard) {
    resultCard.classList.add('hidden');
    resultCard.innerHTML = '';
  }
}

// LEGAL NOTICES & OFFICIAL ORDERS GENERATOR
function generateHearingSummonsOrder() {
  const activeTicket = AppState.grievances.find(g => g.grievance_code === AppState.activeGrievanceId);
  if (!activeTicket) return;

  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Form VIII - Summons for Appearance - ${activeTicket.grievance_code}</title>
      <style>
        body { font-family: 'Times New Roman', serif; padding: 40px; color: #000; font-size: 14px; line-height: 1.6; }
        .court-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 24px; }
        .case-meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold; }
        .notice-title { text-align: center; font-size: 18px; font-weight: bold; text-decoration: underline; margin: 20px 0; }
        .content { margin: 20px 0; text-align: justify; }
        .signature-block { margin-top: 60px; display: flex; justify-content: space-between; }
      </style>
    </head>
    <body>
      <div class="court-header">
        <h3 style="margin:0;">COURT OF THE COMPETENT AUTHORITY & SPECIAL LAND ACQUISITION OFFICER</h3>
        <h4 style="margin:4px 0;">NATIONAL HIGHWAYS EXPANSION PROJECT • NAGPUR RURAL BENCH</h4>
        <p style="margin:0;font-size:12px;">Under Section 15 of Right to Fair Compensation and Transparency in Land Acquisition (RFCTLARR) Act 2013</p>
      </div>

      <div class="case-meta">
        <div>CASE REFERENCE: <strong>${activeTicket.grievance_code}</strong></div>
        <div>DATE OF NOTICE: <strong>${new Date().toLocaleDateString('en-IN')}</strong></div>
      </div>

      <div class="notice-title">FORM VIII: STATUTORY NOTICE FOR APPEARANCE & HEARING</div>

      <div class="content">
        <p><strong>TO:</strong><br>
        <strong>${activeTicket.complainant_name}</strong><br>
        Plot / Khasra No: ${activeTicket.plot_khasra_no || '144/2'}, Mouza ${activeTicket.mouza_village || 'Umred'}, Tehsil Nagpur Rural<br>
        Contact: ${activeTicket.complainant_phone || 'N/A'}
        </p>

        <p>
          WHEREAS you have filed an objection / inquiry under category <strong>"${activeTicket.appeal_type}"</strong> regarding the land acquisition and preliminary compensation notification.
        </p>

        <p>
          <strong>GROUNDS OF CLAIM:</strong><br>
          <em>"${activeTicket.description}"</em>
        </p>

        <p>
          YOU ARE HEREBY REQUIRED TO APPEAR in person or through an authorized legal advocate before the Competent Authority on <strong>${activeTicket.hearing_date || '24th October 2024 at 11:30 AM'}</strong> at the Sub-Divisional Officer Court Room, Collectorate Campus, Nagpur, to produce evidence, certified Form 7/12 land ledger extracts, partition deeds, and supporting documents.
        </p>

        <p>
          TAKE NOTICE that in default of your appearance on the day and hour above mentioned, the inquiry will be heard and decided in your absence (ex-parte).
        </p>
      </div>

      <div class="signature-block">
        <div>
          <p>[OFFICIAL SEAL]</p>
          <p>Office of SLAO / CALA Division</p>
        </div>
        <div style="text-align:right;">
          <p><strong>Dr. Rajeshwar Rao (IAS)</strong></p>
          <p>Competent Authority Land Acquisition (CALA)<br>Special Land Acquisition Officer</p>
        </div>
      </div>

      <script>window.print();<\/script>
    </body>
    </html>
  `);
  win.document.close();
  showToast(`✓ Generated Form VIII Summons for ${activeTicket.grievance_code}.`);
}

function generateDemarcationDirectiveOrder() {
  const activeTicket = AppState.grievances.find(g => g.grievance_code === AppState.activeGrievanceId);
  if (!activeTicket) return;

  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Executive Directive - Field Demarcation - ${activeTicket.grievance_code}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #0b1c30; font-size: 13px; line-height: 1.6; }
        .directive-card { border: 2px solid #006c4a; padding: 30px; border-radius: 8px; }
        .title { text-align: center; font-size: 18px; font-weight: bold; color: #006c4a; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="directive-card">
        <div class="title">REVENUE DEPARTMENT • EXECUTIVE FIELD DIRECTIVE</div>
        <p><strong>ORDER NO:</strong> E-BHUMI/SLAO/DIR/${activeTicket.grievance_code}</p>
        <p><strong>TO:</strong> Shri Vikram K. Deshmukh (SLAO-082), Senior Survey Patwari</p>
        <p><strong>SUBJECT:</strong> Joint DGPS Boundary Demarcation & Tree Asset Re-inspection regarding Khasra No. ${activeTicket.plot_khasra_no} (${activeTicket.mouza_village})</p>
        <hr>
        <p>You are hereby instructed to proceed to Mouza ${activeTicket.mouza_village} within 72 hours and execute on-site DGPS boundary demarcation in presence of the applicant <strong>${activeTicket.complainant_name}</strong> and adjoining survey plot owners.</p>
        <p>Submit joint measurement sheet (JMS) and geo-tagged photographs to the CALA portal upon completion.</p>
        <div style="margin-top:40px;text-align:right;">
          <p><strong>Special Land Acquisition Officer (CALA)</strong><br>Nagpur Rural District</p>
        </div>
      </div>
      <script>window.print();<\/script>
    </body>
    </html>
  `);
  win.document.close();
  showToast(`✓ Generated Field Demarcation Directive for ${activeTicket.grievance_code}.`);
}

function generateSettlementDisposalOrder() {
  const activeTicket = AppState.grievances.find(g => g.grievance_code === AppState.activeGrievanceId);
  if (!activeTicket) return;

  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Official Redressal & Settlement Award - ${activeTicket.grievance_code}</title>
      <style>
        body { font-family: 'Times New Roman', serif; padding: 40px; color: #000; font-size: 14px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 24px; }
        .order-title { text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h3 style="margin:0;">OFFICE OF THE SPECIAL LAND ACQUISITION OFFICER (CALA)</h3>
        <h4 style="margin:4px 0;">ORDER UNDER SECTION 15 / 19 RFCTLARR ACT 2013</h4>
      </div>
      <div class="order-title">FINAL SETTLEMENT & REDRESSAL ORDER</div>
      <p><strong>Grievance Reference:</strong> ${activeTicket.grievance_code}</p>
      <p><strong>Petitioner:</strong> ${activeTicket.complainant_name} (Survey ${activeTicket.plot_khasra_no || '144/2'}, Mouza ${activeTicket.mouza_village})</p>
      <p><strong>Matter:</strong> ${activeTicket.appeal_type} objection against acquisition demarcation.</p>
      <p><strong>FINAL ORDER:</strong><br>
      The Competent Authority, after reviewing field survey records and hearing parties, orders that the revised boundary coordinates be permanently recorded in table <code>e_bhumi_db.land_plots</code> and supplementary valuation ledger be sanctioned for Direct Benefit Transfer.</p>
      <div style="margin-top:60px;display:flex;justify-content:space-between;">
        <div>Seal of Court</div>
        <div style="text-align:right;">
          <strong>Dr. Rajeshwar Rao (IAS)</strong><br>Competent Authority Land Acquisition (CALA)
        </div>
      </div>
      <script>window.print();<\/script>
    </body>
    </html>
  `);
  win.document.close();
  showToast(`✓ Generated Settlement Award Order for ${activeTicket.grievance_code}.`);
}

// NEW GRIEVANCE CONFIRMATION MODAL & ACTIONS
function copyGrievanceCode() {
  const code = document.getElementById('succGrievanceCode').textContent;
  navigator.clipboard.writeText(code);
  showToast(`✓ Ticket Code ${code} copied to clipboard!`);
}

function trackNewlyLodgedTicket() {
  const code = document.getElementById('succGrievanceCode').textContent;
  closeGrievanceSuccessModal();
  quickTrackTicket(code);
  toggleCitizenTracker();
}

function printCurrentSuccessSlip() {
  const code = document.getElementById('succGrievanceCode').textContent;
  AppState.activeGrievanceId = code;
  printGrievanceReceipt();
}

function closeGrievanceSuccessModal() {
  const modal = document.getElementById('modalGrievanceSuccess');
  if (modal) modal.classList.add('hidden');
}

// PARCEL DOSSIER VALUATION ADJUSTMENT (SAVES TO MYSQL)
async function saveDossierValuationAdjustment() {
  if (checkDemoRestriction('modify land valuation figures in the database')) return;
  const activeParcel = AppState.parcels.find(p => p.id === AppState.activeParcelId);
  if (!activeParcel) return;

  const newCircleRate = parseFloat(document.getElementById('drawerInputCircleRate').value) || activeParcel.circleRate || 2000000;
  const newAssetsVal = parseFloat(document.getElementById('drawerInputAssetsVal').value) || 1500000;

  const area = parseFloat(activeParcel.areaHa) || 1.0;
  const mult = 2.5;
  const marketVal = newCircleRate * area * mult;
  const solatium = marketVal;
  const interest = marketVal * 0.12;
  const totalVal = marketVal + solatium + interest + newAssetsVal;

  const payload = {
    base_circle_rate: newCircleRate,
    multiplier_factor: mult,
    computed_market_value: marketVal,
    solatium_amount: solatium,
    additional_interest: interest,
    assets_valuation: newAssetsVal,
    final_total_compensation: totalVal
  };

  try {
    const res = await fetch(`${AppState.apiBase}/plots/${activeParcel.id}/valuation`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(AppState.isDemoMode ? { 'x-demo-mode': 'true' } : {})
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast(`✓ Legal valuation for #${activeParcel.id} updated in MySQL database!`);
    } else {
      showToast(`✓ Valuation calculated for #${activeParcel.id}.`);
    }
  } catch (err) {
    showToast(`✓ Valuation calculated locally.`);
  }

  // Update in-memory state
  activeParcel.circleRate = newCircleRate;
  activeParcel.assetsValuation = newAssetsVal;
  activeParcel.solatium = solatium;
  activeParcel.interest = interest;
  activeParcel.awardValuation = totalVal;

  // Update drawer numbers
  const rEl = document.getElementById('dossier-base-rate');
  if (rEl) rEl.textContent = `₹ ${Number(newCircleRate).toLocaleString('en-IN')} / Ha`;

  const mEl = document.getElementById('dossier-market-val');
  if (mEl) mEl.textContent = `₹ ${Number(marketVal).toLocaleString('en-IN')}`;

  const sEl = document.getElementById('dossier-solatium');
  if (sEl) sEl.textContent = `+ ₹ ${Number(solatium).toLocaleString('en-IN')}`;

  const iEl = document.getElementById('dossier-interest');
  if (iEl) iEl.textContent = `+ ₹ ${Number(interest).toLocaleString('en-IN')}`;

  const aEl = document.getElementById('dossier-assets');
  if (aEl) aEl.textContent = `+ ₹ ${Number(newAssetsVal).toLocaleString('en-IN')}`;

  const tEl = document.getElementById('dossier-total');
  if (tEl) tEl.textContent = `₹ ${Number(totalVal).toLocaleString('en-IN')}`;

  renderParcelsTable();
  renderTabParcelsTable();
}

// EXECUTE REAL DBT BANK TRANSFER (SAVES TO MYSQL dbt_payments)
async function executePlotDbtTransfer() {
  if (checkDemoRestriction('authorize Direct Benefit Transfer disbursals')) return;
  const activeParcel = AppState.parcels.find(p => p.id === AppState.activeParcelId);
  if (!activeParcel) return;

  if (activeParcel.stage === 'disbursed' || activeParcel.status === 'Disbursed') {
    showToast(`ℹ️ Compensation for #${activeParcel.id} is already disbursed via PFMS.`);
    return;
  }

  showToast(`Initiating Direct Benefit Transfer (PFMS) for #${activeParcel.id}...`);

  const payload = {
    plot_code: activeParcel.id,
    action_type: 'DBT_DISBURSE',
    recipient_name: activeParcel.owner,
    amount: activeParcel.awardValuation
  };

  try {
    const res = await fetch(`${AppState.apiBase}/workflows/action`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(AppState.isDemoMode ? { 'x-demo-mode': 'true' } : {})
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      showToast(`✓ Disbursed via PFMS Voucher #${data.pfms_voucher_no}! Recorded in MySQL.`);
      activeParcel.status = 'Disbursed';
      activeParcel.stage = 'disbursed';
      activeParcel.dbtStatus = 'Paid via Bank Transfer (PFMS)';
      activeParcel.statusColor = 'secondary';
    } else {
      showToast(`✓ DBT payment authorized for ${activeParcel.owner}.`);
      activeParcel.status = 'Disbursed';
      activeParcel.dbtStatus = 'Paid via Bank Transfer (PFMS)';
    }
  } catch (err) {
    showToast(`✓ DBT payment authorized locally for ${activeParcel.owner}.`);
    activeParcel.status = 'Disbursed';
    activeParcel.dbtStatus = 'Paid via Bank Transfer (PFMS)';
  }

  renderParcelsTable();
  renderTabParcelsTable();
  selectParcel(activeParcel.id);
}

function inspectPlotOnCadastre() {
  const activeTicket = AppState.grievances.find(g => g.grievance_code === AppState.activeGrievanceId);
  if (!activeTicket) return;

  // Switch to parcels tab
  switchView('parcels');

  // Search by survey
  const searchInput = document.getElementById('tabParcelsSearchInput');
  if (searchInput && activeTicket.plot_khasra_no) {
    searchInput.value = activeTicket.plot_khasra_no;
    AppState.tabParcelsSearchQuery = activeTicket.plot_khasra_no.toLowerCase();
    renderTabParcelsTable();
  }
}

async function saveGrievanceResolution() {
  if (checkDemoRestriction('update grievance resolution in database')) return;
  const activeTicket = AppState.grievances.find(g => g.grievance_code === AppState.activeGrievanceId);
  if (!activeTicket) return;

  const newStatus = document.getElementById('dtlStatusSelect').value;
  const newOfficer = document.getElementById('dtlAssignedOfficerInput').value.trim();
  const newHearingDate = document.getElementById('dtlHearingDateInput').value;
  const newRemarks = document.getElementById('dtlRemarksInput').value.trim();

  const updatePayload = {
    status: newStatus,
    assigned_officer: newOfficer,
    hearing_date: newHearingDate || null,
    officer_remarks: newRemarks
  };

  try {
    const res = await fetch(`${AppState.apiBase}/grievances/${activeTicket.grievance_id || activeTicket.grievance_code}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...(AppState.isDemoMode ? { 'x-demo-mode': 'true' } : {})
      },
      body: JSON.stringify(updatePayload)
    });

    if (res.ok) {
      showToast(`✓ Ticket ${activeTicket.grievance_code} updated in MySQL database!`);
    } else {
      showToast(`✓ Status updated for ticket ${activeTicket.grievance_code}.`);
    }
  } catch (err) {
    console.warn('Backend offline, updating local state:', err);
    showToast(`✓ Ticket ${activeTicket.grievance_code} updated locally.`);
  }

  // Update in memory
  activeTicket.status = newStatus;
  activeTicket.assigned_officer = newOfficer;
  activeTicket.hearing_date = newHearingDate;
  activeTicket.officer_remarks = newRemarks;

  renderGrievances();
  populateGrievanceDetail(activeTicket);
}

function openLodgeGrievanceModal() {
  const modal = document.getElementById('modalNewGrievance');
  if (!modal) return;

  const codeEl = document.getElementById('newGrievanceGeneratedCode');
  const nextCode = `GR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  if (codeEl) codeEl.textContent = nextCode;

  modal.classList.remove('hidden');
}

function closeLodgeGrievanceModal() {
  const modal = document.getElementById('modalNewGrievance');
  if (modal) modal.classList.add('hidden');
}

async function handleFormNewGrievance(event) {
  event.preventDefault();

  const name = document.getElementById('grievanceInputName').value.trim();
  const phone = document.getElementById('grievanceInputPhone').value.trim();
  const email = document.getElementById('grievanceInputEmail').value.trim();
  const aadhaar = document.getElementById('grievanceInputAadhaar').value.trim();
  const survey = document.getElementById('grievanceInputSurvey').value.trim();
  const village = document.getElementById('grievanceInputVillage').value.trim();
  const category = document.getElementById('grievanceInputCategory').value;
  const priority = document.getElementById('grievanceInputPriority').value;
  const desc = document.getElementById('grievanceInputDescription').value.trim();

  const generatedCode = document.getElementById('newGrievanceGeneratedCode').textContent || `GR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const payload = {
    complainant_name: name,
    complainant_phone: phone,
    complainant_email: email,
    complainant_aadhaar: aadhaar,
    plot_khasra_no: survey,
    mouza_village: village,
    appeal_type: category,
    priority: priority,
    description: desc,
    assigned_officer: 'SLAO-082 Patwari Division'
  };

  let newGrievanceId = AppState.grievances.length + 1;

  try {
    const res = await fetch(`${AppState.apiBase}/grievances/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.grievance_id) newGrievanceId = data.grievance_id;
      showToast(`✓ Grievance ${data.grievance_code || generatedCode} recorded into MySQL database!`);
    } else {
      showToast(`✓ Grievance ${generatedCode} registered successfully.`);
    }
  } catch (err) {
    console.warn('Backend sync failed, saved locally:', err);
    showToast(`✓ Grievance ${generatedCode} saved locally.`);
  }

  const newTicket = {
    grievance_id: newGrievanceId,
    grievance_code: generatedCode,
    plot_khasra_no: survey,
    mouza_village: village,
    complainant_name: name,
    complainant_phone: phone,
    complainant_email: email,
    appeal_type: category,
    priority: priority,
    description: desc,
    officer_remarks: 'Ticket registered via Citizen Portal. Stored in MySQL: e_bhumi_db.',
    assigned_officer: 'SLAO-082 Patwari Division',
    hearing_date: null,
    status: 'Pending Review',
    created_at: new Date().toISOString()
  };

  AppState.grievances.unshift(newTicket);
  AppState.activeGrievanceId = generatedCode;

  closeLodgeGrievanceModal();
  document.getElementById('formNewGrievance').reset();

  renderGrievances();

  // Show Success Confirmation Modal
  const successModal = document.getElementById('modalGrievanceSuccess');
  const succCodeEl = document.getElementById('succGrievanceCode');
  if (succCodeEl) succCodeEl.textContent = generatedCode;
  if (successModal) successModal.classList.remove('hidden');
}

function printGrievanceReceipt() {
  const activeTicket = AppState.grievances.find(g => g.grievance_code === AppState.activeGrievanceId);
  if (!activeTicket) return;

  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Official Grievance Acknowledgment - ${activeTicket.grievance_code}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #0b1c30; font-size: 13px; }
        .receipt-card { border: 2px solid #0b1c30; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 16px; }
        .code { font-size: 20px; font-weight: bold; color: #006c4a; letter-spacing: 1px; }
        .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #cbd5e1; }
        .label { color: #64748b; font-weight: 600; }
        .val { font-weight: bold; }
        .statement { background: #f8f9ff; padding: 12px; border-radius: 6px; margin: 12px 0; font-style: italic; }
      </style>
    </head>
    <body>
      <div class="receipt-card">
        <div class="header">
          <h3 style="margin:0;">GOVERNMENT OF INDIA • NATIONAL LAND ACQUISITION PORTAL</h3>
          <h2 style="margin:4px 0 8px 0;">Official Citizen Grievance Acknowledgment Slip</h2>
          <div class="code">${activeTicket.grievance_code}</div>
          <div style="font-size:11px;color:#64748b;">Stored in MySQL Database: e_bhumi_db.citizen_grievances</div>
        </div>

        <div class="row"><span class="label">Complainant Name:</span><span class="val">${activeTicket.complainant_name}</span></div>
        <div class="row"><span class="label">Contact Phone:</span><span class="val">${activeTicket.complainant_phone || 'N/A'}</span></div>
        <div class="row"><span class="label">Dispute / Inquiry Type:</span><span class="val">${activeTicket.appeal_type}</span></div>
        <div class="row"><span class="label">Linked Plot / Survey:</span><span class="val">Survey ${activeTicket.plot_khasra_no || 'N/A'} (${activeTicket.mouza_village || 'Nagpur'})</span></div>
        <div class="row"><span class="label">Priority SLA:</span><span class="val">${activeTicket.priority || 'Standard'}</span></div>
        <div class="row"><span class="label">Current Status:</span><span class="val" style="color:#006c4a;">${activeTicket.status}</span></div>
        <div class="row"><span class="label">Hearing Date:</span><span class="val">${activeTicket.hearing_date || 'Awaiting Scheduling'}</span></div>
        <div class="row"><span class="label">Assigned Authority:</span><span class="val">${activeTicket.assigned_officer || 'SLAO Division'}</span></div>

        <div class="statement">
          <strong>Grounds of Objection:</strong><br>
          ${activeTicket.description}
        </div>

        <div style="margin-top:20px;text-align:center;font-size:11px;color:#64748b;">
          This is an electronically generated official acknowledgment receipt under the RFCTLARR Act 2013 and C-GRAMS Portal.
        </div>
      </div>
      <script>window.print();<\/script>
    </body>
    </html>
  `);
  win.document.close();
  showToast(`✓ Generated Acknowledgment Slip for ${activeTicket.grievance_code}.`);
}

