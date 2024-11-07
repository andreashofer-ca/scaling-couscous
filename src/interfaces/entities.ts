/**
 * Represents a basic get response
 */
export interface DataResponse {
  data?: any
  status: number
}

/**
 * Represents a response from useAccessTokenRequest
 * (/data})
 */
export interface AccessTokenRequestResponse {
  get: (path: string) => Promise<DataResponse>
}
