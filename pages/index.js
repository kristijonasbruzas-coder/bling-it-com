import Head from 'next/head'
import Header from '../components/Header'

export default function Home() {
  return (
    <>
      <Head>
        <title>Bling.it</title>
        <meta name="description" content="Bling.it demo site" />
      </Head>
      <Header />
      <main className="container">
        <h1>Welcome to Bling.it</h1>
        <p>This is a Next.js starter. Replace this page with your code.</p>
        <a className="button" href="/api/hello">Call API</a>
      </main>
    </>
  )
}
