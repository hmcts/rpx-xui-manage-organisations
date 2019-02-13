import * as log4js from 'log4js'
import config from './config'
import { Store } from './store'
import { isObject } from './util'

const logger = log4js.getLogger('scss engine')
logger.level = config.logging ? config.logging : 'OFF'

export async function pushStack(req, stack) {
    logger.info('Pushing stack')
    const jurisdiction = req.params.jurId
    const caseId = req.params.caseId
    const caseTypeId = req.params.caseTypeId.toLowerCase()
    let newStack = [...stack]

    const store = new Store(req)
    const currentStack = await store.get(`decisions_stack_${jurisdiction}_${caseTypeId}_${caseId}`)
    if (currentStack === '' || currentStack === null) {
        newStack = [...currentStack, stack]
    }
    store.set(`decisions_stack_${jurisdiction}_${caseTypeId}_${caseId}`, newStack)
}

export async function shiftStack(req, variables) {

    const jurisdiction = req.params.jurId
    const caseId = req.params.caseId
    const caseTypeId = req.params.caseTypeId.toLowerCase()

    const store = new Store(req)

    let matching = false
    let currentItem

    const currentStack = await store.get(`decisions_stack_${jurisdiction}_${caseTypeId}_${caseId}`)

    while (!matching && currentStack.length) {

        logger.info(`popped stack ${currentStack}`)
        currentItem = currentStack.shift()
        logger.info(`Got item ${currentItem}`)
        logger.info(currentItem)
        await store.set(`decisions_stack_${jurisdiction}_${caseTypeId}_${caseId}`, currentStack)

        if (isObject(currentItem)) {
            const key = Object.keys(currentItem)[0]
            if (Object.keys(currentItem).length) { // item is an object with variable to evaluate
                console.log('key:', key, variables[key])
                matching = (variables[key]) ? currentItem[key] : null
                currentItem = currentItem[key]
            }
        } else {
            logger.warn('no object')
        }

    }

    return currentItem
}

export async function stackEmpty(req) {
    const store = new Store(req)
    const jurisdiction = req.params.jurId
    const caseId = req.params.caseId
    const caseTypeId = req.params.caseTypeId.toLowerCase()
    const currentStack = await store.get(`decisions_stack_${jurisdiction}_${caseTypeId}_${caseId}`)

    return !currentStack.length
}

export function forwardStack(register, stateId) {

    const index = register.map(x => (Object.values(x)[0] as any)).indexOf(stateId)
    logger.info(`Forwarding stack at ${index} for ${stateId}`)
    return register.slice(index + 1)
}
