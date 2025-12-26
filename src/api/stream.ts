import type { StreamingChunk } from '@/types'

/**
 * Process SSE stream and extract content chunks
 */
export async function processStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk: (content: string) => void,
  onComplete: () => void,
): Promise<void> {
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    const chunk = decoder.decode(value, { stream: true })
    buffer += chunk

    // Process complete SSE events
    const lines = buffer.split('\n')
    buffer = lines.pop() || '' // Keep incomplete line in buffer

    for (const line of lines) {
      const trimmedLine = line.trim()

      if (trimmedLine === '' || trimmedLine === 'data: [DONE]') {
        if (trimmedLine === 'data: [DONE]') {
          onComplete()
          return
        }
        continue
      }

      if (trimmedLine.startsWith('data: ')) {
        try {
          const jsonData = trimmedLine.slice(6)
          const streamChunk: StreamingChunk = JSON.parse(jsonData)

          const delta = streamChunk.choices[0]?.delta
          if (delta?.content) {
            onChunk(delta.content)
          }

          // Check for finish reason
          if (streamChunk.choices[0]?.finish_reason) {
            onComplete()
            return
          }
        } catch {
          console.warn('Failed to parse streaming chunk:', trimmedLine)
        }
      }
    }
  }

  onComplete()
}
