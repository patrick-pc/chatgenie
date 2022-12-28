import '../styles/globals.css'
import { CharactersProvider } from '../contexts/characters'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CharactersProvider>
      <Component {...pageProps} />
    </CharactersProvider>
  )
}
