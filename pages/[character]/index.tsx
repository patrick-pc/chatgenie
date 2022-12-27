import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Character() {
  const router = useRouter()
  const { character } = router.query

  return (
    <>
      <Head>
        <title>switcheroo</title>
        <meta name="description" content="Have a conversation with your favorite character" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto">
        <div className="flex h-screen w-full flex-col items-center justify-center px-6">
          <div className="flex w-full max-w-lg flex-col gap-8">
            <div className="flex items-center justify-between">{character}</div>
          </div>
        </div>
      </main>
    </>
  )
}
