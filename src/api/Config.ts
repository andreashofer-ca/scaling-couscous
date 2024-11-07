let configRef: Promise<object> | null = null

/**
 * Caches the config lookup served from the UI app config endpoint
 * @param destination? the URL of the config endpoint
 * @returns {Promise<object>} the resolved config
 */
export const getConfig = async (destination: string): Promise<object> => {
  if (configRef === null) {
    const readConfig = async () => {
      const response = await fetch(destination)

      if (!response.ok) {
        throw Error(`Failed to fetch config from ${destination}`)
      }
      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw Error(`Config ${destination} not in json format`)
      }
      return response.json()
    }
    configRef = readConfig()
  }
  return configRef
}

/**
 * Clears the cached config. Recommended for test usage only.
 */
export const clearConfigCache = (): void => {
  configRef = null
}
