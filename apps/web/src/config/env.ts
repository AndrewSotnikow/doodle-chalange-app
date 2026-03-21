function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

export const env = {
  apiBaseUrl: trimTrailingSlash(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
  ),
  apiToken: import.meta.env.VITE_API_TOKEN || 'super-secret-doodle-token'
}
