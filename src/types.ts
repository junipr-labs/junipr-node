/** Options for taking a screenshot. */
export interface ScreenshotOptions {
  /** The URL to screenshot. */
  url: string;
  /** Viewport width in pixels (320-3840). Default: 1280. */
  width?: number;
  /** Viewport height in pixels (240-2160). Default: 720. */
  height?: number;
  /** Image format. Default: 'png'. */
  format?: "png" | "jpeg" | "webp";
  /** Image quality (1-100). Default: 80. */
  quality?: number;
  /** Capture the full scrollable page. Default: false. */
  full_page?: boolean;
  /** Block cookie/consent banners. Default: false. */
  block_banners?: boolean;
  /** Wait for this CSS selector to appear before capturing. */
  wait_for?: string;
  /** Delay in ms after page load before capturing (0-10000). */
  delay?: number;
  /** Device preset for viewport and user agent. */
  device?: "desktop" | "mobile" | "tablet";
  /** Use cached result if available. Default: true. */
  cache?: boolean;
}

/** Options for generating a PDF. */
export interface PdfOptions {
  /** The URL to render as PDF. Either url or html is required. */
  url?: string;
  /** Raw HTML to render as PDF. Either url or html is required. */
  html?: string;
  /** Paper format. Default: 'A4'. */
  format?: "A4" | "Letter" | "Legal" | "Tabloid" | "A3" | "A5";
  /** Page margins. */
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  /** Landscape orientation. Default: false. */
  landscape?: boolean;
  /** Print background graphics. Default: false. */
  print_background?: boolean;
  /** HTML template for the page header. */
  header?: string;
  /** HTML template for the page footer. */
  footer?: string;
  /** Use cached result if available. Default: true. */
  cache?: boolean;
}

/** Options for fetching page metadata. */
export interface MetadataOptions {
  /** The URL to extract metadata from. */
  url: string;
  /** Use cached result if available. Default: true. */
  cache?: boolean;
}

/** Open Graph metadata. */
export interface OgMetadata {
  title: string | null;
  description: string | null;
  image: string | null;
  type: string | null;
  site_name: string | null;
  url: string | null;
}

/** Twitter Card metadata. */
export interface TwitterMetadata {
  card: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
  site: string | null;
  creator: string | null;
}

/** Response from the metadata endpoint. */
export interface MetadataResponse {
  url: string;
  title: string | null;
  description: string | null;
  og: OgMetadata;
  twitter: TwitterMetadata;
  favicon: string | null;
  canonical: string | null;
  language: string | null;
  structured_data: unknown[];
  response_time_ms: number;
}

/** Options for requesting a free API key. */
export interface FreeKeyOptions {
  /** Email address to receive the API key. */
  email: string;
}

/** Response from the free key endpoint. */
export interface FreeKeyResponse {
  success: boolean;
  message: string;
}

/** Error response from the API. */
export interface ErrorResponse {
  error: true;
  code: string;
  message: string;
  request_id: string;
}

/** Configuration options for the Junipr client. */
export interface JuniprOptions {
  /** API key. Must start with 'jnpr_'. */
  apiKey: string;
  /** Base URL for the API. Default: 'https://api.junipr.io'. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Default: 30000. */
  timeout?: number;
}
