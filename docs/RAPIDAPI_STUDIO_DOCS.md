# QRForge API — RapidAPI Hub Documentation

> **Smart QR Code, Custom Branding & Multi-Protocol Payload Generator**  
> Ultra-fast (<5ms), 100% in-memory microservice engineered for high-throughput, mission-critical applications.

---

## ⚡ 1. Overview & Value Proposition

**QRForge API** is an enterprise-grade, deterministic QR code synthesis engine built for developers, SaaS platforms, and enterprise workflows that demand instant barcode generation without infrastructure bloat.

### Why QRForge API Outperforms Traditional QR Generators:
- **Sub-5ms In-Memory Synthesis**: Every QR code is synthesized directly in RAM within V8 memory buffers. Zero local disk I/O, zero cloud bucket write latencies (e.g., S3/GCS), and zero database locks.
- **Zero Native Canvas Dependencies**: Standard Node.js QR tools often depend on `node-canvas` (Cairo, Pango, Python build tools), which cause container crashes, memory leaks, and cold-start latency. QRForge uses pure mathematical vector computation.
- **Crisp SVG & Lossless PNG**: Produces infinitely scalable, print-ready SVG vector markup (`image/svg+xml`) and optimized Base64 PNG Data URIs (`image/png`).
- **Automated Error Correction Level (ECL) Promotion**: When a centered branding badge is requested (`centerBadgeText`), QRForge automatically upgrades the Error Correction Level to **Level H (30% Reed-Solomon data restoration)**. This ensures that even with a center label, the QR code remains 100% scannable by all iOS, Android, and industrial handheld scanners.
- **Parallel Batch Engine**: Generate up to 25 completely customized QR codes in parallel in a single atomic HTTP request with per-item status tracking.

---

## 🎮 2. Interactive Live Playground

Experience QRForge API directly in your browser before writing code. Our production deployment hosts an interactive studio equipped with live template pickers, real-time color selectors, badge injection, and instant downloads:

👉 **[Launch QRForge Live Playground](https://qrforge-api-production-2a50.up.railway.app)**

> [!NOTE]
> The playground is powered by the `/v1/demo` endpoint, allowing you to test payload structures and visual branding live without configuring API keys.

---

## 🛠️ 3. Smart Payload Specifications & JSON Reference

QRForge API eliminates the need to manually construct complex barcode strings. Pass structured JSON, and the engine validates, sanitizes, and escapes characters according to ZXing, RFC, and BIP standards.

| `type` | Description | Required Fields | Optional Fields | Formatted Output Standard |
|---|---|---|---|---|
| `url` | Web URL or deep link | `data` (string or `{ url }`) | — | Raw URI string (`https://...`) |
| `text` | Plain text / arbitrary string | `data` (string or `{ text }`) | — | Plain text string |
| `wifi` | Wi-Fi network credential auto-join | `ssid` | `password`, `encryption` (`WPA`/`WEP`/`nopass`), `hidden` (`true`/`false`) | `WIFI:T:WPA;S:SSID;P:PASS;H:false;;` (escapes `;`, `:`, `\`, `,`, `"`) |
| `whatsapp` | WhatsApp click-to-chat link | `phone` (with country code) | `message` | `https://wa.me/<digits>?text=<encoded>` |
| `vcard` | Electronic business contact card | `firstName` or `lastName` or `org` | `phone`, `email`, `title`, `url` | Standards-compliant `vCard 3.0` |
| `email` | Pre-addressed email message | `to` | `subject`, `body` | RFC 6068 `mailto:<to>?subject=...&body=...` |
| `sms` | Direct SMS dispatch | `phone` | `message` | `SMSTO:<phone>:<message>` |
| `crypto` | Cryptocurrency payment request | `address` | `currency` (`bitcoin`, `ethereum`, `solana`, etc.), `amount`, `message` | BIP21 / EIP681 URI (e.g., `bitcoin:<addr>?amount=...`) |
| `event` | Calendar appointment | `title`, `start`, `end` | `location`, `description` | RFC 5545 iCalendar `BEGIN:VEVENT` with UTC timestamps |

---

## 🎨 4. Branding & Visual Options Reference

All styling properties are passed inside the optional `options` object:

| Parameter | Type | Default | Accepted Values | Description |
|---|---|---|---|---|
| `format` | string | `"svg"` | `"svg"`, `"png"` | Output graphic format. SVG returns raw XML string and Data URI; PNG returns Data URI. |
| `width` | integer | `400` | `128` to `2048` | Dimension in pixels (width and height are 1:1 square). |
| `margin` | integer | `2` | `0` to `10` | Quiet zone margin around the QR matrix (in modules). |
| `darkColor` | string | `"#0F172A"` | 6-digit hex code (`#RRGGBB`) | Foreground / data module color. |
| `lightColor` | string | `"#FFFFFF"` | 6-digit hex code (`#RRGGBB`) | Background / canvas color. |
| `errorCorrectionLevel` | string | `"M"` | `"L"`, `"M"`, `"Q"`, `"H"` | Reed-Solomon data recovery level: L (7%), M (15%), Q (25%), H (30%). Auto-promoted to `H` if `centerBadgeText` is set. |
| `centerBadgeText` | string | `null` | 1 to 6 characters (e.g. `"WIFI"`, `"VIP"`, `"PAY"`) | Centered badge with contrasting background, border, and bold typography (SVG format). |

---

## 🔌 5. Endpoint Documentation & JSON Schemas

### Endpoint 1: `POST /v1/generate`

Synthesizes a single QR code with chosen payload and branding.

#### Request Example (Wi-Fi Access Point with Centered Badge)

```json
{
  "type": "wifi",
  "data": {
    "ssid": "Skyline_Lounge_5G",
    "password": "UltraSecurePass;2026",
    "encryption": "WPA",
    "hidden": false
  },
  "options": {
    "format": "svg",
    "width": 500,
    "margin": 2,
    "darkColor": "#0F172A",
    "lightColor": "#FFFFFF",
    "centerBadgeText": "WIFI"
  }
}
```

#### Response Example (`200 OK`)

```json
{
  "success": true,
  "data": {
    "type": "wifi",
    "payloadString": "WIFI:T:WPA;S:Skyline_Lounge_5G;P:UltraSecurePass\\;2026;H:false;;",
    "format": "svg",
    "mimeType": "image/svg+xml",
    "width": 500,
    "margin": 2,
    "errorCorrectionLevel": "H",
    "colors": {
      "dark": "#0F172A",
      "light": "#FFFFFF"
    },
    "hasCenterBadge": true,
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"500\" height=\"500\" viewBox=\"0 0 37 37\" shape-rendering=\"crispEdges\">...<g id=\"qrforge-center-badge\">...</g></svg>",
    "dataUri": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAi..."
  },
  "meta": {
    "execution_time_ms": 2.18,
    "timestamp": "2026-11-09T02:15:00.000Z"
  }
}
```

---

### Endpoint 2: `POST /v1/batch`

Synthesizes between 1 and 25 customized QR codes concurrently in-memory.

#### Request Example

```json
{
  "items": [
    {
      "id": "item_1",
      "type": "url",
      "data": "https://example.com/tickets/vip-001",
      "options": {
        "format": "svg",
        "centerBadgeText": "VIP",
        "darkColor": "#1E293B"
      }
    },
    {
      "id": "item_2",
      "type": "crypto",
      "data": {
        "currency": "bitcoin",
        "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        "amount": "0.025",
        "message": "Invoice 104"
      },
      "options": {
        "format": "png",
        "width": 300
      }
    }
  ]
}
```

#### Response Example (`200 OK`)

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "item_1",
      "type": "url",
      "payloadString": "https://example.com/tickets/vip-001",
      "format": "svg",
      "mimeType": "image/svg+xml",
      "width": 400,
      "margin": 2,
      "errorCorrectionLevel": "H",
      "colors": {
        "dark": "#1E293B",
        "light": "#FFFFFF"
      },
      "hasCenterBadge": true,
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\"...",
      "dataUri": "data:image/svg+xml;base64,PHN2ZyB4..."
    },
    {
      "id": "item_2",
      "type": "crypto",
      "payloadString": "bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.025&message=Invoice%20104",
      "format": "png",
      "mimeType": "image/png",
      "width": 300,
      "margin": 2,
      "errorCorrectionLevel": "M",
      "colors": {
        "dark": "#0F172A",
        "light": "#FFFFFF"
      },
      "hasCenterBadge": false,
      "svg": null,
      "dataUri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASw..."
    }
  ],
  "meta": {
    "execution_time_ms": 6.84,
    "timestamp": "2026-11-09T02:15:00.000Z"
  }
}
```

---

## 💻 6. Production Integration Code Snippets

### Node.js / JavaScript (Native Fetch)

```javascript
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'YOUR_RAPIDAPI_KEY';
const RAPIDAPI_HOST = 'qrforge-smart-qr-code-and-branded-payload-generator.p.rapidapi.com';

async function generateBrandedQR() {
  const response = await fetch(`https://${RAPIDAPI_HOST}/v1/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': RAPIDAPI_HOST
    },
    body: JSON.stringify({
      type: 'vcard',
      data: {
        firstName: 'Elena',
        lastName: 'Rostova',
        phone: '+1 (555) 234-5678',
        email: 'elena@innovate.tech',
        org: 'Innovate Systems',
        title: 'VP of Engineering'
      },
      options: {
        format: 'svg',
        darkColor: '#0F172A',
        lightColor: '#F8FAFC',
        centerBadgeText: 'SCAN'
      }
    })
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(`Generation failed: ${result.error?.message}`);
  }

  console.log(`⚡ QR Generated in ${result.meta.execution_time_ms} ms`);
  console.log(`🖼️ SVG Payload length: ${result.data.svg.length} characters`);
  console.log(`🔗 Embeddable Data URI: ${result.data.dataUri.slice(0, 60)}...`);
  return result.data;
}

generateBrandedQR().catch(console.error);
```

### Python (using `requests`)

```python
import os
import requests

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "YOUR_RAPIDAPI_KEY")
RAPIDAPI_HOST = "qrforge-smart-qr-code-and-branded-payload-generator.p.rapidapi.com"

url = f"https://{RAPIDAPI_HOST}/v1/generate"

headers = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": RAPIDAPI_HOST
}

payload = {
    "type": "whatsapp",
    "data": {
        "phone": "+1 (415) 555-0199",
        "message": "Hi! Inquiring about enterprise license pricing."
    },
    "options": {
        "format": "png",
        "width": 600,
        "darkColor": "#065F46",
        "lightColor": "#FFFFFF"
    }
}

response = requests.post(url, json=payload, headers=headers)
result = response.json()

if response.status_code == 200 and result.get("success"):
    meta = result["meta"]
    data = result["data"]
    print(f"⚡ Generated in {meta['execution_time_ms']} ms")
    print(f"📱 WhatsApp Payload: {data['payloadString']}")
    print(f"🖼️ PNG Data URI: {data['dataUri'][:50]}...")
else:
    print(f"Error {response.status_code}: {result.get('error')}")
```

### cURL

```bash
curl --request POST \
  --url "https://qrforge-smart-qr-code-and-branded-payload-generator.p.rapidapi.com/v1/generate" \
  --header "Content-Type: application/json" \
  --header "X-RapidAPI-Key: YOUR_RAPIDAPI_KEY" \
  --header "X-RapidAPI-Host: qrforge-smart-qr-code-and-branded-payload-generator.p.rapidapi.com" \
  --data '{
    "type": "crypto",
    "data": {
      "currency": "bitcoin",
      "address": "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
      "amount": "0.05",
      "message": "Order #4891"
    },
    "options": {
      "format": "svg",
      "width": 450,
      "centerBadgeText": "PAY",
      "darkColor": "#0F172A"
    }
  }'
```

---

## ❓ 7. Developer & AI Assistant FAQ

### Q1: Why is SVG preferred over PNG for professional printing and dynamic UIs?
**SVG (Scalable Vector Graphics)** produces lightweight mathematical path vectors rather than a pixel raster grid. An SVG QR code generated at 400px can be scaled to billboard or merchandise print sizes without any pixelation, blurring, or degradation. Furthermore, SVG strings can be directly embedded inline into HTML documents, emails, or PDF templates without needing separate HTTP image requests.

### Q2: How does QRForge maintain 100% scanning accuracy with center badges?
QR codes employ **Reed-Solomon error correction**, which embeds mathematical parity codewords to recover damaged or occluded modules. When you provide `centerBadgeText`, QRForge automatically upgrades the code to **Level H (30% recovery)** and bounds the badge geometry to occupy under 18% of the central matrix. This guarantees that mobile operating systems (iOS Camera, Google Lens) and industrial 2D optical imagers scan the payload instantly.

### Q3: How does the `/v1/batch` endpoint help optimize throughput and rate limits?
Instead of making 25 separate HTTP round-trips over the public internet (which incurs 25 TLS handshakes and connection overhead), `/v1/batch` allows you to send an array of up to 25 items in a single HTTP POST. QRForge processes all items in parallel using asynchronous non-blocking threads in memory, typically completing all 25 items in under 15ms.

### Q4: How are special characters escaped in Wi-Fi and vCard barcodes?
Many barcode readers fail when Wi-Fi SSIDs or passwords contain semicolons (`;`), colons (`:`), backslashes (`\`), or quotes (`"`). QRForge automatically detects and escapes these characters with leading backslashes per the ZXing barcode standard. Similarly, vCard parameters and calendar events are sanitized and formatted with strict line terminators and character encoding.

### Q5: Can I embed the output directly into an HTML `<img>` tag?
Yes! Both SVG and PNG formats return a complete `dataUri` property formatted as `data:image/svg+xml;base64,...` or `data:image/png;base64,...`. You can directly set this string as an `src` attribute:
```html
<img src="data:image/svg+xml;base64,PHN2Zy..." alt="QR Code" width="400" height="400" />
```
