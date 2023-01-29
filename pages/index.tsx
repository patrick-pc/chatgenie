import { ArrowLongRightIcon } from '@heroicons/react/24/outline'
import { Avatar } from '@boringer-avatars/react'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Head from 'next/head'
import Link from 'next/link'
import Modal from '../components/Modal'
import Navbar from '../components/Navbar'

export default function Home() {
  const router = useRouter()
  const supabase = useSupabaseClient()
  const user = useUser()

  const [isActive, setIsActive] = useState(false)
  const [character, setCharacter] = useState({
    name: '',
    visibility: 'public',
    description: '',
    image: '',
  })

  const [featuredCharacters, setFeaturedCharacters] = useState([])
  const [createdCharaters, setCreatedCharacters] = useState([])

  const createCharacter = async () => {
    if (!user) {
      toast.error('Sign in to continue.')
      return
    }

    if (!character.name) return

    const response = await fetch('/api/characters', {
      method: 'POST',
      body: JSON.stringify({ ...character, userId: user.id }),
      headers: new Headers({
        'content-type': 'application/json',
      }),
    })

    const data = await response.json()
    console.log(data)

    setIsActive(false)
    setCharacter({
      name: '',
      visibility: 'public',
      description: '',
      image: '',
    })
  }

  useEffect(() => {
    if (!user) return

    getProfile()
  }, [user])

  const getProfile = async () => {
    try {
      if (user) {
        const { data, error, status } = await supabase
          .from('profiles')
          .select('name, username, avatar_url')
          .eq('id', user.id)
          .single()

        if (error && status !== 406) throw error

        if (!data.username) {
          router.push('/username')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!user) return

    getCreatedCharacters()
  }, [user, createdCharaters])

  const getCreatedCharacters = async () => {
    try {
      const response = await fetch(`/api/characters?userId=${user.id}`, {
        method: 'GET',
        headers: new Headers({
          'content-type': 'application/json',
        }),
      })

      const data = await response.json()
      setCreatedCharacters(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getFeaturedCharacters()
  }, [])

  const getFeaturedCharacters = async () => {
    try {
      const response = await fetch('/api/characters', {
        method: 'GET',
        headers: new Headers({
          'content-type': 'application/json',
        }),
      })

      const data = await response.json()
      setFeaturedCharacters(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Head>
        <title>ChatGenie</title>
        <meta
          name="description"
          content="Text and chat with any character, dead or alive, real or made up."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/img/logo.png" />
      </Head>

      <Navbar />
      <main className="container mx-auto pt-6 pb-32 md:pt-16">
        <div className="flex h-full w-full flex-col items-center gap-24 px-6">
          <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-8 text-center">
            <a
              href="https://twitter.com/chatgenie"
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-full border-[.5px] border-zinc-600 bg-[#93959711] py-1 px-4 text-sm"
            >
              Follow us on Twitter
              <ArrowLongRightIcon className="h-5 w-5" />
            </a>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-medium md:text-6xl">
                Text and chat with any character, dead or alive, real or made up
              </h1>
              {/* <h3 className="text-lg font-light text-zinc-400 md:text-xl">
                Have a conversation with any person or any character you like
              </h3> */}
            </div>
            <button
              className="mt-4 rounded-lg border border-indigo-300 bg-indigo-600/10 px-6 py-3 text-indigo-400 transition"
              onClick={() => setIsActive(true)}
            >
              Create Character
            </button>
          </div>

          <div className="flex w-full max-w-4xl flex-col gap-12">
            {createdCharaters?.length > 0 && (
              <div className="flex flex-col gap-8">
                <h3 className="text-xl font-medium">Created</h3>
                <div className="grid grid-cols-2 place-items-center gap-8 md:grid-cols-4 lg:grid-cols-5">
                  {createdCharaters.map((character: any, i: number) => {
                    return (
                      <Link
                        key={i}
                        href={`/chat?characterId=${character.id}`}
                        className="flex flex-col items-center justify-center gap-2 text-center"
                      >
                        {character.image ? (
                          <img
                            className="squircle h-36 w-36 flex-shrink-0 object-cover"
                            src={character.image ? character.image : '/img/placeholder.png'}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null
                              currentTarget.src = '/img/placeholder.png'
                            }}
                          />
                        ) : (
                          <div className="squircle h-36 w-36 flex-shrink-0 object-cover">
                            <Avatar
                              title={false}
                              size={150}
                              variant="beam"
                              name={character.name}
                              square={true}
                              colors={['#362D5C', '#8B7099', '#76C5DD', '#CD9AFE', '#E2B42B']}
                            />
                          </div>
                        )}
                        <p className="text-sm font-medium text-zinc-400">{character.name}</p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-8">
              <h3 className="text-xl font-medium">Featured</h3>
              <div className="grid grid-cols-2 place-items-center gap-8 md:grid-cols-4 lg:grid-cols-5">
                {featuredCharacters.map((character, i) => {
                  return (
                    <Link
                      key={i}
                      href={`/chat?characterId=${character.id}`}
                      className="flex flex-col items-center justify-center gap-2 text-center"
                    >
                      {character.image ? (
                        <img
                          className="squircle h-36 w-36 flex-shrink-0 object-cover"
                          src={character.image ? character.image : '/img/placeholder.png'}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null
                            currentTarget.src = '/img/placeholder.png'
                          }}
                        />
                      ) : (
                        <div className="squircle h-36 w-36 flex-shrink-0 object-cover">
                          <Avatar
                            title={false}
                            size={150}
                            variant="beam"
                            name={character.name}
                            square={true}
                            colors={['#362D5C', '#8B7099', '#76C5DD', '#CD9AFE', '#E2B42B']}
                          />
                        </div>
                      )}
                      <p className="text-sm font-medium text-zinc-400">{character.name}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Modal title="Create Character" isActive={isActive} onClose={() => setIsActive(false)}>
        <div className="flex flex-col items-center justify-center gap-4">
          {character.image ? (
            <img
              className="h-36 w-36 flex-shrink-0 rounded-full object-cover"
              src={character.image ? character.image : '/img/placeholder.png'}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null
                currentTarget.src = '/img/placeholder.png'
              }}
            />
          ) : (
            <div className="h-36 w-36 flex-shrink-0 rounded-full object-cover">
              <Avatar
                title={true}
                size={150}
                variant="beam"
                name="chatgenie"
                square={false}
                colors={['#362D5C', '#8B7099', '#76C5DD', '#CD9AFE', '#E2B42B']}
              />
            </div>
          )}
          <div className="flex w-full flex-col gap-1">
            <label className="text-xs text-zinc-400">Name</label>
            <input
              className="w-full rounded-lg border-2 border-[#313335] bg-transparent py-2 px-4 text-sm placeholder-zinc-500 focus:border-indigo-400 focus:outline-none"
              type="text"
              placeholder="Thanos"
              maxLength={70}
              value={character.name}
              onChange={(e) => setCharacter({ ...character, name: e.target.value })}
            />
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="text-xs text-zinc-400">Visibility</label>
            <select
              className="w-full rounded-lg border-2 border-[#313335] bg-transparent py-2 px-4 text-sm placeholder-zinc-500 focus:border-indigo-400 focus:outline-none"
              value={character.visibility}
              onChange={(e) => setCharacter({ ...character, visibility: e.target.value })}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="text-xs text-zinc-400">Description (optional)</label>
            <input
              className="w-full rounded-lg border-2 border-[#313335] bg-transparent py-2 px-4 text-sm placeholder-zinc-500 focus:border-indigo-400 focus:outline-none"
              type="text"
              placeholder="powerful, amoral, and obsessed with balance"
              maxLength={256}
              value={character.description}
              onChange={(e) => setCharacter({ ...character, description: e.target.value })}
            />
          </div>
          <div className="flex w-full flex-col gap-1">
            <label className="text-xs text-zinc-400">Image URL (optional)</label>
            <input
              className="w-full rounded-lg border-2 border-[#313335] bg-transparent py-2 px-4 text-sm placeholder-zinc-500 focus:border-indigo-400 focus:outline-none"
              type="text"
              placeholder="https://"
              value={character.image}
              onChange={(e) => setCharacter({ ...character, image: e.target.value })}
            />
          </div>
          <button
            className="mt-2 w-full rounded-lg bg-[#313335] px-4 py-2 transition hover:bg-[#414345] disabled:bg-[#313335] disabled:opacity-50"
            onClick={createCharacter}
            disabled={!character.name}
          >
            Create
          </button>
        </div>
      </Modal>
    </>
  )
}
