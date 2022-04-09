import { Request, Response } from 'express'
import { Credentials } from '../helpers/types/credentials-schema'
import { log } from '../helpers/logstash'
import fetch from 'node-fetch'

export const register = async (request: Request, reply: Response) => {
    try {
        const cr = await Credentials.parseAsync(request.body)
        const response = await fetch(`http://serviceproxy:${process.env.SERVICE_PROXY_PORT}${request.url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cr)
        })
        log('info', 'response-received', {
            status: response.status,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        const reBody = await response.json()
        reply.status(response.status).json(reBody)
    } catch(err) {
        log('error', 'exception-caught', {
            stack: err,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        reply.status(500).send('Error registering user.')
    }
}

export const login = async (request: Request, reply: Response) => {
    try {
        const cr = await Credentials.parseAsync(request.body)
        const response = await fetch(`http://serviceproxy:${process.env.SERVICE_PROXY_PORT}${request.url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cr)
        })
        log('info', 'response-received', {
            status: response.status,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        const reBody = await response.json()
        reply.status(response.status).json(reBody)
    } catch(err) {
        log('error', 'exception-caught', {
            stack: err,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        reply.status(500).send('Error logging in.')
    }
}
