import Link from 'next/link'
import { useUser } from '@supabase/auth-helpers-react'

const Navbar = () => {
  const user = useUser()

  return (
    <div className="flex w-full items-center justify-between p-6">
      <Link href="/">
        <img className="h-8 cursor-pointer" src="/img/logo-256x256.png" />
      </Link>
      {user ? (
        <Link href="/profile">
          <button>Profile</button>
        </Link>
      ) : (
        <Link href="/signin">
          <button>Sign In</button>
        </Link>
      )}
    </div>
  )
}

export default Navbar
