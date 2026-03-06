import { JuniprError } from "./error.js";
import type {
  ErrorResponse,
  FreeKeyOptions,
  FreeKeyResponse,
  JuniprOptions,
  MetadataOptions,
  MetadataResponse,
  PdfOptions,
  ScreenshotOptions,
} from "./types.js";

const DEFAULT_BASE_URL = "https://api.junipr.io";
const DEFAULT_TIMEOUT = 30_000;

export class Junipr {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(apiKeyOrOptions: string | JuniprOptions) {
    if (typeof apiKeyOrOptions === "string") {
      this.apiKey = apiKeyOrOptions;
      this.baseUrl = DEFAULT_BASE_URL;
      this.timeout = DEFAULT_TIMEOUT;
    } else {
      this.apiKey = apiKeyOrOptions.apiKey;
      this.baseUrl = (apiKeyOrOptions.baseUrl ?? DEFAULT_BASE_URL).replace(
        /\/$/,
        "",
      );
      this.timeout = apiKeyOrOptions.timeout ?? DEFAULT_TIMEOUT;
    }
  }

  /**
   * Take a screenshot of a web page.
   * Returns the raw image bytes as a Buffer (Node.js) or Uint8Array.
   */
  async screenshot(options: ScreenshotOptions): Promise<Buffer> {
    return this.requestBinary("POST", "/v1/screenshot", options);
  }

  /**
   * Generate a PDF from a URL or raw HTML.
   * Returns the raw PDF bytes as a Buffer (Node.js) or Uint8Array.
   */
  async pdf(options: PdfOptions): Promise<Buffer> {
    return this.requestBinary("POST", "/v1/pdf", options);
  }

  /**
   * Extract metadata (title, description, Open Graph, Twitter Card, etc.)
   * from a web page.
   */
  async metadata(options: MetadataOptions): Promise<MetadataResponse> {
    const params = new URLSearchParams({ url: options.url });
    if (options.cache !== undefined) {
      params.set("cache", String(options.cache));
    }
    return this.requestJson<MetadataResponse>(
      "GET",
      `/v1/metadata?${params.toString()}`,
    );
  }

  /**
   * Request a free API key. A key will be sent to the provided email.
   * This endpoint does not require authentication.
   */
  async requestFreeKey(options: FreeKeyOptions): Promise<FreeKeyResponse> {
    return this.requestJson<FreeKeyResponse>("POST", "/v1/keys/free", options);
  }

  // ---- Internal helpers ----

  private async request(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<Response> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      "X-API-Key": this.apiKey,
      "User-Agent": "@junipr/sdk/1.0.0",
    };

    const init: RequestInit = { method, headers };

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }

    if (this.timeout > 0) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeout);
      init.signal = controller.signal;
      try {
        const res = await fetch(url, init);
        clearTimeout(timer);
        return res;
      } catch (err) {
        clearTimeout(timer);
        if (err instanceof Error && err.name === "AbortError") {
          throw new JuniprError(
            `Request timed out after ${this.timeout}ms`,
            "TIMEOUT",
            "",
            0,
          );
        }
        throw err;
      }
    }

    return fetch(url, init);
  }

  private async handleErrorResponse(res: Response): Promise<never> {
    let body: ErrorResponse | undefined;
    try {
      body = (await res.json()) as ErrorResponse;
    } catch {
      // Response body is not JSON
    }

    throw new JuniprError(
      body?.message ?? `HTTP ${res.status}`,
      body?.code ?? "UNKNOWN",
      body?.request_id ?? "",
      res.status,
    );
  }

  private async requestJson<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const res = await this.request(method, path, body);
    if (!res.ok) {
      return this.handleErrorResponse(res);
    }
    return (await res.json()) as T;
  }

  private async requestBinary(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<Buffer> {
    const res = await this.request(method, path, body);
    if (!res.ok) {
      return this.handleErrorResponse(res);
    }
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
