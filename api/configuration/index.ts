import * as config from 'config'
import {DEVELOPMENT, HTTP} from './constants'
import {ENVIRONMENT, PROTOCOL} from './references'

/**
 * Get Environment
 *
 * See Readme for more information on how the configuration file is set.
 * 'Environmental Variables Setup & Error Handling'
 *
 * @see Readme
 * @returns {string} ie. - development / preview / aat / ithc, prod
 */
export const getEnvironment = () => process.env.NODE_CONFIG_ENV

/**
 * Get Configuration Value
 *
 * Returns the configuration value, using a config reference. It uses the reference to pull out the value
 * from the .yaml file
 *
 * @see /config .yaml
 * @see references.ts
 * @param reference - ie. 'services.ccdDefApi'
 */
export const getConfigValue = reference => config.get(reference)

/**
 * Get Idam Secret
 *
 * The Idam secret is contained within the Azure Key Vault, and not within our .yaml file. All references to process.env
 * are managed from this file therefore we call process.env.IDAM_SECRET here.
 *
 * @returns {string}
 */
export const getIdamSecret = () => process.env.IDAM_SECRET

/**
 * Get S2S Secret
 *
 * The S2S secret is contained within the Azure Key Vault, and not within our .yaml file. All references to process.env
 * are managed from this file therefore we call process.env.S2S_SECRET here.
 *
 * @returns {string}
 */
export const getS2SSecret = () => process.env.S2S_SECRET

/**
 * Generate Environment Check Text
 *
 * We generate text to be used for debugging purposes, so as the person attempting to initialise the application knows
 * what the NODE_CONFIG_ENV is set as and what config file is being used.
 */
export const environmentCheckText = () => `NODE_CONFIG_ENV is set as ${process.env.NODE_CONFIG_ENV} therefore we are using the ${config.get(ENVIRONMENT)} config.`

/**
 * Get Protocol
 *
 * If running locally we return 'http'
 *
 * @returns {string | string}
 */
export const getProtocol = () => getEnvironment() === DEVELOPMENT ? HTTP : getConfigValue(PROTOCOL)
