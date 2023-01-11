import { ArrowLongRightIcon } from '@heroicons/react/24/outline'
import { useCharactersContext } from '../contexts/characters'
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Modal from '../components/Modal'
import Navbar from '../components/Navbar'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export const featuredCharacters = [
  {
    name: 'Wednesday Addams',
    image: '/img/wednesday.png',
    description:
      'dark, gloomy, intelligent, resourceful, mischievous, independent, and reluctantly answers questions with sarcastic responses',
  },
  {
    name: 'Elon Musk',
    image: '/img/elon.png',
    description:
      'innovative, ambitious, driven, hardworking, focused on the future, risk-taking and controversial',
  },
  {
    name: 'Naruto',
    image: '/img/naruto.png',
    description:
      'determined, hardworking, loyal, protective, kind, compassionate, energetic, playful, naive, and impulsive',
  },
  {
    name: 'Michael Jordan',
    image: '/img/mj.png',
    description: 'competitive, determined, hardworking, confident, talented, and charismatic',
  },
  {
    name: 'Therapist',
    image: '/img/therapist.png',
    description: 'empathetic, nonjudgmental, confidential, active listener, and patient',
  },
  {
    name: 'Albert Einstein',
    image: '/img/einstein.png',
    description: 'brilliant, genius, curious, creative, persistent, and passionate',
  },
  {
    name: 'Spongebob',
    image: '/img/spongebob.png',
    description: 'cheerful, optimistic, energetic, playful, loyal, friendly, naive and, innocent',
  },
  {
    name: 'Giga Chad',
    image: '/img/gigachad.png',
    description: 'extreme, muscular, arrogant, and confident',
  },
]

export default function Home() {
  const [isActive, setIsActive] = useState(false)
  const [character, setCharacter] = useState({
    name: '',
    description: '',
    image: '',
  })
  const { characters, setCharacters } = useCharactersContext()

  const createCharacter = () => {
    if (!character.name) return

    setCharacters([...characters, character])
    setIsActive(false)
    setCharacter({
      name: '',
      description: '',
      image: '',
    })
  }

  return (
    <>
      <Head>
        <title>ChatGenie</title>
        <meta name="description" content="Talk to any character." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/img/logo-160x160.svg" />
      </Head>

      <Navbar />
      <main className="container mx-auto pt-6 pb-32 md:pt-16">
        <div className="flex h-full w-full flex-col items-center gap-24 px-6">
          <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-8 text-center">
            <a
              href="https://twitter.com/chatgenie"
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-full border-[.5px] border-zinc-600 bg-[#93959711] py-1 px-4 text-sm"
            >
              Follow us on Twitter
              <ArrowLongRightIcon className="h-5 w-5" />
            </a>
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl font-medium md:text-7xl">ChatGenie</h1>
              <h3 className="text-lg font-extralight text-zinc-400 md:text-xl">
                Have a conversation with any character
              </h3>
            </div>
            <button
              className="mt-4 rounded-lg border border-indigo-300 bg-indigo-600/10 px-6 py-3 text-indigo-400 transition"
              onClick={() => setIsActive(true)}
            >
              Create Character
            </button>
          </div>

          <div className="flex w-full max-w-2xl flex-col gap-12">
            {characters?.length > 0 && (
              <div className="flex flex-col gap-8">
                <h3 className="text-xl font-medium">Created</h3>
                <div className="grid grid-cols-2 place-items-center gap-8 md:grid-cols-3 lg:grid-cols-4">
                  {characters.map((character: any, i: number) => {
                    return (
                      <Link
                        key={i}
                        href={`/chat?name=${character.name}&description=${character.description}&image=${character.image}`}
                        className="flex flex-col items-center justify-center gap-2 text-center"
                      >
                        <img
                          className="h-36 w-36 flex-shrink-0 rounded-full object-cover"
                          src={character.image ? character.image : '/img/placeholder.png'}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null
                            currentTarget.src = '/img/placeholder.png'
                          }}
                        />
                        <p className="text-sm font-medium text-zinc-400">{character.name}</p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-8">
              <h3 className="text-xl font-medium">Discover</h3>
              <div className="grid grid-cols-2 place-items-center gap-8 md:grid-cols-3 lg:grid-cols-4">
                {featuredCharacters.map((character, i) => {
                  return (
                    <Link
                      key={i}
                      href={`/chat?name=${character.name}&description=${character.description}&image=${character.image}`}
                      className="flex flex-col items-center justify-center gap-2 text-center"
                    >
                      <img
                        className="h-36 w-36 flex-shrink-0 rounded-full object-cover"
                        src={character.image}
                      />
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
          <img
            className="h-28 w-28 flex-shrink-0 rounded-full object-cover"
            src={character.image ? character.image : '/img/placeholder.png'}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = '/img/placeholder.png'
            }}
          />
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

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error, status } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('id', user.id)
    .single()

  if (error && status !== 406) throw error

  if (!data.username) {
    return {
      redirect: {
        destination: '/username',
        permanent: false,
      },
    }
  }

  return { props: { user } }
}
