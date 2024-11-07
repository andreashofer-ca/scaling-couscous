import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Mock, vi, describe, beforeEach, afterEach, it, expect } from 'vitest'
import { getConfig } from 'api/Config'
import { ConfigContext, useConfig } from 'hooks/config/useConfig'
import config from 'test/config'
import { renderHook, waitFor } from 'test-utils/testUtils'
import { ReactNode } from 'react'

vi.mock('api/Config')
const mockedConfig = getConfig as Mock

describe('use config', () => {
  let queryClient: QueryClient
  let wrapper: ({ children }: { children: ReactNode }) => JSX.Element

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    wrapper = ({ children }) => (
      <ConfigContext.Provider value={config}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ConfigContext.Provider>
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  describe('when loaded', () => {
    beforeEach(() => {
      mockedConfig.mockResolvedValue({ value: 'value' })
    })

    it('should return data', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper })

      await waitFor(() => expect(result.current.isPending).toBe(false))
      const { data } = result.current

      expect(getConfig).toHaveBeenCalled()
      expect(data).toMatchObject({ value: 'value' })
    })

    it('should not be error', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper })

      await waitFor(() => expect(result.current.isPending).toBe(false))
      const { isError } = result.current
      expect(isError).toBe(false)
    })

    it('should return not prod destination', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper })

      await waitFor(() => expect(result.current.isPending).toBe(false))
      const { data } = result.current

      expect(getConfig).toHaveBeenCalledWith('/config/local.config.json')
      expect(data).toMatchObject({ value: 'value' })
    })
  })

  describe('when pending', () => {
    beforeEach(() => {
      mockedConfig.mockReturnValue(
        new Promise((resolve) => {
          setTimeout(resolve, 2000)
        }),
      )
    })

    it('should return pending', () => {
      const { result } = renderHook(() => useConfig(), { wrapper })

      const { isPending } = result.current
      expect(isPending).toBe(true)
    })
  })

  describe('when error', () => {
    let originalErrorLog: any
    beforeEach(() => {
      // Ignore the error log as we test for an expected error here
      originalErrorLog = console.error
      console.error = () => null
      mockedConfig.mockRejectedValue(new Error('boom'))
    })

    afterEach(() => {
      console.error = originalErrorLog
    })

    it('should return error', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper })
      await waitFor(() => expect(result.current.isPending).toBe(false))
      const { isError } = result.current
      expect(isError).toBe(true)
    })
  })

  describe('check destination for prod env', () => {
    beforeEach(() => {
      import.meta.env.NODE_ENV = 'production'
      mockedConfig.mockResolvedValue({ value: 'value' })
    })

    it('should return prod destination', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper })

      await waitFor(() => expect(result.current.isPending).toBe(false))
      const { data } = result.current

      expect(getConfig).toHaveBeenCalledWith('/config/config.json')
      expect(data).toMatchObject({ value: 'value' })
    })
  })
})
