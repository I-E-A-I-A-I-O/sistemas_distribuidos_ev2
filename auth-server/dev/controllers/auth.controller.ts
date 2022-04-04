import { Request, Response } from 'express'
import { Credentials } from '../helpers/types/credentials-schema'
import { User } from '../helpers/types/auth-db-types'
import { pool } from '../helpers/database'
import { sql } from 'slonik'
import bcrypt from 'bcrypt'

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

        if (registered) return reply.status(400).json({ message: 'email already registered.' })

        const pass = await bcrypt.hash(cr.password, 10)

        await pool.connect(async (conn) => {
            await conn.query(sql`
            INSERT INTO users.users(user_email, user_role, user_password)
            VALUES(${cr.email}, 'regular', ${pass})`)
            return reply.status(201).json({ message: 'Account created' })
        })
    } catch(err) {
        console.log(err)
        reply.status(500).json({ message: 'Error completing registration' })
    }
}
