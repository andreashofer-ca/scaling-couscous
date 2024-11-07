import { Home } from 'pages/Home'
import { AuthProvider } from 'react-oidc-context'
import { ConfigContext, useConfig } from 'hooks/config/useConfig'
import buildOidcConfiguration from 'components/ui/authentication/oidcConfigBuilder'
import AuthenticationWrapper from 'components/ui/authentication/AuthenticationWrapper'
import PendingScreen from 'components/ui/screens/PendingScreen'
import { useTranslation } from 'react-i18next'
import 'i18n/setupi18n'

function App() {
  const { t } = useTranslation()

  const { data: config, isPending, isError } = useConfig()

  if (isPending) {
    return (
      <PendingScreen
        title={t('app.loading.in-progress')}
        description={t('app.loading.in-progress')}
      />
    )
  }

  if (isError || !config) {
    return <div>{t('app.loading.error')}</div>
  }

  const { oidc: oidcConfig } = config

  return (
    <ConfigContext.Provider value={config}>
      <AuthProvider {...buildOidcConfiguration(oidcConfig)}>
        <AuthenticationWrapper>
          <Home />
        </AuthenticationWrapper>
      </AuthProvider>
    </ConfigContext.Provider>
  )
}

export default App
