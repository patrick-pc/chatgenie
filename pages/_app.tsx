import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react'
import { CharactersProvider } from '../contexts/characters'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import type { AppProps } from 'next/app'

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <CharactersProvider>
        <Component {...pageProps} />
        <Analytics />
        <Toaster />
      </CharactersProvider>
    </SessionContextProvider>
  )
}
