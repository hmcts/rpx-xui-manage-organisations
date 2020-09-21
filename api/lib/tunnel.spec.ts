import * as assert from 'assert'
import * as chai from 'chai'
import { expect } from 'chai'
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
    let showFeatureStub: sinon.SinonStub

    beforeEach(() => {
        spiedLogger = { info: sinon.spy(), level: sinon.spy() } as unknown as Logger
        sinon.stub(log4js, 'getLogger').returns(spiedLogger)
        showFeatureStub = sinon.stub(configuration, 'showFeature')
        sinon.stub(configuration, 'getConfigValue').withArgs(LOGGING).returns('info')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should setup the proxy', () => {
        showFeatureStub.withArgs(FEATURE_PROXY_ENABLED).returns(true)
        process.env.MO_HTTP_PROXY = 'http://proxy.local'
        process.env.MO_NO_PROXY = 'http://noproxy.local'
        tunnel.init()
        expect(log4js.getLogger).to.be.calledWith('tunnel')
        assert.equal(spiedLogger.level, 'info')
        expect(spiedLogger.info).to.be.calledWith(
            'configuring global-agent: ', 'http://proxy.local', ' no proxy: ', 'http://noproxy.local')
        // Sinon cannot spy on createGlobalProxyAgent() and tunnel.init() returns nothing, so proxy agent creation
        // cannot be tested
    })

    it('should not setup the proxy', () => {
        showFeatureStub.withArgs(FEATURE_PROXY_ENABLED).returns(false)
        tunnel.init()
        // tslint:disable-next-line:no-unused-expression
        expect(spiedLogger.info).not.to.be.called
    })

    it('should clear the proxy configuration', () => {
        tunnel.end()
        assert.equal(process.env.MO_HTTP_PROXY, '')
        assert.equal(process.env.MO_NO_PROXY, '')
    } )
})
