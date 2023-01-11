import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../utils/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const { characterId } = req.query
        const { data, error } = await supabase
          .from('characters')
          .select('id, user_id, name, visibility, description, image')
          .eq('id', characterId)
          .single()

        if (error) throw error

        return res.status(400).json(data)
      } catch (error) {
        return res.status(400).send(error.message)
      }

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
      break
  }
}
