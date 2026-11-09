export function getLandingHtml() {
  const RAPIDAPI_PLAYGROUND_URL = 'https://rapidapi.com/artuturoh/api/qrforge-smart-qr-code-and-custom-branding-generator/playground';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QRForge API — Smart QR Code, Custom Branding & Payload Generator</title>
  <meta name="description" content="Ultra-fast (<5ms), 100% in-memory microservice for smart, custom-branded QR codes. Supports Wi-Fi, WhatsApp, vCard, Crypto, SVG badges, and parallel batch processing.">
  <meta name="theme-color" content="#090D16">
  <style>
    :root {
      --bg: #090D16;
      --card-bg: rgba(18, 24, 38, 0.75);
      --card-border: rgba(255, 255, 255, 0.08);
      --card-hover: rgba(255, 255, 255, 0.12);
      --primary: #10B981;
      --primary-glow: rgba(16, 185, 129, 0.25);
      --indigo: #6366F1;
      --indigo-glow: rgba(99, 102, 241, 0.25);
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --text-dim: #64748B;
      --input-bg: #0F172A;
      --input-border: #334155;
      --radius: 12px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.5;
      overflow-x: hidden;
      min-height: 100vh;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.07) 0%, transparent 40%),
        radial-gradient(circle at 85% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 45%),
        radial-gradient(circle at 50% 85%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Header */
    header {
      padding: 24px 0;
      border-bottom: 1px solid var(--card-border);
      backdrop-filter: blur(10px);
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(9, 13, 22, 0.85);
    }

    .header-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .brand-icon {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, var(--primary), var(--indigo));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFF;
      box-shadow: 0 0 20px var(--primary-glow);
    }

    .brand span {
      background: linear-gradient(to right, #FFF, #CBD5E1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--card-border);
      color: var(--text-main);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--card-hover);
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary), #059669);
      color: #FFF;
      box-shadow: 0 4px 15px var(--primary-glow);
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }

    .btn-rapidapi {
      background: linear-gradient(135deg, #0052CC, #172B4D);
      border: 1px solid #2684FF;
      color: #FFF;
      box-shadow: 0 4px 15px rgba(0, 82, 204, 0.3);
    }

    .btn-rapidapi:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(38, 132, 255, 0.4);
    }

    /* Hero */
    .hero {
      padding: 60px 0 40px;
      text-align: center;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 24px;
    }

    .pulsing-dot {
      width: 8px;
      height: 8px;
      background-color: var(--primary);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--primary);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.7; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.7; }
    }

    .hero h1 {
      font-size: 3rem;
      line-height: 1.18;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 16px;
      color: #FFFFFF;
    }

    .hero h1 .highlight {
      color: #10B981;
    }

    .hero p {
      font-size: 1.125rem;
      color: var(--text-muted);
      max-width: 680px;
      margin: 0 auto 32px;
    }

    /* Playground Grid */
    .playground {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 80px;
    }

    @media (max-width: 900px) {
      .playground {
        grid-template-columns: 1fr;
      }
      .hero h1 {
        font-size: 2.2rem;
      }
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius);
      padding: 28px;
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    input[type="text"],
    input[type="number"],
    select,
    textarea {
      width: 100%;
      padding: 10px 14px;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 8px;
      color: var(--text-main);
      font-size: 0.9375rem;
      outline: none;
      transition: border-color 0.2s;
    }

    input:focus,
    select:focus,
    textarea:focus {
      border-color: var(--primary);
    }

    /* Color picker component */
    .color-input-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 8px;
      padding: 4px 10px;
    }

    .color-input-wrapper input[type="color"] {
      -webkit-appearance: none;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      cursor: pointer;
      background: none;
    }

    .color-input-wrapper input[type="color"]::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    .color-input-wrapper input[type="color"]::-webkit-color-swatch {
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
    }

    .color-text {
      background: none;
      border: none;
      color: var(--text-main);
      font-family: monospace;
      font-size: 0.875rem;
      width: 80px;
      outline: none;
    }

    /* Segments */
    .segmented {
      display: flex;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: 8px;
      padding: 4px;
      gap: 4px;
    }

    .seg-btn {
      flex: 1;
      padding: 8px;
      text-align: center;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      background: transparent;
      color: var(--text-muted);
      transition: all 0.2s;
    }

    .seg-btn.active {
      background: var(--primary);
      color: #FFF;
      box-shadow: 0 2px 8px var(--primary-glow);
    }

    /* Preview Card */
    .preview-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 280px;
      background: #0B0F19;
      border-radius: 12px;
      border: 1px dashed var(--card-border);
      padding: 24px;
      position: relative;
      margin-bottom: 20px;
    }

    .qr-img-wrapper {
      background: #FFF;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      max-width: 240px;
      max-height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qr-img-wrapper img {
      width: 100%;
      height: auto;
      display: block;
    }

    .stats-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }

    .stat-pill {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 10px;
      text-align: center;
    }

    .stat-pill .val {
      font-size: 1rem;
      font-weight: 700;
      color: var(--primary);
      font-family: monospace;
    }

    .stat-pill .lbl {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .json-box {
      background: #050811;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 14px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.8125rem;
      color: #CBD5E1;
      max-height: 200px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Features Grid */
    .features {
      margin-bottom: 80px;
    }

    .section-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 12px;
    }

    .section-subtitle {
      text-align: center;
      color: var(--text-muted);
      margin-bottom: 40px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    @media (max-width: 800px) {
      .grid-3 {
        grid-template-columns: 1fr;
      }
    }

    .feature-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius);
      padding: 24px;
    }

    .feature-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: rgba(16, 185, 129, 0.1);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      margin-bottom: 16px;
    }

    .feature-card h3 {
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .feature-card p {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    /* Footer */
    footer {
      border-top: 1px solid var(--card-border);
      padding: 40px 0;
      text-align: center;
      color: var(--text-dim);
      font-size: 0.875rem;
    }

    footer a {
      color: var(--text-muted);
      text-decoration: underline;
    }

    footer a:hover {
      color: var(--primary);
    }

    .btn-full {
      width: 100%;
      justify-content: center;
      padding: 12px;
    }

    .actions-row {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      width: 100%;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header>
    <div class="container header-inner">
      <div class="brand">
        <div class="brand-icon">⚡</div>
        <span>QRForge API</span>
      </div>
      <div class="header-actions">
        <a href="${RAPIDAPI_PLAYGROUND_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-rapidapi">
          ⚡ Connect on RapidAPI
        </a>
      </div>
    </div>
  </header>

  <main class="container">
    <!-- Hero Section -->
    <section class="hero">
      <div class="badge-pill">
        <span class="pulsing-dot"></span>
        &lt; 5ms In-Memory Engine · Zero Database Dependencies
      </div>
      <h1>Smart QR Code &amp; <span class="highlight">Custom Branding</span> Engine</h1>
      <p>Generate high-density, production-grade QR codes with built-in payload templates (Wi-Fi, vCard, WhatsApp, Crypto), centered branding badges, and batch rendering.</p>
    </section>

    <!-- Interactive Live Playground -->
    <div class="playground">
      <!-- Config Panel -->
      <div class="card">
        <h2 class="card-title">⚙️ Generator Studio</h2>

        <div class="form-group">
          <label>Payload Template</label>
          <select id="typeSelect">
            <option value="url">URL / Web Link</option>
            <option value="wifi">Wi-Fi Network Access</option>
            <option value="whatsapp">WhatsApp Direct Message</option>
            <option value="vcard">vCard Business Contact</option>
            <option value="crypto">Crypto Payment (BIP21/EIP681)</option>
          </select>
        </div>

        <!-- Dynamic Template Fields -->
        <div id="dynamicFields">
          <!-- Populated by JS -->
        </div>

        <!-- Branding Options -->
        <div class="form-row">
          <div class="form-group">
            <label>Dark Color</label>
            <div class="color-input-wrapper">
              <input type="color" id="darkColorPicker" value="#0F172A">
              <input type="text" id="darkColorText" class="color-text" value="#0F172A" maxlength="7">
            </div>
          </div>
          <div class="form-group">
            <label>Light Color</label>
            <div class="color-input-wrapper">
              <input type="color" id="lightColorPicker" value="#FFFFFF">
              <input type="text" id="lightColorText" class="color-text" value="#FFFFFF" maxlength="7">
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Center Badge Text (Max 6)</label>
            <input type="text" id="badgeText" value="PRO" placeholder="e.g. PRO, WIFI, VIP" maxlength="6">
          </div>
          <div class="form-group">
            <label>Output Format</label>
            <div class="segmented">
              <button type="button" class="seg-btn active" id="btnSvg" data-format="svg">SVG</button>
              <button type="button" class="seg-btn" id="btnPng" data-format="png">PNG</button>
            </div>
          </div>
        </div>

        <button id="generateBtn" class="btn btn-primary btn-full">
          ⚡ Generate Live QR
        </button>
      </div>

      <!-- Live Preview Panel -->
      <div class="card">
        <h2 class="card-title">📱 Live Preview</h2>

        <div class="preview-container">
          <div class="qr-img-wrapper" id="qrWrapper">
            <img id="qrImage" src="" alt="Generated QR Code">
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-bar">
          <div class="stat-pill">
            <div class="val" id="statLatency">-- ms</div>
            <div class="lbl">Latency</div>
          </div>
          <div class="stat-pill">
            <div class="val" id="statFormat">SVG</div>
            <div class="lbl">Format</div>
          </div>
          <div class="stat-pill">
            <div class="val" id="statEcl">M</div>
            <div class="lbl">Error Level</div>
          </div>
        </div>

        <!-- Action Row -->
        <div class="actions-row">
          <button id="downloadBtn" class="btn btn-secondary" style="flex:1;">
            💾 Download Image
          </button>
          <button id="copyPayloadBtn" class="btn btn-secondary" style="flex:1;">
            📋 Copy Payload
          </button>
        </div>

        <!-- JSON Viewer -->
        <div style="margin-top: 16px;">
          <label>API JSON Response</label>
          <div class="json-box" id="jsonResponse">// Click Generate to inspect response</div>
        </div>
      </div>
    </div>

    <!-- Features -->
    <section class="features">
      <h2 class="section-title">Built for High-Throughput Production</h2>
      <p class="section-subtitle">Zero bloat, zero database locks, pure deterministic speed.</p>
      <div class="grid-3">
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3>Ultra-Fast &lt;5ms In-Memory</h3>
          <p>Every QR code is synthesized directly in RAM with zero file I/O or database round-trips. Handles thousands of requests per second effortlessly.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>SVG Center Badging</h3>
          <p>Inject crisp, high-contrast branding badges right into the center of SVG QR codes with automatic Level H error correction upgrade.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📦</div>
          <h3>Parallel Batch API</h3>
          <p>Synthesize up to 25 customized QR codes in parallel in a single atomic HTTP request with full per-item status reporting.</p>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      QRForge API &copy; 2026. Powered by <a href="${RAPIDAPI_PLAYGROUND_URL}" target="_blank" rel="noopener noreferrer">RapidAPI Hub</a>. All rights reserved.
    </div>
  </footer>

  <script>
    (function() {
      let currentFormat = 'svg';
      let lastResult = null;
      const RAPIDAPI_PLAYGROUND_URL = '${RAPIDAPI_PLAYGROUND_URL}';

      const typeSelect = document.getElementById('typeSelect');
      const dynamicFields = document.getElementById('dynamicFields');
      const darkColorPicker = document.getElementById('darkColorPicker');
      const darkColorText = document.getElementById('darkColorText');
      const lightColorPicker = document.getElementById('lightColorPicker');
      const lightColorText = document.getElementById('lightColorText');
      const badgeText = document.getElementById('badgeText');
      const btnSvg = document.getElementById('btnSvg');
      const btnPng = document.getElementById('btnPng');
      const generateBtn = document.getElementById('generateBtn');
      const qrImage = document.getElementById('qrImage');
      const jsonResponse = document.getElementById('jsonResponse');
      const statLatency = document.getElementById('statLatency');
      const statFormat = document.getElementById('statFormat');
      const statEcl = document.getElementById('statEcl');
      const downloadBtn = document.getElementById('downloadBtn');
      const copyPayloadBtn = document.getElementById('copyPayloadBtn');

      // Color synchronization
      darkColorPicker.addEventListener('input', e => darkColorText.value = e.target.value.toUpperCase());
      darkColorText.addEventListener('input', e => {
        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) darkColorPicker.value = e.target.value;
      });
      lightColorPicker.addEventListener('input', e => lightColorText.value = e.target.value.toUpperCase());
      lightColorText.addEventListener('input', e => {
        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) lightColorPicker.value = e.target.value;
      });

      // Format toggle
      btnSvg.addEventListener('click', () => {
        currentFormat = 'svg';
        btnSvg.classList.add('active');
        btnPng.classList.remove('active');
      });
      btnPng.addEventListener('click', () => {
        currentFormat = 'png';
        btnPng.classList.add('active');
        btnSvg.classList.remove('active');
      });

      // Dynamic templates
      const templates = {
        url: () => \`
          <div class="form-group">
            <label>Target URL</label>
            <input type="text" id="field_url" value="\${RAPIDAPI_PLAYGROUND_URL}" placeholder="https://example.com">
          </div>
        \`,
        wifi: () => \`
          <div class="form-group">
            <label>Wi-Fi Network Name (SSID)</label>
            <input type="text" id="field_ssid" value="Office_5G" placeholder="e.g. MyHomeWiFi">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Password</label>
              <input type="text" id="field_wifi_pass" value="SuperSecurePass123" placeholder="Password (leave empty if open)">
            </div>
            <div class="form-group">
              <label>Encryption</label>
              <select id="field_wifi_enc">
                <option value="WPA" selected>WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
          </div>
        \`,
        whatsapp: () => \`
          <div class="form-group">
            <label>Phone Number (with Country Code)</label>
            <input type="text" id="field_wa_phone" value="14155552671" placeholder="e.g. 14155552671">
          </div>
          <div class="form-group">
            <label>Pre-filled Message</label>
            <input type="text" id="field_wa_msg" value="Hello! Inquiring about QRForge API on RapidAPI." placeholder="Message text">
          </div>
        \`,
        vcard: () => \`
          <div class="form-row">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" id="field_vc_first" value="Alex" placeholder="First Name">
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" id="field_vc_last" value="Vance" placeholder="Last Name">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Mobile Phone</label>
              <input type="text" id="field_vc_phone" value="+15559876543" placeholder="+1 555 987 6543">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="text" id="field_vc_email" value="alex@example.com" placeholder="Email">
            </div>
          </div>
          <div class="form-group">
            <label>Company / Organization</label>
            <input type="text" id="field_vc_org" value="Black Mesa Labs" placeholder="Company">
          </div>
        \`,
        crypto: () => \`
          <div class="form-row">
            <div class="form-group">
              <label>Currency</label>
              <select id="field_cr_curr">
                <option value="bitcoin" selected>Bitcoin (BTC)</option>
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="solana">Solana (SOL)</option>
                <option value="litecoin">Litecoin (LTC)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Amount (Optional)</label>
              <input type="text" id="field_cr_amount" value="0.05" placeholder="0.00">
            </div>
          </div>
          <div class="form-group">
            <label>Wallet Address</label>
            <input type="text" id="field_cr_addr" value="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" placeholder="Wallet Address">
          </div>
        \`
      };

      function renderTemplate() {
        const type = typeSelect.value;
        dynamicFields.innerHTML = templates[type] ? templates[type]() : '';
        if (type === 'url') {
          badgeText.value = 'PRO';
        } else if (type === 'wifi') {
          badgeText.value = 'WIFI';
        } else if (type === 'crypto') {
          badgeText.value = 'PAY';
        } else if (badgeText.value === 'WIFI' || badgeText.value === 'PAY') {
          badgeText.value = 'PRO';
        }
      }

      typeSelect.addEventListener('change', renderTemplate);
      renderTemplate();

      function getPayloadData() {
        const type = typeSelect.value;
        switch (type) {
          case 'url':
            return document.getElementById('field_url').value;
          case 'wifi':
            return {
              ssid: document.getElementById('field_ssid').value,
              password: document.getElementById('field_wifi_pass').value,
              encryption: document.getElementById('field_wifi_enc').value
            };
          case 'whatsapp':
            return {
              phone: document.getElementById('field_wa_phone').value,
              message: document.getElementById('field_wa_msg').value
            };
          case 'vcard':
            return {
              firstName: document.getElementById('field_vc_first').value,
              lastName: document.getElementById('field_vc_last').value,
              phone: document.getElementById('field_vc_phone').value,
              email: document.getElementById('field_vc_email').value,
              org: document.getElementById('field_vc_org').value
            };
          case 'crypto':
            return {
              currency: document.getElementById('field_cr_curr').value,
              address: document.getElementById('field_cr_addr').value,
              amount: document.getElementById('field_cr_amount').value
            };
          default:
            return RAPIDAPI_PLAYGROUND_URL;
        }
      }

      async function generateLive() {
        generateBtn.disabled = true;
        generateBtn.textContent = '⏳ Rendering...';

        try {
          const type = typeSelect.value;
          const data = getPayloadData();
          const options = {
            format: currentFormat,
            darkColor: darkColorText.value,
            lightColor: lightColorText.value,
            centerBadgeText: badgeText.value.trim() || undefined
          };

          const res = await fetch('/v1/demo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, data, options })
          });

          const json = await res.json();
          lastResult = json;

          jsonResponse.textContent = JSON.stringify(json, null, 2);

          if (json.success && json.data) {
            qrImage.src = json.data.dataUri;
            statLatency.textContent = json.meta.execution_time_ms + ' ms';
            statFormat.textContent = json.data.format.toUpperCase();
            statEcl.textContent = 'Level ' + json.data.errorCorrectionLevel;
          } else {
            alert('Generation error: ' + (json.error ? json.error.message : 'Unknown error'));
          }
        } catch (err) {
          jsonResponse.textContent = '// Network or execution error: ' + err.message;
        } finally {
          generateBtn.disabled = false;
          generateBtn.textContent = '⚡ Generate Live QR';
        }
      }

      generateBtn.addEventListener('click', generateLive);

      // Download handler
      downloadBtn.addEventListener('click', () => {
        if (!lastResult || !lastResult.data || !lastResult.data.dataUri) {
          alert('Please generate a QR code first');
          return;
        }
        const link = document.createElement('a');
        link.href = lastResult.data.dataUri;
        link.download = 'qrforge-' + Date.now() + '.' + lastResult.data.format;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });

      // Copy payload string
      copyPayloadBtn.addEventListener('click', () => {
        if (!lastResult || !lastResult.data || !lastResult.data.payloadString) {
          alert('Please generate a QR code first');
          return;
        }
        navigator.clipboard.writeText(lastResult.data.payloadString)
          .then(() => alert('Payload string copied to clipboard!'))
          .catch(() => alert('Failed to copy to clipboard'));
      });

      // Initial auto-generate on load
      generateLive();
    })();
  </script>
</body>
</html>`;
}
