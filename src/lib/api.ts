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

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<ApiResult<T>> {
  const { token, headers: extraHeaders, ...rest } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders as Record<string, string> ?? {}),
  };
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
    const json = await res.json() as ApiResult<T>;
    return json;
  } catch (e) {
    return { success: false, error: { code: 'NETWORK_ERROR', message: String(e) } };
  }
}

/** Server-side fetch (used in async server components) — calls backend directly */
export async function serverFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<ApiResult<T>> {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3001';
  const { token, headers: extraHeaders, ...rest } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders as Record<string, string> ?? {}),
  };
  try {
    const res = await fetch(`${backendUrl}/api${path}`, {
      ...rest,
      headers,
      next: { revalidate: 60 },
    });
    const json = await res.json() as ApiResult<T>;
    return json;
  } catch (e) {
    return { success: false, error: { code: 'NETWORK_ERROR', message: String(e) } };
  }
}
