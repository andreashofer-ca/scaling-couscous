import axios from 'axios'
import { DataResponse } from 'interfaces/entities'
import { getConfig } from 'api/Config'

/**
 * Executes request for given path and options.
 * @param path the request path
 * @returns {Promise<DataResponse>}
 */
const executeGetRequest = async (path: string, accessToken: string): Promise<DataResponse> => {
  const { baseUrl }: any = await getConfig('')

  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  }

  const response = axios.get<DataResponse>(baseUrl + path, config)
  return response
}

/**
 * Performs a GET request to the backend service API for the
 * specified path with the currently selected locale as the accept-language
 * header. Overrides for current app state are provided but not required.
 * @param path the resource path
 * @returns {Promise<DataResponse>} the JSON response
 */
const get = async (path: string, accessToken: string): Promise<DataResponse> => {
  const responseData = await executeGetRequest(path, accessToken)
  return responseData
}

// create a request API to allow for easily changing/modifying centralized
// request preparation by request type
const Request = {
  get,
}

export default Request
