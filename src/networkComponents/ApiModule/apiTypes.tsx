// Optional: if you use json-schema types install `npm i -S json-schema`
// import { JSONSchema7 } from "json-schema";

export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export interface JSONObject { [k: string]: JSONValue; }
export interface JSONArray extends Array<JSONValue> {}

// Lightweight JSON Schema type (fallback to `any` if you don't want dependency).
// If you use `ajv` or `json-schema`, replace `JSONSchema` with `JSONSchema7`.
export type JSONSchema = any; // or import { JSONSchema7 } from "json-schema";

// -----------------------------
// API Module specific config
// -----------------------------
export interface ApiModuleConfig {
  // Basic request info
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  // Optional JSON body for non-GET requests
  body?: any;

  // Request headers (not to contain raw secrets in plaintext in persistent state if possible)
  headers?: Record<string, string>;

  // Prefer storing tokens encrypted — see ApiSecretReference below
  // example: { Authorization: "Bearer <token>" } OR a reference key like { "x-api-key": "__secret:api-1-key" }
  // You may allow the UI to mark headers with `__secret:` prefix to be resolved at runtime.
  allowInsecure?: boolean; // flag for UI / debugging (dangerous in prod)

  // Polling
  enabled?: boolean;
  refreshIntervalMs?: number | null; // null/0 = don't auto-refresh

  // Optional validation schema for response (JSON Schema). If provided, fetched data will be validated.
  responseSchema?: JSONSchema | null;

  // Optional transform hook user can set to pick a subtree from the response (JS expression or path)
  // We store as a simple path string (dot/bracket path) or a small transform spec.
  // e.g. transformPath: "data.items" or undefined
  transformPath?: string | null;

  // Optional: mapping table stored here or in modules that want to bind to this API
  // mapping: Record<string /*targetProp*/, string /*jsonPath*/>
  mapping?: Record<string, string> | null;

  // Metadata & UI hints
  name?: string;        // friendly name shown in UI
  lastTestedAt?: number | null;
}

// -----------------------------
// API module item (stored as a module in modules.items)
// -----------------------------
export interface ApiModuleItem {
  id: string;
  // type must be "api"
  type: "api";

  // position and layout like other modules (optional — API modules may be invisible)
  x?: number;
  y?: number;
  width?: number;
  height?: number;

  // human fields
  title?: string;
  subtitle?: string;

  // The actual API config
  api: ApiModuleConfig;

  // Internal status fields (do not rely on them for canonical data; they're helpful for UI)
  status?: {
    lastFetchedAt?: number | null;
    lastFetchError?: string | null;
    isFetching?: boolean;
  };

  // Last successful parsed response that passed validation/transform
  // Stored in the global api store or here (choose one).
  // Use `any` or JSONValue / JSONObject for typing.
  lastData?: JSONValue;
}

///////////////////////////////////////////////////////////
// Helper types for bindings and resolved props
///////////////////////////////////////////////////////////

/**
 * A binding points a component prop to an API value.
 * Example: { apiId: 'api-1', path: 'data.prices[0].value' }
 */
export interface DataBinding {
  apiId: string;
  path: string; // dot/bracket path into the JSON object
}

/**
 * Allow either a literal value or a binding to API data.
 * Example: values: number[] | DataBinding
 */
export type Bindable<T> = T | DataBinding;

///////////////////////////////////////////////////////////
// Optional: Api store interface (where you keep fetched results)
///////////////////////////////////////////////////////////
export interface ApiStoreShape {
  // map api module id -> latest data
  apiData: Record<string, JSONValue | undefined>;

  // status map optional
  status: Record<string, { isFetching: boolean; lastError?: string | null; lastFetchedAt?: number | null }>;

  // setters
  setApiData: (id: string, data: JSONValue | undefined) => void;
  setApiStatus: (id: string, status: Partial<ApiStoreShape["status"][string]>) => void;
}
