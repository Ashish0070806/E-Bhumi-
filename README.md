# E-Bhumi — National Cadastral Land Acquisition & GIS Portal

An enterprise-grade web application built from **Google Stitch (Model Context Protocol)** designs for the **Smart India Hackathon (SIH-26016 Model Engine)**, compliant with the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR 2013)**.

---

## Key Features

1. **Executive GIS & Cadastral Dashboard**
   - **Real-Time Project Banner**: NH-44 Express Corridor Expansion (Package 4B) with live NIC-Bhoomi Hub synchronization.
   - **4-Stage Statutory Pipeline**: Stage 01 Legal Intake, Stage 02 Survey & GIS, Stage 03 Statutory (Sec 11/19), Stage 04 PFMS Settlement.
   - **Core KPI Metrics**: 184.6 Ha acquired (78% target), 528 Khasra plots breakdown, ₹482.40 Cr PFMS disbursed, +18 Days timeline benchmark.
   - **Interactive Vector GIS Map Canvas**: High-precision vector SVG canvas with layer filters (Drone Ortho 5cm, Khasra Cadastre, RoW Buffer 60m), coordinates HUD, zoom controls, and clickable cadastral polygons (`#MH-NGP-4028` to `#MH-NGP-4034`).
   - **Statutory Approvals & Fast-Track Pipeline**: CALA Authorized Bench with DSC key status, urgent queue items for Section 19 declaration digital signing, DGPS marker verification, and SLAO hearing assignments.

2. **Cadastral Master Register & RFCTLARR Math Engine**
   - **Search & Filter Tabs**: Filter across All (528), Demarcated (412), Under Valuation (42), Ready for Award (88), Disbursed (18), and Disputed (12).
   - **Slide-out Compensation Dossier Drawer**: Comprehensive mathematical breakdown of Section 26 Market Value, Section 30(1) 100% Solatium, Section 30(3) 12% Additional Interest, tree/structure valuations, and Aadhaar-linked PFMS payout.

3. **Mobile Field Survey & DGPS Capture Simulator**
   - **NavIC / Leica GS18 T Telemetry**: Real-time simulated RTK Fix (±1.8 cm accuracy, 24 satellites, HDOP 0.8, 284.62m elevation).
   - **Interactive Vertex Logging**: Click "Capture DGPS Vertex" to log high-precision coordinates with jitter simulation.
   - **Field Photo Geo-Tagging & Sync**: Offline cache queue and one-click sync to NIC-Bhoomi Hub.
   - **Mobile Bezel Mode**: Toggle between desktop view and mobile device frame.

4. **Google Stitch MCP Studio**
   - **Live MCP Connection**: Direct integration with `https://stitch.googleapis.com/mcp` using your authenticated API key.
   - **Screen Inspector**: View and download raw screen HTML and design assets.
   - **Live AI Generation**: Prompt bar to generate new screens or variants via Gemini Thinking Agent.

---

## How to Run

### Option 1: Run with Local Server (Recommended)
Open PowerShell in this directory and run:
```powershell
.\serve.ps1
```
This starts a local HTTP server at `http://localhost:8080/` with:
- Zero external dependencies (.NET `HttpListener`).
- Built-in reverse proxy at `/api/stitch/mcp` (bypassing browser CORS).
- Automatically opens your default web browser.

### Option 2: Open Directly in Browser
You can open `index.html` directly in Google Chrome, Microsoft Edge, or Firefox:
```powershell
Start-Process "index.html"
```

---

## Project Structure
```text
ebhumi/
├── index.html            # Main unified single-page web application
├── app.js                # Core state controller, GIS coordinator & calculators
├── stitch-client.js      # Google Stitch MCP client & proxy wrapper
├── serve.ps1             # Zero-dependency PowerShell HTTP server & Stitch proxy
├── logo.svg              # E-Bhumi official brand vector logo
├── officer_headshot.png  # Dr. Rajeshwar Rao (IAS / SLAO) portrait
├── dashboard.html        # Raw desktop screen generated from Stitch MCP
├── mobile_survey.html    # Raw mobile field survey screen from Stitch MCP
└── README.md             # This documentation file
```
