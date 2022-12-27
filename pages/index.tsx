import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Head from 'next/head'
import Link from 'next/link'

export const featuredCharacters = [
  {
    name: 'Wednesday Addams',
    image: '/img/wednesday.png',
    description: 'dark, gloomy, intelligent, resourceful, mischievous, independent, and sarcastic',
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
  {
    name: 'Groot',
    image: '/img/groot.png',
    description: '',
  },
]

export default function Home() {
  return (
    <>
      <Head>
        <title>switcheroo</title>
        <meta name="description" content="Have a conversation with your favorite character" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/img/logo.svg" />
      </Head>

      <main className="container mx-auto mt-6 mb-16 md:mt-16">
        <div className="flex h-full w-full flex-col items-center px-6">
          <div className="flex w-full max-w-lg flex-col gap-8">
            <div className="flex items-center justify-between">
              <img className="h-8 cursor-pointer" src="/img/logo-text.png" />
              <button>
                <MagnifyingGlassIcon className="h-6 w-6 stroke-2" />
              </button>
            </div>

            <div className="grid grid-cols-2 place-items-center gap-8 md:grid-cols-3">
              {featuredCharacters.map((character, i) => {
                return (
                  <Link
                    key={i}
                    href={`/chat?name=${character.name}`}
                    className="flex flex-col items-center justify-center gap-2 text-center"
                  >
                    <img className="h-36 w-36 rounded-full bg-zinc-700" src={character.image} />
                    <p className="text-sm font-medium">{character.name}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
