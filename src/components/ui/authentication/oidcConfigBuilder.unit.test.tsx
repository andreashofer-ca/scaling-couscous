import { WebStorageStateStore } from 'oidc-client-ts'
import { vi, describe, it, expect } from 'vitest'
import buildOidcConfiguration from 'components/ui/authentication/oidcConfigBuilder'

vi.mock('oidc-client-ts', async () => ({
  ...(await vi.importActual('oidc-client-ts')),
  WebStorageStateStore: vi.fn(),
}))

const config = {
  clientId: 'uid',
  authority: 'authority',
  scope: 'scope',
  store: 'local',
}

describe('the oidc configuration builder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return the oidc configuration', () => {
    const oidcConfigWithUriAndDefaults = buildOidcConfiguration(config)

    expect(oidcConfigWithUriAndDefaults.userManager?.settings.authority).toEqual(config.authority)
    expect(oidcConfigWithUriAndDefaults.userManager?.settings.client_id).toEqual(config.clientId)
    expect(oidcConfigWithUriAndDefaults.userManager?.settings.redirect_uri).toBeDefined()
    expect(oidcConfigWithUriAndDefaults.userManager?.settings.response_type).toEqual('code')
    expect(oidcConfigWithUriAndDefaults.userManager?.settings.scope).toEqual(config.scope)
    expect(oidcConfigWithUriAndDefaults.userManager?.settings.loadUserInfo).toBeFalsy()
    expect(oidcConfigWithUriAndDefaults.userManager?.settings.automaticSilentRenew).toBeTruthy()
    expect(oidcConfigWithUriAndDefaults.userManager?.settings.refreshTokenAllowedScope).toEqual(
      config.scope,
    )
    expect(oidcConfigWithUriAndDefaults.userManager?.constructor.name).toEqual('UserManager')
  })

  it('should use the configured session store to setup the usermanager', () => {
    buildOidcConfiguration({ ...config, store: 'session' })

    expect(WebStorageStateStore).toHaveBeenCalledWith({ store: sessionStorage })
  })

  it('should use the configured local store to setup the usermanager', () => {
    buildOidcConfiguration({ ...config, store: 'local' })

    expect(WebStorageStateStore).toHaveBeenCalledWith({ store: localStorage })
  })

  it('should use localstore if the store option is neither session nor local', () => {
    buildOidcConfiguration({ ...config, store: 'non-existing-store' })

    expect(WebStorageStateStore).toHaveBeenCalledWith({ store: localStorage })
  })

  describe('missing config properties', () => {
    it('should throw clientId error when clientId is missing', () => {
      expect(() =>
        buildOidcConfiguration({
          ...config,
          clientId: undefined,
        } as any),
      ).toThrowError('clientId')
    })

    it('should throw authority error when authority is missing', () => {
      expect(() =>
        buildOidcConfiguration({
          ...config,
          authority: undefined,
        } as any),
      ).toThrowError('authority')
    })

    it('should throw scope error when scope is missing', () => {
      expect(() =>
        buildOidcConfiguration({
          ...config,
          scope: undefined,
        } as any),
      ).toThrowError('scope')
    })
  })
})
