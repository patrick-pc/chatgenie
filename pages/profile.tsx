import { ChevronLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Orbit } from '@uiball/loaders'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Head from 'next/head'
import Link from 'next/link'

export default function Profile() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const user = useUser()

  const [profile, setProfile] = useState({
    name: '',
    username: '',
    avatar_url: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    getProfile()
  }, [user])

  const getProfile = async () => {
    setIsLoading(true)
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('name, username, avatar_url')
        .eq('id', user.id)
        .single()

      if (error && status !== 406) throw error

      if (data) {
        setProfile({
          name: data.name,
          username: data.username,
          avatar_url: data.avatar_url,
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) console.log({ error })
    router.push('/signin')
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Orbit size={32} color="##818cf8" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>ChatGenie</title>
        <meta name="description" content="Talk to any character." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/img/logo-160x160.svg" />
      </Head>

      <main className="container mx-auto pt-6 pb-16 md:pt-16">
        <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-6">
          <div className="flex w-full max-w-md items-center justify-between">
            <Link href="/">
              <ChevronLeftIcon className="h-6 w-6 cursor-pointer stroke-2" />
            </Link>
            <h4 className="font-medium">Profile</h4>
            <button className="invisible">
              <PencilSquareIcon className="h-6 w-6 cursor-pointer stroke-2" />
            </button>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-8">
            <img className="h-28 w-28 rounded-full" src={profile.avatar_url} />
            <div className="text-center">
              <p className="text-xl font-medium">{profile.name}</p>
              <p className="text-indigo-400">@{profile.username}</p>
            </div>
            <button
              className="w-full max-w-sm rounded-lg bg-[#313335] px-4 py-2 transition hover:bg-[#414345] disabled:bg-[#313335] disabled:opacity-50"
              onClick={signOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
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
