// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { cleanup } from '@testing-library/react'
import ResizeObserverPolyfill from 'resize-observer-polyfill'
import { vi, afterEach, afterAll, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import 'element-internals-polyfill'
import 'i18n/setupi18n'
import '@ui5/webcomponents/dist/Assets'
import '@ui5/webcomponents-fiori/dist/Assets'
import '@ui5/webcomponents-react/dist/Assets'
import '@ui5/webcomponents-fiori/dist/illustrations/AllIllustrations'
import '@ui5/webcomponents-icons/dist/AllIcons'
import '@ui5/webcomponents-icons-tnt/dist/AllIcons'

import { TIMEOUT_DELAY } from 'shared/constants'

const setupMatchMedia = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => {
      const maxWidth = parseInt(
        /max-width:(?<maxWidth>\d+)px/.exec(query)?.groups?.maxWidth ?? '0',
        10,
      )
      const minWidth = parseInt(
        /min-width:(?<minWidth>\d+)px/.exec(query)?.groups?.minWidth ?? '0',
        10,
      )

      let matches =
        (minWidth ? minWidth <= window.innerWidth : true) &&
        (maxWidth ? window.innerWidth <= maxWidth : true)

      if (query === '(orientation: landscape)') {
        matches = window.innerWidth > window.innerHeight
      }

      return {
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }
    }),
  })
}

/* Since some components of UI5 Web Components and UI5 Web Components for React are based on the ResizeObserver API,
 * we need to add a polyfill for it.
 * SAP documentation recommendation is the resize-observer-polyfill package.
 */

window.ResizeObserver = ResizeObserverPolyfill

declare global {
  interface Window {
    ResizeObserver: any
  }
}

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

declare global {
  type IntersectionObserverConstructor = new (
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) => IntersectionObserver
}

const stubIntersectionObserver = () => {
  global.IntersectionObserver = class IntersectionObserver {
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}

    observe() {
      return null
    }

    disconnect() {
      return null
    }

    unobserve() {
      return null
    }
  } as unknown as IntersectionObserverConstructor
}

// Create a spy on console.error
// Create a spy on console.warn
const consoleErrorSpy = vi.spyOn(console, 'error')
const consoleWarnSpy = vi.spyOn(console, 'warn')

// Clean up spy
afterAll(() => {
  consoleErrorSpy.mockRestore()
  consoleWarnSpy.mockRestore()
})

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  ;(window as any).ResizeObserver = ResizeObserver
  // window.scrollTo = vi.fn()
  setupMatchMedia()
  window.ResizeObserver = ResizeObserverPolyfill

  stubIntersectionObserver()
})

/* If you want to test your app by creating snapshots, you need to mock the useId hook.
 * This hook returns a unique id across all components, but as your snapshot should be stable you can't have it there.
 */
vi.mock('react', async () => ({
  ...(await vi.importActual('react')),
  useId: () => ':mocked',
}))

vi.setConfig({ testTimeout: TIMEOUT_DELAY })
