# @junipr/sdk

Official Node.js/TypeScript SDK for the [Junipr](https://junipr.io) API. Take screenshots, generate PDFs, and extract metadata from any web page.

- Zero dependencies (native `fetch`)
- Full TypeScript types
- ESM + CommonJS
- Node.js 18+

## Installation

```bash
npm install @junipr/sdk
```

## Quick Start

```typescript
import { Junipr } from "@junipr/sdk";

const junipr = new Junipr("jnpr_your_api_key");
```

## Screenshots

Capture a screenshot of any web page. Returns raw image bytes as a `Buffer`.

```typescript
import { writeFileSync } from "fs";

const image = await junipr.screenshot({
  url: "https://example.com",
  width: 1280,
  height: 720,
  format: "png",
  full_page: true,
});

writeFileSync("screenshot.png", image);
```

**All options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string` | *required* | URL to screenshot |
| `width` | `number` | `1280` | Viewport width (320-3840) |
| `height` | `number` | `720` | Viewport height (240-2160) |
| `format` | `'png' \| 'jpeg' \| 'webp'` | `'png'` | Image format |
| `quality` | `number` | `80` | Image quality (1-100) |
| `full_page` | `boolean` | `false` | Capture full scrollable page |
| `block_banners` | `boolean` | `false` | Block cookie/consent banners |
| `wait_for` | `string` | — | CSS selector to wait for |
| `delay` | `number` | — | Delay after load in ms (0-10000) |
| `device` | `'desktop' \| 'mobile' \| 'tablet'` | — | Device preset |
| `cache` | `boolean` | `true` | Use cached result |

## PDFs

Generate a PDF from a URL or raw HTML. Returns raw PDF bytes as a `Buffer`.

```typescript
// From a URL
const pdf = await junipr.pdf({
  url: "https://example.com",
  format: "A4",
  print_background: true,
});

writeFileSync("page.pdf", pdf);

// From raw HTML
const invoice = await junipr.pdf({
  html: "<h1>Invoice #1234</h1><p>Amount: $99.00</p>",
  format: "Letter",
  margin: { top: "1in", bottom: "1in", left: "0.75in", right: "0.75in" },
});

writeFileSync("invoice.pdf", invoice);
```

**All options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string` | — | URL to render (url or html required) |
| `html` | `string` | — | Raw HTML to render (url or html required) |
| `format` | `'A4' \| 'Letter' \| 'Legal' \| 'Tabloid' \| 'A3' \| 'A5'` | `'A4'` | Paper size |
| `margin` | `object` | — | Page margins (`top`, `right`, `bottom`, `left`) |
| `landscape` | `boolean` | `false` | Landscape orientation |
| `print_background` | `boolean` | `false` | Print background graphics |
| `header` | `string` | — | HTML header template |
| `footer` | `string` | — | HTML footer template |
| `cache` | `boolean` | `true` | Use cached result |

## Metadata

Extract title, description, Open Graph, Twitter Card, favicons, and structured data from any URL.

```typescript
const meta = await junipr.metadata({ url: "https://example.com" });

console.log(meta.title);            // "Example Domain"
console.log(meta.og.image);         // "https://example.com/og.png"
console.log(meta.twitter.card);     // "summary_large_image"
console.log(meta.structured_data);  // [{ "@type": "WebPage", ... }]
```

## Free API Key

Request a free API key by email (no authentication required):

```typescript
import { Junipr } from "@junipr/sdk";

// No API key needed for this endpoint
const junipr = new Junipr("unused");
const result = await junipr.requestFreeKey({ email: "you@example.com" });
console.log(result.message); // "API key sent to you@example.com"
```

## Configuration

```typescript
const junipr = new Junipr({
  apiKey: "jnpr_your_api_key",
  baseUrl: "https://your-self-hosted-instance.com", // optional
  timeout: 60000, // optional, default 30000ms
});
```

## Error Handling

All API errors throw a `JuniprError` with structured fields:

```typescript
import { Junipr, JuniprError } from "@junipr/sdk";

try {
  await junipr.screenshot({ url: "not-a-url" });
} catch (err) {
  if (err instanceof JuniprError) {
    console.log(err.code);      // "INVALID_URL"
    console.log(err.message);   // "The provided URL is not valid"
    console.log(err.requestId); // "req_abc123"
    console.log(err.status);    // 400
    console.log(err.retryable); // false — whether it's safe to retry
  }
}
```

You can also check `err.retryable` to implement automatic retry logic for transient errors (e.g. `TIMEOUT`, `RATE_LIMITED`).

## License

MIT
