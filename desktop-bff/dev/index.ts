import dotenv from 'dotenv'
dotenv.config()
import Express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { authRouter } from './routers/auth.router'
import { log } from './helpers/logstash'
import fetch from 'node-fetch'

const PORT = process.env.PORT || 3000
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
