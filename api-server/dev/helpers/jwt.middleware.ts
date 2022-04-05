import { Request, Response, NextFunction } from 'express'
import { log } from './logstash'
import jwt from 'jsonwebtoken'
import { TokenPayload } from './types/token-payload'

export const verifyToken = async (request: Request, reply: Response, next: NextFunction) => {
    const token = request.headers['authorization']

    if (!token) {
        log('warn', 'token-missing', {
            reason: 'Received request without authorization token',
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(401).json({ message: 'Access denied.' })
    }

    if (!process.env.JWT_SECRET) {
        log('warn', 'jwt-secret-missing', {
            reason: 'jwt missing not set. Can not decode tokens',
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(500).json({ message: 'Server can not verify token.' })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: false }) as TokenPayload
        log('info', 'token-verified', {
            reason: 'JWT Token verified successfully',
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        request.user = payload
        next()
    } catch (err) {
        log('warn', 'invalid-token', {
            reason: err,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        reply.status(401).json({ message: 'Invalid or expired token.' })
    }
}