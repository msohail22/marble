export interface HealthResponse {
  status: "ok" | "degraded" | "error";
  timestamp: string;
  uptime?: unknown;
  version: string;
}

export interface ReadyResponse {
  ready: boolean;
  timestamp: string;
}

export interface RootInfoResponse {
  name: string;
  version: string;
  docs: string;
}

export interface ApiErrorResponse {
  error: string;
  path: string;
  statusCode?: number;
}
