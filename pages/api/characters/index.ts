import { supabase } from '../../../utils/supabase'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const { userId } = req.query

        const characterQuery = supabase
          .from('characters')
          .select('id, user_id, name, visibility, description, image')

        if (userId) {
          characterQuery.eq('user_id', userId)
          characterQuery.limit(12)
        } else {
          characterQuery.eq('visibility', 'public')
          characterQuery.limit(16)
        }
        characterQuery.order('created_at', { ascending: false })

        const { data, error } = await characterQuery
        if (error) throw error

        return res.status(200).json(data)
      } catch (error) {
        return res.status(400).send(error.message)
      }

    case 'POST':
      try {
        const { userId, name, visibility, description, image } = req.body

        const { data, error } = await supabase
          .from('characters')
          .insert({ user_id: userId, name, visibility, description, image })
          .single()

        if (error) throw error

        return res.status(200).json(data)
      } catch (error) {
        return res.status(400).send(error.message)
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break
  }
}
