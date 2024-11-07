import { Mock, vi, describe, afterEach, test, expect } from 'vitest'
import App from 'App'
import { useConfig } from 'hooks/config/useConfig'
import { render, screen } from 'test-utils/testUtils'

vi.mock('react-oidc-context')

vi.mock('hooks/config/useConfig')
const mockedUseConfig = useConfig as Mock

describe('App', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders pending message when config is still pending', () => {
    mockedUseConfig.mockReturnValue({
      isPending: true,
      isError: false,
      data: {},
    })

    render(<App />)

    expect(screen).toMatchSnapshot()
  })

  test('renders error message when config has failed to load', () => {
    mockedUseConfig.mockReturnValue({
      isPending: false,
      isError: true,
      data: null,
    })

    render(<App />)

    expect(screen).toMatchSnapshot()
  })

  test('renders app content when config has loaded', () => {
    mockedUseConfig.mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        baseUrl: 'http://localhost:8080/server_info',
        oidc: {
          clientId: '233',
          authority: 'https://authority-test',
          scope: 'openid profile offline_access email user.read',
          store: 'local',
        },
      },
    })

    render(<App />)

    expect(screen).toMatchSnapshot()
  })
})
