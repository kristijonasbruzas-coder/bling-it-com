import Head from 'next/head'
import BlingItConfigurator from '../components/BlingItConfigurator'

export default function Page() {
  return (
    <>
      <Head>
        <title>Bling.it Configurator</title>
        <meta name="description" content="Bling.it RC shell configurator" />
      </Head>
      <BlingItConfigurator />
    </>
  )
}
