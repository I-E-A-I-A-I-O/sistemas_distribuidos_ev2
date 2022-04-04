import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })
import Express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { authRouter } from './routers/auth.router'
import { log } from './helpers/logstash'
import fetch from 'node-fetch'

const PORT = process.env.DESKTOP_BFF_PORT || 3001
const server = Express()

server.use(helmet())
server.use(cors())
server.use(Express.json())

server.use(async (request, reply, next) => {
    log('info', 'request-incoming', {
        path: request.url,
        method: request.method,
        ip: request.ip,
        ua: request.headers['user-agent'] || null
    })
    next()
})

server.get('/health', async (request, reply) => {
    reply.sendStatus(200)
})

server.use('/desktop', authRouter)

server.listen(PORT, () => {
    log('info', 'server-started', { port: PORT, name: 'desktop-bff' })
})
