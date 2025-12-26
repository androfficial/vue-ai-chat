import { useApiStore } from '@/stores/api';

import { getErrorCodeFromStatus } from './errors';

/**
 * API client configuration
 */
export interface ApiClientConfig {
  apiKey: string;
  baseUrl: string;
}

/**
 * Get current API configuration from store
 */
export function getApiConfig(): ApiClientConfig {
  const apiStore = useApiStore();
  return {
    apiKey: apiStore.apiKey,
    baseUrl: apiStore.config.baseUrl,
  };
}

/**
 * Build request headers for API calls
 */
export function buildHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Unified fetch wrapper for API requests
 */
export async function apiRequest(
  endpoint: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<Response> {
  const { apiKey, baseUrl } = getApiConfig();

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
