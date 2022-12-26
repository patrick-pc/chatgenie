import { Configuration, OpenAIApi } from 'openai'
import type { NextApiRequest, NextApiResponse } from 'next'

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const basePromptPrefix = `This is a conversation with ${req.body.character}\n`

  console.log(`API: ${basePromptPrefix}${req.body.message}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.message}\n`,
    temperature: 0.6,
    max_tokens: 256,
  })

  const basePromptOutput = baseCompletion.data.choices.pop()

  res.status(200).json({ output: basePromptOutput })
}
