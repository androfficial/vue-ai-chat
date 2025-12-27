import type {
  ApiConfig,
  ApiMessage,
  ApiResponse,
  ChatCompletionRequest,
  ChatCompletionResponse,
} from '@/types';

import { apiRequest } from './client';
import { getErrorCode, isApiErrorCode } from './errors';
import { processStream } from './stream';

/**
 * Build chat completion request body for Cerebras
 */
function buildRequestBody(
  config: ApiConfig,
  messages: ApiMessage[],
  stream: boolean,
): ChatCompletionRequest {
  return {
    max_tokens: config.maxTokens,
    messages,
    model: config.model,
    stream,
    temperature: config.temperature,
    top_p: config.topP,
  };
}

/**
 * Send non-streaming chat completion request to Cerebras API
 */
export async function sendChatCompletion(
  config: ApiConfig,
  messages: ApiMessage[],
): Promise<ApiResponse<ChatCompletionResponse>> {
  try {
    const requestBody = buildRequestBody(config, messages, false);
    const response = await apiRequest(
      { apiKey: config.apiKey, baseUrl: config.baseUrl },
      '/chat/completions',
      requestBody,
    );
    const data = (await response.json()) as ChatCompletionResponse;

    return {
      data,
      success: true,
    };
  } catch (error) {
    const errorCode =
      error instanceof Error && isApiErrorCode(error.message) ? error.message : getErrorCode(error);
    return {
      error: errorCode,
      success: false,
    };
  }
}

/**
 * Send streaming chat completion request to Cerebras API
 */
export async function sendStreamingChatCompletion(
  config: ApiConfig,
  messages: ApiMessage[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  try {
    const requestBody = buildRequestBody(config, messages, true);
    const response = await apiRequest(
      { apiKey: config.apiKey, baseUrl: config.baseUrl },
      '/chat/completions',
      requestBody,
      signal,
    );

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    await processStream(reader, onChunk, onComplete);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return;
      }
      if (isApiErrorCode(error.message)) {
        onError(error.message);
      } else {
        onError(getErrorCode(error));
      }
    } else {
      onError('unknown');
    }
  }
}

/**
 * Test API connection by sending a minimal request
 */
export async function testApiConnection(config: ApiConfig): Promise<ApiResponse<boolean>> {
  try {
    const result = await sendChatCompletion(config, [{ content: 'Hello', role: 'user' }]);

    if (result.success) {
      return { data: true, success: true };
    }

    return { error: result.error, success: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Connection test failed';
    return { error: message, success: false };
  }
}
