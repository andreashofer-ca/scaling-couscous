import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@ui5/webcomponents-react'
import React, { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ConfigContext } from 'hooks/config/useConfig'
import config from 'test/config'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ConfigContext.Provider value={config}>
          <BrowserRouter>{children}</BrowserRouter>
        </ConfigContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

const AllTheProvidersWithoutBrowserRouter = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const customRenderWithoutBrowserRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProvidersWithoutBrowserRouter, ...options })

export * from '@testing-library/react'
export { customRender as render }

export { customRenderWithoutBrowserRouter as renderWithoutRouter }
