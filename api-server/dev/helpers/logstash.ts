import { createSocket } from 'dgram'
import { hostname } from 'os'

const client = createSocket('udp4')
const host = hostname()
const [LS_HOST, LS_PORT] = process.env.LOGSTASH!.split(':')
const NODE_ENV = process.env.NODE_ENV

export const log = async (severity: 'error' | 'warn' | 'info' | 'debug', type: string, fields: any) => {
    const payload = JSON.stringify({
        '@timestamp': (new Date()).toISOString(),
        '@version': 1,
        app: 'api-server',
        environment: NODE_ENV,
        severity,
        type,
        fields,
        host
    })
    console.log(payload)
    client.send(payload, Number.parseInt(LS_PORT), LS_HOST)
}
