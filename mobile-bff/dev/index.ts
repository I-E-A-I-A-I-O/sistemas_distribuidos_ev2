import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })
import Express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { authRouter } from './routers/auth.router'
import { log } from './helpers/logstash'
import { apiRouter } from './routers/api.router'

const PORT = process.env.MOBILE_BFF_PORT || 3000
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

server.use('/mobile', authRouter)
server.use('/mobile', apiRouter)

server.listen(PORT, () => {
    log('info', 'server-started', { port: PORT, name: 'mobile-bff' })
})
