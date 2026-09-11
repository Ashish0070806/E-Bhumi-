/**
 * E-Bhumi - National Land & Citizen Portal
 * SIH-26016 Model Engine
 * Application Controller, Interactive Google Satellite GIS Engine & Workflow Manager
 */

// --- APPLICATION STATE ---
const AppState = {
  currentView: 'overview',
  activeParcelId: 'MH-NGP-4029',
  pendingApprovalsCount: 6,
  overviewMap: null,
  dedicatedMap: null,
  overviewPolygons: [],
  dedicatedPolygons: [],
  googleMapsLoaded: false,
  projects: [
    {
      id: 'PKG-4B',
      title: 'NH-44 Express Corridor Expansion — Package 4B',
      corridor: 'Nagpur — Hinganghat Highway Route',
      notification: 'S.O. 1842(E) / Section 3A Public Notice',
      district: 'Nagpur Rural (Umred, Bhiwapur, Kuhi)',
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
      status: 'ACTIVE CORRIDOR',
      statusClass: 'bg-secondary-container text-on-secondary-container',
      incharge: 'Dr. Rajeshwar Rao (IAS) - Special Land Acquisition Officer'
    },
    {
      id: 'PKG-2A',
      title: 'NH-53 Bypass Expansion — Package 2A',
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
      status: 'FIELD SURVEY ACTIVE',
      statusClass: 'bg-surface-container-high text-on-surface',
      incharge: 'Shri V. K. Deshmukh (SLAO-082)'
    },
    {
      id: 'FEEDER-01',
      title: 'Samruddhi Mahamarg Feeder Link — Phase 1',
      corridor: 'Wardha — Butibori Expressway Connector',
      notification: 'S.O. 1190(E) / Section 3D Final Award',
      district: 'Wardha & Butibori',
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
      status: 'FINAL DISBURSAL (90%)',
      statusClass: 'bg-secondary-container text-on-secondary-container',
      incharge: 'Smt. Anjali Sharma (CALA / SDM)'
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
  initNavigation();
  initGoogleSatelliteMaps();
  initSvgMapFallback();
  initProjectsModule();
  initParcelsTable();
  initApprovalQueue();
  initSurveyModule();
  initModals();
  updatePendingBadge();
});

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

// --- PROJECTS MODULE ---
function initProjectsModule() {
  renderProjectsList();

  // New Project Form in Projects Tab
  const formNewProj = document.getElementById('formNewProject');
  if (formNewProj) {
    formNewProj.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('projInputTitle');
      const corridorInput = document.getElementById('projInputCorridor');
      const noticeInput = document.getElementById('projInputNotice');
      const targetInput = document.getElementById('projInputTarget');

      const newProj = {
        id: 'PKG-' + (AppState.projects.length + 1) + 'A',
        title: titleInput ? titleInput.value : 'New Highway Corridor Project',
        corridor: corridorInput ? corridorInput.value : 'Inter-State Expressway Expansion',
        notification: noticeInput ? noticeInput.value : 'S.O. 2480(E) / Section 3A',
        district: 'Nagpur & Wardha Rural',
        marker: 'Km 0 to Km 54',
        targetHa: targetInput ? parseFloat(targetInput.value) || 500 : 500,
        acquiredHa: 0,
        percent: 0,
        totalPlots: 0,
        clearPlots: 0,
        processPlots: 0,
        reviewPlots: 0,
        escrowCr: 250.00,
        disbursedCr: 0.00,
        status: 'JUST INITIALIZED',
        statusClass: 'bg-surface-container text-on-surface',
        incharge: 'Special Land Acquisition Officer (CALA)'
      };

      AppState.projects.unshift(newProj);
      renderProjectsList();

      const modal = document.getElementById('modalNewProject');
      if (modal) modal.classList.add('hidden');
      formNewProj.reset();

      showToast(`✓ New Project "${newProj.title}" registered successfully!`);
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
      status: 'IMPORTED FROM FILE',
      statusClass: 'bg-secondary-container text-on-secondary-container',
      incharge: 'Dr. Rajeshwar Rao (SLAO)'
    };

    AppState.projects.unshift(importedProj);
    renderProjectsList();

    const modal = document.getElementById('modalBulkUpload');
    if (modal) modal.classList.add('hidden');

    showToast(`✓ Successfully imported ${fileName} with 312 Cadastral Plots!`);
  }, 1200);
}

function renderProjectsList() {
  const container = document.getElementById('projectsListContainer');
  if (!container) return;

  const countBadge = document.getElementById('activeProjectsCount');
  if (countBadge) countBadge.textContent = AppState.projects.length;

  container.innerHTML = '';

  AppState.projects.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container/80 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow';
    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-3 mb-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-headline font-bold text-base text-on-surface">${proj.title}</span>
              <span class="font-code-num text-[10px] font-bold px-2 py-0.5 rounded ${proj.statusClass}">${proj.status}</span>
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
            <div class="font-bold font-code-num text-on-surface">${proj.targetHa} Ha</div>
          </div>
          <div>
            <span class="text-on-surface-variant text-[10px] uppercase font-code-num">Acquired Land</span>
            <div class="font-bold font-code-num text-secondary">${proj.acquiredHa} Ha</div>
          </div>
          <div>
            <span class="text-on-surface-variant text-[10px] uppercase font-code-num">Measured Plots</span>
            <div class="font-bold font-code-num text-on-surface">${proj.totalPlots} Plots</div>
          </div>
          <div>
            <span class="text-on-surface-variant text-[10px] uppercase font-code-num">Escrow Fund</span>
            <div class="font-bold font-code-num text-on-surface">₹${proj.escrowCr} Cr</div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-2 border-t border-surface-container text-xs">
        <span class="text-[11px] text-on-surface-variant truncate">Officer: ${proj.incharge}</span>
        <div class="flex items-center gap-2">
          <button onclick="switchView('overview')" class="bg-primary hover:bg-primary-container text-on-primary px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors">
            <span>Open Dashboard</span>
            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
          <button onclick="switchView('gis')" class="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors">
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

  const filtered = AppState.parcels.filter(p => {
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
        <span>DGPS Boundary Markers Verified & Synced with Bhoomi Database.</span>
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
    btnSaveSurvey.addEventListener('click', () => {
      showToast('✓ Survey Plot #MH-NGP-4029 synced to Bhoomi Government Hub with cryptographic check.');
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
