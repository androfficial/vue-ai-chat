import { getErrorCodeFromStatus } from './errors';

/**
 * API client configuration
 */
export interface ApiClientConfig {
  apiKey: string;
  baseUrl: string;
}

/**
 * Build request headers for API calls
 *
 * @param apiKey - API key for authorization
 * @returns Headers configuration
 */
export function buildHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Unified fetch wrapper for API requests
 *
 * @param config - API connection configuration
 * @param endpoint - API endpoint (e.g., '/chat/completions')
 * @param body - Request payload
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Promise with fetch Response
 */
export async function apiRequest(
  config: ApiClientConfig,
  endpoint: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<Response> {
  const { apiKey, baseUrl } = config;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    body: JSON.stringify(body),
    headers: buildHeaders(apiKey),
    method: 'POST',
    signal,
  });

  if (!response.ok) {
    const errorCode = getErrorCodeFromStatus(response.status);
    throw new Error(errorCode);
  }

  return response;
}
