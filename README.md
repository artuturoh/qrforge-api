# QRForge API — Smart QR Code, Custom Branding & Payload Generator ⚡

[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Architecture](https://img.shields.io/badge/Architecture-100%25%20In--Memory%20%7C%20%3C10ms-10B981?style=for-the-badge)](https://github.com/artuturoh/qrforge-api)
[![RapidAPI](https://img.shields.io/badge/RapidAPI-Verified%20Provider-0052CC?style=for-the-badge&logo=rapidapi)](https://rapidapi.com/artuturoh/api/qrforge-smart-qr-code-and-custom-branding-generator)
[![License](https://img.shields.io/badge/License-MIT-6366F1?style=for-the-badge)](LICENSE)

**QRForge API** is an ultra-fast (<10ms latency), 100% in-memory microservice engineered for high-throughput, mission-critical applications. It features automated smart payload builders (Wi-Fi, WhatsApp, vCard 3.0, BIP21 Crypto, iCal events), dynamic SVG/PNG rendering, custom hex color palettes, centered branding badges with auto error-correction leveling, and a high-concurrency batch engine.

---

## ⚡ Core Architecture & Engineering Highlights

- **100% In-Memory Deterministic Engine**: Zero external database dependencies, zero local disk I/O, and sub-5ms average execution latency.
- **Modern ES Modules (`"type": "module"`)**: Native ESM throughout, built for Node.js 18, 20, and 22 LTS runtimes.
- **8 Smart Payload Presets**: Translates high-level JSON objects into validated RFC/ZXing/BIP-standard barcode payload strings.
- **Center Branding Badges**: Injects crisp, scalable rounded-rectangle badges (`VIP`, `WIFI`, `PAY`, etc.) with automatic promotion to Error Correction Level `H` (30% error recovery) so codes remain 100% scannable.
- **Content-Negotiated Interactive Playground**: Accessing `/` from a browser serves a dark-mode SaaS studio; requesting `application/json` serves API metadata.
- **RapidAPI Gateway Ready**: Native `X-RapidAPI-Proxy-Secret` validation on `/v1/*` routes with a rate-limited exemption for `/v1/demo` to power live browser testing.
- **Parallel Batch Synthesis**: Generates up to 25 custom QR codes concurrently in a single HTTP request using non-blocking async execution.

---

## 📋 API Endpoints

| Method | Endpoint | Description | RapidAPI Auth Required |
|---|---|---|---|
| `GET` | `/health` | Microservice health, version, uptime, and timestamp | No |
| `GET` | `/` | Browser: Interactive Landing Page & Playground<br>API Client (`Accept: application/json`): Service metadata | No |
| `POST` | `/v1/generate` | Generate branded QR code (SVG or PNG) | Yes (when `RAPIDAPI_PROXY_SECRET` is set) |
| `POST` | `/v1/demo` | Rate-limited demo endpoint (15 req/min per IP) | No (Public Playground Exemption) |
| `POST` | `/v1/batch` | Parallel generation of up to 25 QR codes | Yes (when `RAPIDAPI_PROXY_SECRET` is set) |

---

## 🚀 Quickstart & Installation

### Local Setup

```bash
# Clone the repository
git clone https://github.com/artuturoh/qrforge-api.git
cd qrforge-api

# Install dependencies
npm install

# Start development server
npm start
```

The server binds to `http://0.0.0.0:3000`. Open `http://localhost:3000` in your browser to explore the live interactive studio!

### Running Tests

```bash
npm test
```

Runs the 36-test automated test suite using Node's built-in test runner (`node --test`) and `supertest`.

### Environment Variables

| Variable | Type | Default | Description |
|---|---|---|---|
| `PORT` | Number | `3000` | Port to bind the HTTP server to |
| `RAPIDAPI_PROXY_SECRET` | String | *(None)* | When set, enforces `X-RapidAPI-Proxy-Secret` on `/v1/generate` and `/v1/batch` |

---

## 📦 Request & Response Schemas

### 1. `POST /v1/generate`

Generates an individual QR code with custom branding and styling options.

#### Request Body Schema

```json
{
  "type": "url | text | wifi | whatsapp | vcard | email | sms | crypto | event",
  "data": "string or object depending on type",
  "options": {
    "format": "svg | png (default: svg)",
    "width": 400,
    "margin": 2,
    "darkColor": "#0F172A",
    "lightColor": "#FFFFFF",
    "errorCorrectionLevel": "L | M | Q | H (default: M, auto-upgrades to H with badge)",
    "centerBadgeText": "WIFI"
  }
}
```

#### Response Body Schema (`200 OK`)

```json
{
  "success": true,
  "data": {
    "type": "wifi",
    "payloadString": "WIFI:T:WPA;S:MyOffice;P:secret123;H:false;;",
    "format": "svg",
    "mimeType": "image/svg+xml",
    "width": 400,
    "margin": 2,
    "errorCorrectionLevel": "H",
    "colors": {
      "dark": "#0F172A",
      "light": "#FFFFFF"
    },
    "hasCenterBadge": true,
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" ...",
    "dataUri": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0..."
  },
  "meta": {
    "execution_time_ms": 2.15,
    "timestamp": "2026-11-08T20:41:47.000Z"
  }
}
```

---

## 🛠️ Smart Payload Types & Examples

### 1. Wi-Fi Access Point (`type: "wifi"`)
Automatically formats and escapes special characters (`;`, `:`, `\`, `,`, `"`) according to standard ZXing Wi-Fi QR specifications.

```json
{
  "type": "wifi",
  "data": {
    "ssid": "MyCoffeeShop_5G",
    "password": "Guest;Password:123",
    "encryption": "WPA",
    "hidden": false
  },
  "options": {
    "centerBadgeText": "WIFI",
    "darkColor": "#0284C7"
  }
}
```
**Synthesized Payload**: `WIFI:T:WPA;S:MyCoffeeShop_5G;P:Guest\;Password\:123;H:false;;`

---

### 2. WhatsApp Direct Message (`type: "whatsapp"`)
Sanitizes phone numbers and generates direct click-to-chat `https://wa.me/` URLs with pre-filled messages.

```json
{
  "type": "whatsapp",
  "data": {
    "phone": "+1 (415) 555-0199",
    "message": "Hello, I would like to book a consultation."
  }
}
```
**Synthesized Payload**: `https://wa.me/14155550199?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation.`

---

### 3. Business vCard 3.0 (`type: "vcard"`)
Generates standardized electronic business cards compatible with iOS and Android camera apps.

```json
{
  "type": "vcard",
  "data": {
    "firstName": "Sarah",
    "lastName": "Connor",
    "phone": "+15552345678",
    "email": "sarah@cyberdyne.org",
    "org": "Resistance Tech",
    "title": "Lead Engineer",
    "url": "https://example.com"
  }
}
```

---

### 4. Crypto Payment (`type: "crypto"`)
Generates BIP21 / EIP681 compatible cryptocurrency payment URIs.

```json
{
  "type": "crypto",
  "data": {
    "currency": "bitcoin",
    "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "amount": "0.0125",
    "message": "Invoice #4928"
  },
  "options": {
    "centerBadgeText": "PAY",
    "darkColor": "#D97706"
  }
}
```
**Synthesized Payload**: `bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=0.0125&message=Invoice%20%234928`

---

### 5. Calendar Event (`type: "event"`)
Builds RFC 5545 iCalendar `VEVENT` definitions.

```json
{
  "type": "event",
  "data": {
    "title": "Tech Keynote 2027",
    "location": "Moscone Center, SF",
    "start": "2027-03-15T09:00:00Z",
    "end": "2027-03-15T11:00:00Z",
    "description": "Annual System Architecture Keynote"
  }
}
```

---

### 6. Parallel Batch API (`POST /v1/batch`)
Execute up to 25 QR code requests concurrently in memory:

```json
{
  "items": [
    {
      "id": "vip_guest_1",
      "type": "url",
      "data": "https://example.com/vip/1",
      "options": { "centerBadgeText": "VIP" }
    },
    {
      "id": "office_wifi",
      "type": "wifi",
      "data": { "ssid": "HQ-Conference" }
    }
  ]
}
```

---

## 💻 Multi-Language Code Snippets

### cURL

```bash
curl -X POST "http://localhost:3000/v1/generate" \
  -H "Content-Type: application/json" \
  -H "X-RapidAPI-Proxy-Secret: YOUR_SECRET_IF_SET" \
  -d '{
    "type": "wifi",
    "data": {
      "ssid": "ExecutiveLounge",
      "password": "SecurePassword99",
      "encryption": "WPA"
    },
    "options": {
      "format": "svg",
      "width": 500,
      "darkColor": "#0F172A",
      "centerBadgeText": "WIFI"
    }
  }'
```

### Node.js (Native Fetch)

```javascript
const response = await fetch('http://localhost:3000/v1/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-RapidAPI-Proxy-Secret': process.env.RAPIDAPI_PROXY_SECRET || ''
  },
  body: JSON.stringify({
    type: 'whatsapp',
    data: {
      phone: '+14155552671',
      message: 'Order confirmation #8921'
    },
    options: {
      format: 'png',
      width: 400
    }
  })
});

const result = await response.json();
console.log('Execution time:', result.meta.execution_time_ms, 'ms');
console.log('PNG Data URI:', result.data.dataUri);
```

### Python (httpx / requests)

```python
import requests

url = "http://localhost:3000/v1/generate"
headers = {
    "Content-Type": "application/json",
    "X-RapidAPI-Proxy-Secret": "YOUR_SECRET_IF_SET"
}
payload = {
    "type": "crypto",
    "data": {
        "currency": "bitcoin",
        "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        "amount": "0.05",
        "message": "Consulting Fee"
    },
    "options": {
        "format": "svg",
        "centerBadgeText": "PAY",
        "darkColor": "#0F172A"
    }
}

res = requests.post(url, json=payload, headers=headers)
data = res.json()
print(f"Synthesized in {data['meta']['execution_time_ms']} ms")
print(f"Data URI preview: {data['data']['dataUri'][:50]}...")
```

---

## 🔒 RapidAPI Integration & Security Architecture

When deployed behind the **RapidAPI Hub Gateway**:
1. Configure `process.env.RAPIDAPI_PROXY_SECRET` in your host environment.
2. In the RapidAPI Provider Dashboard, add the matching secret under **Security > Proxy Secret**.
3. All incoming API consumer requests through RapidAPI will pass the `X-RapidAPI-Proxy-Secret` header, ensuring only authorized, billed requests reach your endpoints.
4. **Live Playground Exemption**: The `/v1/demo` endpoint allows potential customers to test live QR generation right in the landing page studio without exposing secret keys, strictly governed by a dedicated 15 req/min IP rate limiter.

---

## ❓ Frequently Asked Questions (FAQ)

### For Developers & Systems Engineers

#### 1. Why is QRForge architected with 100% in-memory processing?
Traditional QR generator APIs write images to temporary files on disk or upload them to cloud buckets (e.g., S3), introducing 50–300ms of file I/O latency, network round-trips, and disk fill issues. QRForge synthesizes pure SVG vectors and PNG buffers directly inside V8 memory buffers, reducing execution time to < 3ms and eliminating disk maintenance completely.

#### 2. How does QRForge ensure center-badged QR codes remain 100% scannable?
QR codes use Reed-Solomon error correction. When `centerBadgeText` is provided, QRForge automatically forces the error correction level to `H` (High), which provides up to 30% data recovery. The badge geometry is mathematically bounded to occupy less than 20% of the center matrix, leaving standard camera scanners able to reconstruct the QR payload with 100% accuracy.

#### 3. What is the difference between SVG and PNG formats?
- **SVG (`format: "svg"`)**: Delivers mathematical vectors in resolution-independent XML. It offers the smallest payload size, supports center branding badges, and scales infinitely for high-DPI screens or print media.
- **PNG (`format: "png"`)**: Delivers rasterized pixel buffers encoded as Base64 Data URIs (`image/png`), ideal for legacy systems or simple image viewing widgets.

#### 4. Can QRForge be deployed in serverless and containerized environments?
Yes. QRForge has zero external database dependencies and binds cleanly to `0.0.0.0` on `process.env.PORT`. It can be deployed in seconds to:
- **Docker / Kubernetes**
- **Railway / Render / Fly.io**
- **AWS ECS / Google Cloud Run / Azure Container Apps**

---

## 📄 License

MIT License. Designed and developed with ⚡ by **[artuturoh](https://github.com/artuturoh)**.
