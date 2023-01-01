import { Configuration, OpenAIApi } from 'openai'
import type { NextApiRequest, NextApiResponse } from 'next'

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, message, conversation } = req.body

  let basePrompt = `The following is a conversation with ${name}.${
    description &&
    ` ${name} is ${description}.
    
    Instructions:
    - Keep the replies short and concise.
    - Retain as much information as needed to answer the question at a later time.
    `
  }\n`
  let chainedPrompt = ''

  if (conversation.length === 0) {
    chainedPrompt = `${basePrompt}\nMe: ${message}\n${name}: `
  } else {
    chainedPrompt = basePrompt
    conversation.map((conv: any, i: number) => {
      chainedPrompt += `\n${conv.sender}: ${conv.message}`

      if (conversation.length === i + 1) chainedPrompt += `\nGuest: ${message}\n${name}: `
    })
  }

  console.log(chainedPrompt)
  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: chainedPrompt,
    temperature: 0.8,
    max_tokens: 256,
  })

  const basePromptOutput = baseCompletion.data.choices.pop()
  console.log(basePromptOutput)

  res.status(200).json({ output: basePromptOutput })
}
