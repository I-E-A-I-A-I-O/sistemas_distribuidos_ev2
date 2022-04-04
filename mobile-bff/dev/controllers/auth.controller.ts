import { Request, Response } from 'express'
import { Credentials } from '../helpers/types/credentials-schema'
import fetch from 'node-fetch'

export const register = async (request: Request, reply: Response) => {
    try {
        const cr = await Credentials.parseAsync(request.body)
        const response = await fetch(`http://127.0.0.1:8100${request.url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cr)
        })
        const reBody = await response.json()
        reply.status(response.status).json(reBody)
    } catch(err) {
        console.log(err)
        reply.status(500).send('Error registering user.')
    }
}
