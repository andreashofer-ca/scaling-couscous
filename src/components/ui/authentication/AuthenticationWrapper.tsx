import { useTranslation } from 'react-i18next'
import { useAuth } from 'react-oidc-context'

import { ReactElement, JSXElementConstructor } from 'react'
import PendingScreen from 'components/ui/screens/PendingScreen'

interface Props {
  children: ReactElement<any, string | JSXElementConstructor<any>>
}

const AuthenticationWrapper = ({
  children,
}: Props): ReactElement<any, string | JSXElementConstructor<any>> => {
  const {
    isLoading,
    user,
    activeNavigator,
    signinRedirect,
    events,
    signoutRedirect,
    signinSilent,
  } = useAuth()
  const { t } = useTranslation()

  events.addSilentRenewError(() => {
    signinSilent().catch(() => signoutRedirect())
  })
  events.addAccessTokenExpired(() => {
    signinSilent().catch(() => signoutRedirect())
  })

  const pendingScreen = (
    <PendingScreen
      title={t('app.components.login.title')}
      description={t('app.components.login.signin.description')}
    />
  )

  if (activeNavigator === 'signinSilent' || activeNavigator === 'signoutRedirect') {
    return pendingScreen
  }

  if (user && !user.expired) {
    return children
  }

  if (isLoading) {
    return pendingScreen
  }

  localStorage.redirectUri = window.location.href
  void signinRedirect()
  return children
}

export default AuthenticationWrapper
