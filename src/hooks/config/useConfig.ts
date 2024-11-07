import { createContext } from 'react'
import { getConfig } from 'api/Config'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook API for accessing the configuration
 * @returns {{isPending: boolean, isError: boolean, data: <config object>}}
 */
export const useConfig = () => {
  const destination =
    import.meta.env.NODE_ENV === 'production' ? '/config/config.json' : '/config/local.config.json'

  const { data, isPending, isError } = useQuery<any>({
    queryKey: ['config'],
    queryFn: async () => getConfig(destination),
    staleTime: Infinity,
    refetchInterval: false,
  })

  return { data, isPending, isError }
}

export const ConfigContext = createContext({})
