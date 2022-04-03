import { Request, Response } from 'express'
import { Credentials } from '../helpers/types/credentials-schema'
import fetch from 'node-fetch'

export const register = async (request: Request, reply: Response) => {
    try {
        const asd = await Credentials.parseAsync(request.body)
        reply.status(200).json(asd)
    } catch(err) {
        reply.status(500).send('XD')
    } finally {

    }
}
