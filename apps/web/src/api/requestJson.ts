interface ApiErrorDetail {
  field?: string
  message: string
}

interface ApiErrorPayload {
  error?: {
    message?: unknown
    timestamp?: string
  }
}

export class ApiRequestError extends Error {
  statusCode: number
  details?: ApiErrorDetail[]

  constructor(message: string, statusCode: number, details?: ApiErrorDetail[]) {
    super(message)
    this.name = 'ApiRequestError'
    this.statusCode = statusCode
    this.details = details
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeErrorDetails(value: unknown): ApiErrorDetail[] | undefined {
  if (!Array.isArray(value)) {
    return undefined
  }

  const details: ApiErrorDetail[] = []

  value.forEach((detail) => {
    if (!isRecord(detail) || typeof detail.message !== 'string') {
      return
    }

    details.push({
      ...(typeof detail.field === 'string' ? { field: detail.field } : {}),
      message: detail.message
    })
  })

  return details.length > 0 ? details : undefined
}

function normalizeErrorMessage(value: unknown) {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  const details = normalizeErrorDetails(value)
  if (details) {
    return details.map((detail) => detail.message).join(' ')
  }

  return 'Unexpected API response.'
}

export function toErrorMessage(error: unknown) {
  if (error instanceof ApiRequestError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error.'
}

export async function requestJson(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<unknown> {
  const response = await fetch(input, init)
  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? ((await response.json()) as ApiErrorPayload | unknown) : null

  if (!response.ok) {
    const errorMessage = isRecord(payload) && 'error' in payload && isRecord(payload.error)
      ? normalizeErrorMessage(payload.error.message)
      : `Request failed with status ${response.status}`
    const errorDetails = isRecord(payload) && 'error' in payload && isRecord(payload.error)
      ? normalizeErrorDetails(payload.error.message)
      : undefined

    throw new ApiRequestError(errorMessage, response.status, errorDetails)
  }

  return payload
}
