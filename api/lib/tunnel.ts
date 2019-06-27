import * as globalTunnel from 'global-tunnel-ng'
import { config } from './config'

export const tunnel = globalTunnel

export function init() {
    globalTunnel.initialize({
        host: config.proxy.host,
        port: config.proxy.port,
    })
}
