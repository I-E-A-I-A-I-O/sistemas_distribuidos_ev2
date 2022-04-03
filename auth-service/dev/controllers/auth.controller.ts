import { Request, Response } from 'express'
import { Credentials } from '../helpers/credentials-schema'

export const register = async (request: Request, reply: Response) => {
    try {
        const asd = await Credentials.parseAsync(request.body)
        reply.status(200).json(asd)
    } catch(err) {
        reply.status(500).send('XD')
    } finally {

    }
}
