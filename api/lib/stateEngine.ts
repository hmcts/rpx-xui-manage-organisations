// TODO: It looks like this is no longer being used? Ask team and remove.
import { map } from 'p-iteration'
import { config } from '../lib/config'
import * as log4jui from './log4jui'
import { some } from '../lib/util'

import { forwardStack, pushStack, shiftStack, stackEmpty } from './stack'

const logger = log4jui.getLogger('state engine')

// does not handle OR yet
export function handleCondition(conditionNode, variables) {
    // index 0 hardcoded, not interating through for OR
    const key = Object.keys(conditionNode.condition[0])[0]

    if (variables[key] === conditionNode.condition[0][key]) {
        return conditionNode.result // eslint-disable-line no-param-reassign
    }
    return null
}

export function handleState(stateNode, variables) {
    if (stateNode.condition) {
        return handleCondition(stateNode, variables)
    } else if (stateNode.conditions) {
        logger.info(`Found multiple conditions for ${stateNode.state}`)
        return some(stateNode.conditions, conditions => handleCondition(conditions, variables))
    } else if (stateNode.result) {
        logger.info(`State result without conditional: ${stateNode.result}`)
        return stateNode.result
    }

    return null
}

export function handleInstruction(instruction, stateId, variables) {
    if (instruction.state && instruction.state === stateId) {
        return handleState(instruction, variables)
    } else if (instruction.states) {
        logger.info(`Found multiple states for ${instruction.event}`)
        return some(instruction.states, stateNode => {
            if (stateNode.state === stateId) {
                return handleState(stateNode, variables)
            }

            return false
        })
    } else {
        // no states
        logger.info(`Instruction result without state: ${instruction.result} `)
        return instruction.result
    }
}

export function getRegister(mapping) {
    return mapping.filter(mapInstruction => mapInstruction.register)
}

export async function process(req, res, mapping, payload, templates, store) {
    const jurisdiction = req.params.jurId
    const caseId = req.params.caseId
    const caseTypeId = req.params.caseTypeId.toLowerCase()
    const stateId = req.params.stateId

    if (!req.body) {
        req.body = {}
    }

    const event = req.body.event
    let variables = req.body.formValues
    let result = null
    let meta = {}
    let newRoute = null

    if (variables) {
        // get current store
        let stored = await store.get(`decisions_${jurisdiction}_${caseTypeId}_${caseId}`)

        if (!(stored + '').length) {
            stored = {}
        }
        variables = { ...stored, ...variables }

        await store.set(`decisions_${jurisdiction}_${caseTypeId}_${caseId}`, variables)
    }

    if (req.method === 'POST') {
        await map(mapping, async (instruction: any) => {
            if (instruction.event === event) {
                // event is the main index and so there can only be one instruction per event - exit after finding
                logger.info(`Found matching event for ${event} `)
                result = handleInstruction(instruction, stateId, variables)
                logger.info(`result ${result}`)
                if (result === '<register>') {
                    const registerInstruction = getRegister(mapping)
                    await pushStack(req, registerInstruction[0].register)
                    result = await shiftStack(req, variables)
                    logger.info(`Popped stack ${registerInstruction[0].register}`)
                } else if (result === '...') {
                    if (await stackEmpty(req)) {
                        logger.info('Recalculating route ...')
                        const registerInstruction = getRegister(mapping)
                        await pushStack(req, forwardStack(registerInstruction[0].register, stateId))
                    }

                    result = await shiftStack(req, variables)
                } else if (result === '[state]') {
                    result = req.params.stateId
                } else if (result === '.') {
                    result = await payload(req, res, variables)
                    if (!result) {
                        return
                    }
                }

                if (result) {
                    meta = templates[caseTypeId][result]
                    newRoute = result
                }
            }
            result = true
            return false
        })
    } else {
        // reset for testing
        if (stateId === 'reset') {
            logger.warn(`reseting decisions_${jurisdiction}_${caseTypeId}_${caseId}`)
            await store.set(`decisions_${jurisdiction}_${caseTypeId}_${caseId}`, {})

            return
        }

        meta = templates[caseTypeId][stateId]
        result = true
    }

    if (result) {
        variables = (await store.get(`decisions_${jurisdiction}_${caseTypeId}_${caseId}`)) || {}

        const response = {
            formValues: variables,
            meta,
            newRoute,
        }
        req.session.save(() => res.send(JSON.stringify(response)))
    }
}
