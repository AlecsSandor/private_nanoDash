// src/services/apiClient.ts
import { tokenService } from "./tokenService";
import { logout, setToken} from "../store/features/auth/authSlice";
import { store } from "../store/store";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const BASE_URL = process.env.REACT_APP_API_BASE_URL ?? "/api";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function callRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/shortform/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
      credentials: "include", // ✅ send refresh cookie
    });

    if (!res.ok) {
      tokenService.clear();
      store.dispatch(logout());
      return false;
    }

    const data = await res.json();
    const { access_token } = data;

    if (!access_token) return false;

    tokenService.setAccessToken(access_token);
    store.dispatch(setToken(access_token));

    return true;
  } catch (err) {
    console.error("Token refresh failed:", err);
    tokenService.clear();
    store.dispatch(logout());
    return false;
  }
}

async function ensureRefreshed(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = callRefresh().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });
  return refreshPromise;
}

export interface ApiOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  retry?: boolean; // internal usea
  skipAuth?: boolean;
}

// function buildUrl(path: string, query?: ApiOptions["query"]) {
//   const url = new URL(path, BASE_URL);
//   if (query) {
//     Object.entries(query).forEach(([k, v]) => {
//       if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
//     });
//   }
//   return url.toString();
// }

function buildUrl(path: string, query?: ApiOptions["query"]) {
  const isAbsolute = /^https?:\/\//i.test(path);

  const url = isAbsolute
    ? new URL(path)
    : new URL(path, BASE_URL);

  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v));
      }
    });
  }

  return url.toString();
}

export async function apiRequest<T = any>(
  path: string,
  { method = "GET", headers = {}, body, query, retry = true, skipAuth = false }: ApiOptions = {}
): Promise<T> {
  const url = buildUrl(path, query);
  const accessToken = tokenService.getAccessToken();
  const init: RequestInit = {
    method,
    credentials: skipAuth ? "omit" : "include",
    headers: {
      // "Content-Type": "application/json",
      //...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
      ...(skipAuth || !accessToken ? {} : { Authorization: `Bearer ${accessToken}` }),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

//   console.log("🔐 Sending request:", {
//   url,
//   headers: init.headers,
//   body,
// });

  try {
    const res = await fetch(url, init);

    if (res.status === 401 && retry && !skipAuth) {
      // Try refresh
      const ok = await ensureRefreshed();
      if (ok) {
        // retry once
        return apiRequest<T>(path, { method, headers, body, query, retry: false });
      } else {
        // token refresh failed; propagate 401
        const errText = await res.text();
        const e: any = new Error("Unauthorized");
        e.status = 401;
        e.body = errText;
        throw e;
      }
    }

    if (!res.ok) {
      const text = await res.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch { parsed = text; }
      const err: any = new Error(parsed?.message ?? res.statusText ?? "Request failed");
      err.status = res.status;
      err.body = parsed;
      throw err;
    }

    // handle empty body
    const contentType = res.headers.get("content-type");
    if (!contentType || contentType.indexOf("application/json") === -1) {
      // @ts-ignore
      return (await res.text()) as T;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error("apiRequest error:", err);
    throw err;
  }
}
