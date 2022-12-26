import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [character, setCharacter] = useState('')
  const [message, setMessage] = useState('')
  const [setCharacterMessage, characterMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const sendMessage = async () => {
    setIsGenerating(true)

    console.log('Sending message...')
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ character, message }),
    })

    const data = await response.json()
    const { output } = data
    console.log(`${character}: `, output.text)

    characterMessage(`${output.text}`)
    setIsGenerating(false)
  }

  return (
    <>
      <Head>
        <title>switcheroo</title>
        <meta name="description" content="Have a conversation with your favorite character" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <input
            type="text"
            placeholder="chracter"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
          />
          <input
            type="text"
            placeholder="start typing here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send Mesage</button>
          {setCharacterMessage && (
            <div>
              <p>{setCharacterMessage}</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
