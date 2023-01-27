import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Head from 'next/head'
import { Orbit } from '@uiball/loaders'

export default function Username() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const user = useUser()

  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const format = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/

  const signIn = async () => {
    if (!username) return

    setIsLoading(true)
    try {
      const { data: profileSelect, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, username')
        .eq('username', username)
        .single()

      if (profileError) throw profileError

      if (profileSelect.username) {
        toast.error('Username already taken!')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ username, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .single()

      if (error) throw error

      setUsername('')
      toast.success('Profile updated!')

      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (error) {
      toast.error(error)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>ChatGenie</title>
        <meta name="description" content="Talk to any character." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/img/logo-160x160.svg" />
      </Head>

      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 px-6">
        <div className="mb-16 flex w-full max-w-sm items-start">
          <h4 className="text-4xl font-semibold">Set Username</h4>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-1">
          <label className="text-xs text-zinc-400">Username</label>
          <input
            className="w-full rounded-lg border-2 border-[#313335] bg-transparent py-2 px-4 text-sm placeholder-zinc-500 focus:border-indigo-400 focus:outline-none"
            type="text"
            placeholder="champagnepapi"
            maxLength={15}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button
          className="flex w-full max-w-sm items-center justify-center rounded-lg bg-[#313335] px-4 py-2 transition hover:bg-[#414345] disabled:bg-[#313335] disabled:opacity-50"
          onClick={signIn}
          disabled={username.length <= 3 || !username || format.test(username) || isLoading}
        >
          {isLoading ? <Orbit size={24} color="#ffffff" /> : 'Save'}
        </button>
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
      user: session.user,
    },
  }
}
