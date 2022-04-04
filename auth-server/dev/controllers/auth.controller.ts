import { Request, Response } from 'express'
import { Credentials } from '../helpers/types/credentials-schema'
import { User } from '../helpers/types/auth-db-types'
import { pool } from '../helpers/database'
import { sql } from 'slonik'
import bcrypt from 'bcrypt'
import { log } from '../helpers/logstash'
import jwt from 'jsonwebtoken'

export const register = async (request: Request, reply: Response) => {
    try {
        const cr = await Credentials.parseAsync(request.body)
        const registered = await pool.connect(async (conn) => {
            const result = await conn.query(sql`
            SELECT user_id 
            FROM users.users
            WHERE user_email = ${cr.email}`)
            return result.rowCount > 0
        })

        if (registered) {
            log('info', 'invalid-credentials', {
                reason: 'Registration failed. Email already in registered',
                path: request.url,
                method: request.method,
                ip: request.ip,
                ua: request.headers['user-agent'] || null
            })
            return reply.status(400).json({ message: 'email already registered.' })
        }

        const pass = await bcrypt.hash(cr.password, 10)

        await pool.connect(async (conn) => {
            await conn.query(sql`
            INSERT INTO users.users(user_email, user_role, user_password)
            VALUES(${cr.email}, 'regular', ${pass})`)
            log('info', 'register-completed', {
                reason: 'New user registered successfuly',
                path: request.url,
                method: request.method,
                ip: request.ip,
                ua: request.headers['user-agent'] || null
            })
            return reply.status(201).json({ message: 'Account created' })
        })
    } catch(err) {
        log('error', 'exception-caught', {
            stack: err,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        reply.status(500).json({ message: 'Error completing registration' })
    }
}

export const login = async (request: Request, reply: Response) => {
    try {
        const cr = await Credentials.parseAsync(request.body)
        const qr = await pool.connect(async (conn) => {
            const result = await conn.query<User>(sql`
            SELECT * 
            FROM users.users
            WHERE user_email = ${cr.email}`)
            return result
        })

        if (qr.rowCount < 1) {
            log('warn', 'invalid-credentials', {
                reason: 'Login failed. Email is not registered',
                path: request.url,
                method: request.method,
                ip: request.ip,
                ua: request.headers['user-agent'] || null
            })
            return reply.status(404).json({ message: 'Email not registered.' })
        }

        const user = qr.rows[0]
        const same = await bcrypt.compare(cr.password, user.user_password)

        if (!same) {
            log('warn', 'invalid-credentials', {
                reason: 'Login failed. Incorrect password',
                path: request.url,
                method: request.method,
                ip: request.ip,
                ua: request.headers['user-agent'] || null
            })
            return reply.status(404).json({ message: 'Incorrect password.' })
        }

        if (!process.env.JWT_SECRET) {
            log('error', 'EV-not-set', {
                reason: 'JWT_SECRET not set',
                path: request.url,
                method: request.method,
                ip: request.ip,
                ua: request.headers['user-agent'] || null
            })
            return reply.status(500).json({ message: 'Login service not available.' })
        }

        const token = jwt.sign({ id: user.user_id, role: user.user_role }, process.env.JWT_SECRET, { expiresIn: '1h' })
        log('info', 'login-success', {
            reason: 'New token created.',
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(500).json({ token })
    } catch(err) {
        log('error', 'exception-caught', {
            stack: err,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        reply.status(500).json({ message: 'Error completing login' })
    }
}
