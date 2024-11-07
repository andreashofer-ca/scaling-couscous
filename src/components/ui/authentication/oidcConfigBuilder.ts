import { UserManager, WebStorageStateStore } from 'oidc-client-ts'
import { AuthProviderProps } from 'react-oidc-context'

const mapStoreToStorage = (store: string) => (store === 'local' ? localStorage : sessionStorage)

const onSigninCallback = (): void => {
  window.history.replaceState({}, document.title, window.location.pathname)
  delete localStorage.redirectUri
}

const buildOidcConfiguration = (oidcConfig: {
  clientId: string
  authority: string
  scope: string
  store: string
}): AuthProviderProps => {
  if (!oidcConfig.clientId) throw new Error('clientId')
  if (!oidcConfig.authority) throw new Error('authority')
  if (!oidcConfig.scope) throw new Error('scope')
  if (!oidcConfig.store || (oidcConfig.store !== 'local' && oidcConfig.store !== 'session')) {
    oidcConfig.store = 'local'
  }
  return {
    userManager: new UserManager({
      authority: oidcConfig.authority,
      client_id: oidcConfig.clientId,
      redirect_uri: `${window.location.origin}/`,
      post_logout_redirect_uri: `${window.location.origin}/`,
      automaticSilentRenew: true,
      refreshTokenAllowedScope: oidcConfig.scope,
      response_type: 'code',
      scope: oidcConfig.scope,
      loadUserInfo: false,
      userStore: new WebStorageStateStore({ store: mapStoreToStorage(oidcConfig.store) }),
    }),
    onSigninCallback,
  }
}

export default buildOidcConfiguration
