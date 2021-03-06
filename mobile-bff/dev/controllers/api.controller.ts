import fetch from "node-fetch";
import { Request, Response } from 'express'
import { Dog } from '../helpers/types/dog-request'
import { log } from '../helpers/logstash'

export const registerDog = async (request: Request, reply: Response) => {
    if (!request.headers['authorization']) {
        log('warn', 'not-authorized', {
            message: 'Tried to access resource without proper authorization',
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(403).json({ message: 'Access denied.' })
    }

    try {
        const body = await Dog.parseAsync(request.body)
        const response = await fetch(`http://serviceproxy:${process.env.SERVICE_PROXY_PORT}${request.url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': request.headers['authorization']
            },
            body: JSON.stringify(body)
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
    } catch (err) {
        log('error', 'malformed-body', {
            reason: err,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        reply.status(400).json({ message: 'Unexpected body structure' })
    }
}

export const read = async (request: Request, reply: Response) => {
    if (!request.headers['authorization']) {
        log('warn', 'not-authorized', {
            message: 'Tried to access resource without proper authorization',
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(403).json({ message: 'Access denied.' })
    }

    try {
        const response = await fetch(`http://serviceproxy:${process.env.SERVICE_PROXY_PORT}${request.url}`, {
            method: 'GET',
            headers: {
                'authorization': request.headers['authorization']
            },
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
    } catch (err) {
        log('error', 'fetch-error', {
            reason: err,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        reply.status(500).json({ message: 'Could not connect to the server' })
    }
}

export const patch = async (request: Request, reply: Response) => {
    if (!request.headers['authorization']) {
        log('warn', 'not-authorized', {
            message: 'Tried to access resource without proper authorization',
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(403).json({ message: 'Access denied.' })
    }

    try {
        const sfBody = await Dog.spa(request.body)

        if (!sfBody.success) {
            log('error', 'malformed-body', {
                path: request.url,
                method: request.method,
                ip: request.ip,
                ua: request.headers['user-agent'] || null
            })
            return reply.status(400).json({ message: 'Unexpected body.' })
        }

        const body = await Dog.parseAsync(request.body)
        const response = await fetch(`http://serviceproxy:${process.env.SERVICE_PROXY_PORT}${request.url}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'authorization': request.headers['authorization']
            },
            body: JSON.stringify(body)
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
    } catch (err) {
        log('error', 'fetch-error', {
            reason: err,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        reply.status(500).json({ message: 'Error connecting to the server' })
    }
}

export const deleteDog = async (request: Request, reply: Response) => {
    if (!request.headers['authorization']) {
        log('warn', 'not-authorized', {
            message: 'Tried to access resource without proper authorization',
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(403).json({ message: 'Access denied.' })
    }

    try {
        const response = await fetch(`http://serviceproxy:${process.env.SERVICE_PROXY_PORT}${request.url}`, {
            method: 'DELETE',
            headers: {
                'authorization': request.headers['authorization']
            },
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
    } catch (err) {
        log('error', 'fetch-error', {
            reason: err,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        reply.status(500).json({ message: 'Error connecting to the server' })
    }
}
