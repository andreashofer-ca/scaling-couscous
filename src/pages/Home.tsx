import { Button } from '@ui5/webcomponents-react'
import styles from 'pages/Home.module.scss'

export const Home = () => {
  const showAlert = (message: string) => {
    alert(message)
  }

  return (
    <div className={styles.home}>
      <h1>Fioneer Frontend Starter</h1>
      <Button data-testid="button" onClick={() => showAlert('Fioneer')}>
        Fioneer
      </Button>
    </div>
  )
}
