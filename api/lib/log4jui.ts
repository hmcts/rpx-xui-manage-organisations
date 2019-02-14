import * as log4js from 'log4js'
import config from './config'
import * as errorStack from '../lib/errorStack'
import { client } from './appInsights'


let logger = null

// This is done to mimic log4js calls

export function getLogger(category: string) {
    logger = log4js.getLogger(category)
    logger.level = config.logging || 'off'

    return {
        _logger: logger,
        debug,
        error,
        info,
        trackRequest,
        warn,
    }
}

function info(...messages: any[]) {
    let fullMessage = ''

    for (const message of messages) {
        fullMessage += message
    }

    const category = this._logger.category
    if (client) {
        client.trackTrace({ message: `[INFO] ${category} - ${fullMessage}` })
    }
    this._logger.info(fullMessage)
}

function warn(...messages: any[]) {
    let fullMessage = ''

    for (const message of messages) {
        fullMessage += message
    }

    this._logger.warn(fullMessage)
}

function debug(...messages: any[]) {
    let fullMessage = ''

    for (const message of messages) {
        fullMessage += message
    }
    this._logger.debug(fullMessage)
}

function trackRequest(obj: any) {
    if (client) {
        client.trackRequest(obj)
    }
}

function error(...messages: any[]) {
    let fullMessage = ''

    for (const message of messages) {
        fullMessage += message
    }

    const category = this._logger.category
    if (client) {
        client.trackException({ exception: new Error(`[ERROR] ${category} - ${fullMessage}`) })
    }
    this._logger.error(fullMessage)

    if (config.logging === 'debug' || config.logging === 'error') {
        errorStack.push([category, fullMessage])
    }
}

