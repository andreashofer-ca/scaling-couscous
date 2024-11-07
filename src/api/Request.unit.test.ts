import axios from 'axios'
import { Mock, Mocked, vi, describe, beforeEach, it, expect } from 'vitest'
import { getConfig } from 'api/Config'
import Request from 'api/Request'

vi.mock('api/Config')
const mockedConfig = getConfig as Mock

vi.mock('axios')
const mockedAxios = axios as Mocked<typeof axios>

describe('Request', () => {
  const mockBody = { a: 'a' }
  const mockUrl = 'https://baseurl.com'
  const mockAccessToken = 'mockAccessToken'

  beforeEach(() => {
    mockedConfig.mockResolvedValue({ baseUrl: mockUrl })
  })

  describe('when executing successful GET request', () => {
    beforeEach(() => {
      mockedAxios.get.mockImplementation(() => Promise.resolve({ data: mockBody }))
    })

    it('should return expected response for path and access token', async () => {
      const relativePath = '/mockRelativePath'
      const { data } = await Request.get(relativePath, mockAccessToken)
      expect(mockedAxios.get).toHaveBeenCalledWith(mockUrl + relativePath, {
        headers: { Authorization: `Bearer ${mockAccessToken}` },
      })
      expect(data).toEqual({ a: 'a' })
    })

    it('should call getConfig function to retrieve baseUrl', async () => {
      await Request.get('', mockAccessToken)
      expect(getConfig).toHaveBeenCalled()
    })
  })
})
