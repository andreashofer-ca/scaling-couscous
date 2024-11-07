import { describe, it, expect } from 'vitest'
import PendingScreen from 'components/ui/screens/PendingScreen'
import { render } from 'test-utils/testUtils'

const title = 'Title'
const description = 'A description'

describe('Pending Screen', () => {
  const { container } = render(<PendingScreen title={title} description={description} />)

  it('should match the snapshot', () => {
    expect(container).toMatchSnapshot()
  })
})
