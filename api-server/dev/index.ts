import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })
import Express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { crudRouter } from './routers/crud.router'
import { log } from './helpers/logstash'

const PORT = process.env.API_SERVER_PORT || 3002
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

server.use('/api', crudRouter)

server.listen(PORT, () => {
    log('info', 'server-started', { port: PORT, name: 'auth-server' })
})
