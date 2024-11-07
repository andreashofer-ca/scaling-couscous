import { BusyIndicator } from '@ui5/webcomponents-react'
import { FC } from 'react'
import BusyIndicatorSize from '@ui5/webcomponents/dist/types/BusyIndicatorSize.js'
import { PendingScreenProps } from 'interfaces/properties'
import { BUSY_INDICATOR_DELAY } from 'shared/constants'

const PendingScreen: FC<PendingScreenProps> = ({ title, description }) => (
  <BusyIndicator
    delay={BUSY_INDICATOR_DELAY}
    active
    text={description}
    title={title}
    size={BusyIndicatorSize.L}
    className="full-width-busy-indicator"
  />
)

export default PendingScreen
