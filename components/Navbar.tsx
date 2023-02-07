import { UserIcon } from '@heroicons/react/24/solid'
import { useUser } from '@supabase/auth-helpers-react'
import Link from 'next/link'

const Navbar = () => {
  const user = useUser()

  return (
    <div className="flex w-full items-center justify-between p-6">
      <Link href="/">
        <div className="flex items-center justify-center gap-2">
          <img className="h-8 cursor-pointer" src="/img/logo.png" />
          <p className="text-lg font-medium">ChatGenie</p>
        </div>
      </Link>
      {/* {user ? (
        <Link href="/profile">
          <UserIcon className="h-6 w-6" />
        </Link>
      ) : (
        <Link href="/signin">
          <button>Sign In</button>
        </Link>
      )} */}
    </div>
  )
}

export default Navbar
