import * as chai from 'chai'
import { expect } from 'chai'
import * as config from 'config'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import {DEVELOPMENT, HTTP} from './constants'
import * as configuration from './index'
import {ENVIRONMENT, PROTOCOL} from './references'

chai.use(sinonChai)

describe('configuration', () => {
    let environmentSpy: sinon.SinonSpy

    beforeEach(() => {
        environmentSpy = sinon.spy(configuration, 'getEnvironment')
        sinon.spy(configuration, 'hasConfigValue')
        sinon.spy(configuration, 'environmentCheckText')
        sinon.spy(configuration, 'getProtocol')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should get the environment', () => {
        process.env.NODE_CONFIG_ENV = 'test'
        configuration.getEnvironment()
        expect(configuration.getEnvironment).returned('test')
    })

    it('should have the specified config value', () => {
        sinon.stub(config, 'has').withArgs('abc').returns(true)
        configuration.hasConfigValue('abc')
        expect(configuration.hasConfigValue).returned(true)
    })

    it('should generate the environment check text', () => {
        process.env.NODE_CONFIG_ENV = 'test'
        sinon.stub(config, 'get').withArgs(ENVIRONMENT).returns('testing')
        configuration.environmentCheckText()
        expect(configuration.environmentCheckText).returned(
            'NODE_CONFIG_ENV is set as test therefore we are using the testing config.')
    })

    it('should get the protocol for a local environment', () => {
        environmentSpy.restore()
        sinon.stub(configuration, 'getEnvironment').returns(DEVELOPMENT)
        configuration.getProtocol()
        expect(configuration.getProtocol).returned(HTTP)
    })

    it('should get the protocol for a non-local environment', () => {
        environmentSpy.restore()
        sinon.stub(configuration, 'getEnvironment').returns('Production')
        sinon.stub(configuration, 'getConfigValue').withArgs(PROTOCOL).returns('https')
        configuration.getProtocol()
        expect(configuration.getProtocol).returned('https')
    })
})
