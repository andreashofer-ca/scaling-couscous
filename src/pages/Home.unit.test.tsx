import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Home } from 'pages/Home'

describe('Home Component', () => {
  it('renders the initial message', () => {
    render(<Home />)

    const heading = screen.getByRole('heading')
    expect(heading).toHaveTextContent('Fioneer Frontend Starter')
  })

  it('renders the button', () => {
    const alertMock = vi.spyOn(window, 'alert')

    render(<Home />)

    const button = screen.getByTestId('button')
    fireEvent.click(button)

    expect(alertMock).toHaveBeenCalledWith('Fioneer')

    alertMock.mockRestore()
  })
})
