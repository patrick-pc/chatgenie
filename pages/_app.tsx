import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react'
import { CharactersProvider } from '../contexts/characters'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CharactersProvider>
      <Component {...pageProps} />
      <Analytics />
    </CharactersProvider>
  )
}
