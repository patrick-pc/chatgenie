import { DotPulse } from '@uiball/loaders'
import { ShareIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Character() {
  const router = useRouter()
  const { name, description, image } = router.query

  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState([] as any)
  const [characterMessage, setCharacterMessage] = useState({
    sender: name,
    message: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (!characterMessage.message) return

    setConversation([...conversation, characterMessage])
  }, [characterMessage])

  const sendMessage = async () => {
    if (!message) return

    setMessage('')
    const myMessage = {
      sender: 'Guest',
      message: message,
      description: '',
    }
    setConversation([...conversation, myMessage])

    setTimeout(async () => {
      setIsGenerating(true)
      console.log('Sending message...')
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, message, description, conversation }),
      })

      const data = await response.json()
      const { output } = data

      setCharacterMessage({
        sender: name,
        message: output.text.trim(),
      })
      setIsGenerating(false)
    }, 800)
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
        <div className="flex h-full w-full flex-col items-center justify-start gap-4 px-6">
          <div className="flex w-full max-w-md items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                src={image ? (image as string) : '/img/placeholder.png'}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = '/img/placeholder.png'
                }}
              />
              <p className="font-medium">{name}</p>
            </div>
            <button>
              <ShareIcon className="h-5 w-5 stroke-2" />
            </button>
          </div>
          <div className="flex h-[500px] w-full max-w-md flex-col items-center justify-end gap-4 rounded-2xl border border-[#212325] p-4">
            <div className="flex w-full flex-col-reverse gap-2 overflow-y-auto">
              <div className="max-w-40">
                {conversation?.map((conv: any, i: number) => {
                  return (
                    <div
                      className={`flex items-center p-2 ${
                        conv.sender === 'Guest' ? 'justify-end' : 'justify-start'
                      }`}
                      key={i}
                    >
                      <div
                        className={`max-w-[18rem] rounded-2xl p-4 ${
                          conv.sender === 'Guest' ? 'bg-indigo-400' : 'bg-[#212325]'
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

            <div className="flex w-full gap-2 rounded-full bg-[#212325] p-2">
              <input
                className="w-full bg-[#212325] px-4 text-sm focus:outline-none"
                type="text"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage()
                }}
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
      </main>
    </>
  )
}
