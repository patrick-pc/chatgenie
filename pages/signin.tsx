import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function SignIn() {
  const supabase = useSupabaseClient()

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const signIn = async () => {
    if (!email) return

    const { error } = await supabase.auth.signInWithOtp({
      email,
    })

    if (error) {
      console.log({ error })
    } else {
      const { error } = await supabase.auth.updateUser({ email })

      if (error) console.log({ error })
      setSubmitted(true)
    }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      console.log({ error })
    } else {
      const { error } = await supabase.auth.updateUser({ email })

      if (error) console.log({ error })
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center px-6">
        <h4>Please check your email to sign in</h4>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 px-6">
      <div className="mb-16 flex w-full max-w-sm items-start">
        <h4 className="text-4xl font-semibold">Sign In</h4>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-1">
        <label className="text-xs text-zinc-400">Email</label>
        <input
          className="w-full rounded-lg border-2 border-[#313335] bg-transparent py-2 px-4 text-sm placeholder-zinc-500 focus:border-indigo-400 focus:outline-none"
          type="text"
          placeholder="you@email.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        className="w-full max-w-sm rounded-lg bg-[#313335] px-4 py-2 transition hover:bg-[#414345] disabled:bg-[#313335] disabled:opacity-50"
        onClick={signIn}
        disabled={!email}
      >
        Sign In
      </button>
      <p className="my-2">OR</p>
      <button
        className="w-full max-w-sm rounded-lg bg-[#313335] px-4 py-2 transition hover:bg-[#414345] disabled:bg-[#313335] disabled:opacity-50"
        onClick={signInWithGoogle}
      >
        Sign In With Google
      </button>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    }
  }

  return { props: { user } }
}
