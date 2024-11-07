import { useAuth } from 'react-oidc-context'
import { Mock, vi, describe, beforeEach, afterEach, test, expect, it } from 'vitest'
import PendingScreen from 'components/ui/screens/PendingScreen'
import { render, screen } from 'test-utils/testUtils'
import AuthenticationWrapper from 'components/ui/authentication/AuthenticationWrapper'

vi.mock('components/ui/screens/PendingScreen')
const mockedPendingScreen = PendingScreen as Mock
vi.mock('react-oidc-context')
const mockedUseAuth = useAuth as Mock
const mockSigninRedirect = vi.fn()
const mockSignoutRedirect = vi.fn()
const mockSigninSilent = vi.fn()
const mockAddSilentRenewError = vi.fn()
const mockAddAccessTokenExpired = vi.fn()

const userData = {
  access_token: '123',
  profile: {
    given_name: 'Test',
    family_name: 'Test',
    name: 'Test Test',
  },
}

describe('AuthenticationWrapper', () => {
  beforeEach(() => {
    mockedPendingScreen.mockReturnValue(<div data-testid="PendingScreen" />)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('when the user is not authenticated', () => {
    mockedUseAuth.mockReturnValue({
      isLoading: false,
      user: null,
      signinRedirect: mockSigninRedirect,
      signoutRedirect: mockSignoutRedirect,
      signinSilent: mockSigninSilent,
      events: {
        addSilentRenewError: mockAddSilentRenewError,
        addAccessTokenExpired: mockAddAccessTokenExpired,
      },
    })

    render(
      <AuthenticationWrapper>
        <div data-testid="Children" />
      </AuthenticationWrapper>,
    )

    expect(mockSigninRedirect).toHaveBeenCalled()
    expect(localStorage.redirectUri).toEqual(window.location.href)
  })
  test('when the user is authenticated', () => {
    mockedUseAuth.mockReturnValue({
      isLoading: false,
      user: userData,
      signinRedirect: mockSigninRedirect,
      signoutRedirect: mockSignoutRedirect,
      signinSilent: mockSigninSilent,
      events: {
        addSilentRenewError: mockAddSilentRenewError,
        addAccessTokenExpired: mockAddAccessTokenExpired,
      },
    })

    render(
      <AuthenticationWrapper>
        <div data-testid="Children" />
      </AuthenticationWrapper>,
    )

    const children = screen.getByTestId('Children')
    expect(children).toBeInTheDocument()
  })
  test('when the authentication is in progress', () => {
    mockedUseAuth.mockReturnValue({
      isLoading: true,
      user: null,
      signinRedirect: mockSigninRedirect,
      signoutRedirect: mockSignoutRedirect,
      signinSilent: mockSigninSilent,
      events: {
        addSilentRenewError: mockAddSilentRenewError,
        addAccessTokenExpired: mockAddAccessTokenExpired,
      },
    })

    const { container, getByTestId } = render(
      <AuthenticationWrapper>
        <div data-testid="Children" />
      </AuthenticationWrapper>,
    )

    expect(container).toMatchSnapshot()
    expect(getByTestId('PendingScreen')).toBeInTheDocument()
  })

  test('when the activeNavigator is in signinSilent', () => {
    mockedUseAuth.mockReturnValue({
      isLoading: true,
      activeNavigator: 'signinSilent',
      user: null,
      signinRedirect: mockSigninRedirect,
      signoutRedirect: mockSignoutRedirect,
      signinSilent: mockSigninSilent,
      events: {
        addSilentRenewError: mockAddSilentRenewError,
        addAccessTokenExpired: mockAddAccessTokenExpired,
      },
    })

    const { getByTestId } = render(
      <AuthenticationWrapper>
        <div data-testid="Children" />
      </AuthenticationWrapper>,
    )

    expect(getByTestId('PendingScreen')).toBeInTheDocument()
  })

  test('when the activeNavigator is in signoutRedirect', () => {
    mockedUseAuth.mockReturnValue({
      isLoading: true,
      activeNavigator: 'signoutRedirect',
      user: null,
      signinRedirect: mockSigninRedirect,
      signoutRedirect: mockSignoutRedirect,
      signinSilent: mockSigninSilent,
      events: {
        addSilentRenewError: mockAddSilentRenewError,
        addAccessTokenExpired: mockAddAccessTokenExpired,
      },
    })

    const { getByTestId } = render(
      <AuthenticationWrapper>
        <div data-testid="Children" />
      </AuthenticationWrapper>,
    )

    expect(getByTestId('PendingScreen')).toBeInTheDocument()
  })
})

describe('when the token expires', () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      isLoading: true,
      user: userData,
      signinRedirect: mockSigninRedirect,
      signoutRedirect: mockSignoutRedirect,
      signinSilent: mockSigninSilent,
      events: {
        addSilentRenewError: mockAddSilentRenewError,
        addAccessTokenExpired: mockAddAccessTokenExpired,
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('for a successful refresh', () => {
    it('should call silentSignin for a refresh', async () => {
      mockSigninSilent.mockResolvedValue({})

      render(
        <AuthenticationWrapper>
          <div data-testid="Children" />
        </AuthenticationWrapper>,
      )

      expect(mockAddAccessTokenExpired).toHaveBeenCalled()
      const callback = mockAddAccessTokenExpired.mock.calls[0][0]
      await callback()

      expect(mockSigninSilent).toHaveBeenCalled()
      expect(mockSignoutRedirect).not.toHaveBeenCalled()
    })
  })
  describe('for an unsuccessful refresh', () => {
    it('should sign out', async () => {
      mockSigninSilent.mockRejectedValue(new Error('test message error'))

      render(
        <AuthenticationWrapper>
          <div data-testid="Children" />
        </AuthenticationWrapper>,
      )

      expect(mockAddAccessTokenExpired).toHaveBeenCalled()
      const callback = mockAddAccessTokenExpired.mock.calls[0][0]
      await callback()

      // Ensure all promises are resolved
      await new Promise(setImmediate)

      expect(mockSigninSilent).toHaveBeenCalled()
      expect(mockSignoutRedirect).toHaveBeenCalled()
    })
  })
})

describe('when is the silentRenew error', () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      isLoading: true,
      user: userData,
      signinRedirect: mockSigninRedirect,
      signoutRedirect: mockSignoutRedirect,
      signinSilent: mockSigninSilent,
      events: {
        addSilentRenewError: mockAddSilentRenewError,
        addAccessTokenExpired: mockAddAccessTokenExpired,
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('for a successful signinSilent', () => {
    it('should call silentSignin once again', async () => {
      mockSigninSilent.mockResolvedValue({})

      render(
        <AuthenticationWrapper>
          <div data-testid="Children" />
        </AuthenticationWrapper>,
      )

      expect(mockAddSilentRenewError).toHaveBeenCalled()
      const callback = mockAddSilentRenewError.mock.calls[0][0]
      await callback()

      expect(mockSigninSilent).toHaveBeenCalled()
      expect(mockSignoutRedirect).not.toHaveBeenCalled()
    })
  })
  describe('for an unsuccessful signinSilent', () => {
    it('should sign out', async () => {
      mockSigninSilent.mockRejectedValue(new Error('test message error'))

      render(
        <AuthenticationWrapper>
          <div data-testid="Children" />
        </AuthenticationWrapper>,
      )

      expect(mockAddSilentRenewError).toHaveBeenCalled()
      const callback = mockAddSilentRenewError.mock.calls[0][0]
      await callback()

      // Ensure all promises are resolved
      await new Promise(setImmediate)

      expect(mockSigninSilent).toHaveBeenCalled()
      expect(mockSignoutRedirect).toHaveBeenCalled()
    })
  })
})
