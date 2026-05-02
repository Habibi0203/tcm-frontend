/**
 * Thin API client. All backend calls go through Next.js rewrites → backend.
 * Server-side fetches (server components) use BACKEND_URL directly.
 */

export const API_BASE = '/api';

export type ApiOk<T> = { success: true; data: T; meta?: PaginationMeta };
export type ApiErr    = { success: false; error: { code: string; message: string; fields?: Record<string, string> } };
export type ApiResult<T> = ApiOk<T> | ApiErr;

export type PaginationMeta = {
  page: number; per_page: number; total: number; total_pages: number;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  token?: string;
  body?: unknown;
}

async function parseApiResult<T>(res: Response): Promise<ApiResult<T>> {
  const text = await res.text();
  try {
    return JSON.parse(text) as ApiResult<T>;
  } catch {
    return { success: false, error: { code: 'PARSE_ERROR', message: text || res.statusText } };
  }
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    });
    const parsed = await parseApiResult<{ access_token: string }>(res);
    if (!parsed.success || !parsed.data?.access_token) return null;

    if (typeof window !== 'undefined') {
      const { useAuthStore } = await import('@/store/authStore');
      useAuthStore.getState().setToken(parsed.data.access_token);
    }

    return parsed.data.access_token;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<ApiResult<T>> {
  const { token, headers: extraHeaders, body, ...rest } = options;

  const request = async (tokenOverride?: string | null) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(tokenOverride ? { Authorization: `Bearer ${tokenOverride}` } : {}),
      ...(extraHeaders as Record<string, string> ?? {}),
    };

    return fetch(`${API_BASE}${path}`, {
      ...rest,
      credentials: 'same-origin',
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    });
  };

  try {
    let res = await request(token);

    if (res.status === 401 && token) {
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        res = await request(refreshedToken);
      } else if (typeof window !== 'undefined') {
        const { useAuthStore } = await import('@/store/authStore');
        useAuthStore.getState().logout();
        return { success: false, error: { code: 'UNAUTHORIZED', message: 'Sesi login habis. Silakan masuk lagi.' } };
      }
    }

    return parseApiResult<T>(res);
  } catch (e) {
    return { success: false, error: { code: 'NETWORK_ERROR', message: String(e) } };
  }
}

/** Server-side fetch (used in async server components) — calls backend directly */
export async function serverFetch<T>(
  path: string,
  options: RequestInit & { token?: string; next?: { revalidate?: number | false; tags?: string[] } } = {}
): Promise<ApiResult<T>> {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3001';
  const { token, headers: extraHeaders, next, ...rest } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders as Record<string, string> ?? {}),
  };
  try {
    const fetchOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
      ...rest,
      headers,
    };

    if (next) {
      fetchOptions.next = next;
    } else if (rest.cache !== 'no-store') {
      fetchOptions.next = { revalidate: 60 };
    }

    const res = await fetch(`${backendUrl}/api${path}`, fetchOptions);
    const json = await res.json() as ApiResult<T>;
    return json;
  } catch (e) {
    return { success: false, error: { code: 'NETWORK_ERROR', message: String(e) } };
  }
}
