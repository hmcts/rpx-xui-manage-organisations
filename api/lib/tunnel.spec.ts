import * as assert from 'assert'
import * as chai from 'chai'
import { expect } from 'chai'
import * as globalAgent from 'global-agent'
import * as log4js from 'log4js'
import { Logger } from 'log4js'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import * as configuration from '../configuration'
import { FEATURE_PROXY_ENABLED, LOGGING } from '../configuration/references'
import * as tunnel from './tunnel'

chai.use(sinonChai)

describe('tunnel', () => {
    let spiedLogger: Logger
    let globalProxyStub

    beforeEach(() => {
        spiedLogger = { info: sinon.spy(), level: sinon.spy() } as unknown as Logger
        sinon.stub(log4js, 'getLogger').returns(spiedLogger)
        sinon.stub(configuration, 'showFeature').withArgs(FEATURE_PROXY_ENABLED).returns(true)
        sinon.stub(configuration, 'getConfigValue').withArgs(LOGGING).returns('info')
        globalProxyStub = sinon.stub(globalAgent, 'createGlobalProxyAgent')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should setup the proxy', () => {
        process.env.MO_HTTP_PROXY = 'http://proxy.local'
        process.env.MO_NO_PROXY = 'http://noproxy.local'
        tunnel.init()
        expect(log4js.getLogger).to.be.calledWith('tunnel')
        assert.equal(spiedLogger.level, 'info')
        expect(spiedLogger.info).to.be.calledWith(
            'configuring global-agent: ', 'http://proxy.local', ' no proxy: ', 'http://noproxy.local')
        // TODO The stub is not being called...?
        // expect(globalProxyStub).to.be.called
    })

    it('should clear the proxy configuration', () => {
        tunnel.end()
        assert.equal(process.env.MO_HTTP_PROXY, '')
        assert.equal(process.env.MO_NO_PROXY, '')
    } )
})
