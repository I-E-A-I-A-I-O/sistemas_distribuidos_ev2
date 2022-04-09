import { Request, Response } from 'express'
import { log } from '../helpers/logstash'
import { pool } from '../helpers/database'
import { Dog, DogDB } from '../helpers/types/dog-request'
import { sql } from 'slonik'
import { z } from 'zod'

export const createDog = async (request: Request, reply: Response) => {
    const user = request.user

    if (!user) {
        log('warn', 'credentials-missing', {
            reason: 'Tried to access api endpoint without proper credentials',
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(401).json({ message: 'Access denied.' })
    }

    if (user.role !== 'admin') {
        log('warn', 'role-unathorized', {
            reason: 'Tried to access api endpoint without proper role',
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(403).json({ message: 'You do not have permission to perform this operation.' })
    }

    try {
        const body = await Dog.parseAsync(request.body)
        await pool.connect(async (conn) => {
            const inserted = await conn.query<DogDB>(sql`
            INSERT INTO dogs.dogs(dog_name, dog_breed, dog_age, dog_owner)
            VALUES(${body.name}, ${body.breed}, ${body.age}, ${user.id})
            RETURNING *
            `)
            log('info', 'dog-created', {
                reason: `new dog created with id: ${inserted.rows[0].dog_id}`,
                path: request.url,
                method: request.method,
                ip: request.ip,
                ua: request.headers['user-agent'] || null
            })
            reply.status(201).json({ message: 'Dog created.' })
        })
    } catch(err) {
        log('error', 'insert-error', {
            reason: err,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(500).json({ message: 'Error creating dog.' })
    }
}

export const readDogs = async (request: Request, reply: Response) => {
    const user = request.user

    if (!user) {
        log('warn', 'credentials-missing', {
            reason: 'Tried to access api endpoint without proper credentials',
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(401).json({ message: 'Access denied.' })
    }

    try {
        await pool.connect(async (conn) => {
            const dogList = await conn.query<DogDB>(sql`
            SELECT *
            FROM dogs.dogs
            WHERE dog_owner=${user.id}
            `)
            log('info', 'dogs-read', {
                reason: `user ${user.id} requested dog list`,
                path: request.url,
                method: request.method,
                ip: request.ip,
                ua: request.headers['user-agent'] || null
            })

            if (dogList.rowCount > 0) return reply.status(200).json(dogList.rows)

            reply.status(200).json({ message: 'Empty list' })
        })
    } catch(err) {
        log('error', 'read-error', {
            reason: err,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(500).json({ message: 'Error reading dog list.' })
    }
}

export const readDog = async (request: Request, reply: Response) => {
    const user = request.user

    if (!user) {
        log('warn', 'credentials-missing', {
            reason: 'Tried to access api endpoint without proper credentials',
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(401).json({ message: 'Access denied.' })
    }

    try {
        const { dogID } = request.params
        const id = await z.string().uuid().parseAsync(dogID)

        await pool.connect(async (conn) => {
            const dogList = await conn.query<DogDB>(sql`
            SELECT *
            FROM dogs.dogs
            WHERE dog_owner=${user.id}
            AND dog_id=${id}
            `)
            log('info', 'dog-read', {
                reason: `user ${user.id} requested dog data ${id}`,
                path: request.url,
                method: request.method,
                ip: request.ip,
                ua: request.headers['user-agent'] || null
            })

            if (dogList.rowCount > 0) return reply.status(200).json(dogList.rows[0])

            reply.status(404).json({ message: 'Dog not found' })
        })
    } catch(err) {
        log('error', 'read-error', {
            reason: err,
            path: request.url,
            method: request.method,
            ip: request.ip,
            ua: request.headers['user-agent'] || null
        })
        return reply.status(500).json({ message: 'Error reading dog data.' })
    }
}
