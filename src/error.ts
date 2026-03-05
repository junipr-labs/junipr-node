/** Error thrown when the Junipr API returns an error response. */
export class JuniprError extends Error {
  /** Always true for API errors. */
  readonly error = true;
  /** Machine-readable error code (e.g. 'INVALID_URL', 'RATE_LIMITED'). */
  readonly code: string;
  /** Unique request identifier for support/debugging. */
  readonly requestId: string;
  /** HTTP status code from the response. */
  readonly status: number;

  constructor(
    message: string,
    code: string,
    requestId: string,
    status: number,
  ) {
    super(message);
    this.name = "JuniprError";
    this.code = code;
    this.requestId = requestId;
    this.status = status;
  }
}
