import { vi, describe, it, expect, beforeEach } from 'vitest'
import { clearConfigCache, getConfig } from 'api/Config'

describe('getConfig function', () => {
  const mockConfig = {
    foo: 'bar',
    baz: 42,
  }

  beforeEach(() => {
    clearConfigCache()
  })

  it('fetches and caches the config on the first call', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockConfig),
      headers: {
        get: () => 'application/json',
      },
    }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const config = await getConfig('https://example.com/config')

    expect(fetch).toHaveBeenCalledWith('https://example.com/config')
    expect(mockResponse.json).toHaveBeenCalled()
    expect(config).toEqual(mockConfig)
    expect(fetch).toHaveBeenCalledTimes(1)

    // Call getConfig again to verify that it returns the cached config
    const cachedConfig = await getConfig('https://example.com/config')
    expect(cachedConfig).toEqual(mockConfig)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('throws an error if the response is not ok', async () => {
    const mockResponse = {
      ok: false,
    }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await expect(getConfig('https://example.com/config')).rejects.toThrowError(
      'Failed to fetch config from https://example.com/config',
    )
  })

  it('throws an error if the response is not in JSON format', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockConfig),
      headers: {
        get: () => 'text/plain',
      },
    }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await expect(getConfig('https://example.com/config')).rejects.toThrowError(
      'Config https://example.com/config not in json format',
    )
  })
})
