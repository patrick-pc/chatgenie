import { Avatar } from '@boringer-avatars/react'
import { ChevronLeftIcon, ShareIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { DotPulse } from '@uiball/loaders'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '@supabase/auth-helpers-react'
import Head from 'next/head'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function Character() {
  const router = useRouter()
  const user = useUser()
  const { characterId } = router.query

  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState([] as any)
  const [character, setCharacter] = useState({
    id: '',
    name: '',
    user_id: '',
    description: '',
    image: '',
    visibility: '',
  })
  const [characterMessage, setCharacterMessage] = useState({
    sender: '',
    message: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (!characterId && !user) return

    getCharacter()
    getConversation()
  }, [characterId, user])

  const getCharacter = async () => {
    if (!characterId) return

    try {
      const response = await fetch(`/api/characters/${characterId}`, {
        method: 'GET',
        headers: new Headers({
          'content-type': 'application/json',
        }),
      })

      const data = await response.json()
      setCharacter(data)
    } catch (error) {
      console.log(error)
    }
  }

  const getConversation = async () => {
    if (!user) return

    try {
      const response = await fetch(
        `/api/conversations?characterId=${characterId}&userId=${user.id}`,
        {
          method: 'GET',
          headers: new Headers({
            'content-type': 'application/json',
          }),
        }
      )

      const data = await response.json()
      setConversation(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!characterMessage.message) return

    setConversation([...conversation, characterMessage])
  }, [characterMessage])

  const sendMessage = async () => {
    if (!message) return

    const content = {
      sender: 'Me',
      message: message,
    }
    setConversation([...conversation, content])
    setMessage('')

    if (user) {
      try {
        const response = await fetch('/api/conversations', {
          method: 'POST',
          body: JSON.stringify({
            characterId: characterId,
            userId: user.id,
            sender: 'Me',
            message,
          }),
          headers: new Headers({
            'content-type': 'application/json',
          }),
        })

        const data = await response.json()
      } catch (error) {
        console.log(error)
      }
    }

    setTimeout(async () => {
      setIsGenerating(true)
      console.log('Sending message...')

      let output
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: character.name,
          description: character.description,
          message,
          conversation,
        }),
      })

      if (response.status === 200) {
        const data = await response.json()
        output = data.output

        setCharacterMessage({
          sender: character.name,
          message: output.text.trim(),
        })
      } else {
        setConversation((previousArr) => previousArr.slice(0, -1))
        toast.error('Something went wrong. Please try again.')
      }
      setIsGenerating(false)

      if (user) {
        try {
          const response = await fetch('/api/conversations', {
            method: 'POST',
            body: JSON.stringify({
              characterId: characterId,
              sender: character.name,
              userId: user.id,
              message: output.text.trim(),
            }),
            headers: new Headers({
              'content-type': 'application/json',
            }),
          })

          const data = await response.json()
        } catch (error) {
          console.log(error)
        }
      }
    }, 800)
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

      <main className="container mx-auto h-screen pt-6 pb-16 md:pt-16">
        <div className="flex h-full w-full flex-col items-center justify-start gap-4 px-4">
          <div className="fixed top-0 z-50 flex w-full max-w-2xl items-center justify-between bg-[#131517] px-4 py-6 md:px-0">
            <Link href="/">
              <ChevronLeftIcon className="h-6 w-6 cursor-pointer stroke-2" />
            </Link>
            <div className="flex items-center gap-2">
              {character.image ? (
                <img
                  className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                  src={character.image ? character.image : '/img/placeholder.png'}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null
                    currentTarget.src = '/img/placeholder.png'
                  }}
                />
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full object-cover">
                  <Avatar
                    title={false}
                    size={35}
                    variant="beam"
                    name={character.id}
                    colors={['#362D5C', '#8B7099', '#76C5DD', '#CD9AFE', '#E2B42B']}
                  />
                </div>
              )}
              <p className="font-medium">{character.name}</p>
            </div>
            <button>
              <ShareIcon className="h-5 w-5 stroke-2" />
            </button>
          </div>
          <div className="relative flex h-full w-full max-w-2xl flex-col items-center justify-end gap-4 rounded-2xl pb-8 pt-16 md:pt-8">
            {!user && (
              <div className="absolute top-6 z-50 w-full select-none rounded-lg bg-yellow-500/10 p-2 text-center text-sm font-light text-yellow-600">
                <Link href="/signin">
                  <p className="inline underline">Sign in</p>
                </Link>{' '}
                to save conversation.
              </div>
            )}
            <div className="flex w-full flex-col-reverse gap-2 overflow-y-auto">
              <div className="max-w-40">
                {conversation?.map((conv: any, i: number) => {
                  return (
                    <div
                      className={`flex items-center p-2 ${
                        conv.sender === 'Me' ? 'justify-end' : 'justify-start'
                      }`}
                      key={i}
                    >
                      <div
                        className={`max-w-[18rem] rounded-2xl p-4 ${
                          conv.sender === 'Me' ? 'bg-indigo-400' : 'bg-[#212325]'
                        }`}
                      >
                        <p className="text-sm md:text-base">{conv.message}</p>
                      </div>
                    </div>
                  )
                })}
                {isGenerating && (
                  <div className="flex items-center justify-start p-2">
                    <div className="max-w-[18rem] rounded-2xl bg-[#212325] p-4">
                      <DotPulse size={32} speed={1.3} color="#818CF8" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="fixed bottom-0 mb-8 w-full max-w-2xl px-4 md:px-0">
              <div className="flex w-full gap-2 rounded-full bg-[#212325] p-2">
                <input
                  className="w-full bg-[#212325] px-4 text-sm focus:outline-none"
                  type="text"
                  placeholder="Say something..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendMessage()
                  }}
                  maxLength={256}
                />

                <button
                  className="flex items-center justify-center rounded-full bg-indigo-400/25 p-2 text-indigo-400"
                  onClick={sendMessage}
                >
                  <PaperAirplaneIcon className="h-6 w-6 stroke-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
