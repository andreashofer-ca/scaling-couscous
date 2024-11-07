import { useAuth } from 'react-oidc-context'
import { AccessTokenRequestResponse, DataResponse } from 'interfaces/entities'
import Request from 'api/Request'

const useAccessTokenRequest = (): AccessTokenRequestResponse => {
  const { user } = useAuth()
  if (!user) {
    // Todo: Explicit error / navigate to login page / reauthenticate?
    throw Error('Must be logged in')
  }
  const accessToken = user.access_token ?? ''

  return {
    get: (path: string): Promise<DataResponse> => Request.get(path, accessToken),
  }
}

export { useAccessTokenRequest }
