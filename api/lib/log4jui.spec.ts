import * as applicationinsights from 'applicationinsights'
import * as assert from 'assert'
import * as chai from 'chai'
import { expect } from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'

chai.use(sinonChai)

import * as log4js from 'log4js'
import * as configuration from '../configuration'
import { APP_INSIGHTS_KEY, LOGGING } from '../configuration/references'
import * as log4jui from '../lib/log4jui'
import { isJUILogger } from '../lib/models'
import * as appInsights from './appInsights'
import * as errorStack from './errorStack'

describe('log4jui', () => {
    let getConfigValueStub: sinon.SinonStub

    beforeEach(() => {
        sinon.stub(configuration, 'hasConfigValue').withArgs(APP_INSIGHTS_KEY).returns(true)
        getConfigValueStub = sinon.stub(configuration, 'getConfigValue').withArgs(APP_INSIGHTS_KEY).returns('app_insights_key')
        sinon.stub(applicationinsights.Configuration, 'start')

        // Stub tracking functions on the AppInsights client
        sinon.stub(applicationinsights.TelemetryClient.prototype, 'trackTrace')
        sinon.stub(applicationinsights.TelemetryClient.prototype, 'trackException')
        sinon.stub(applicationinsights.TelemetryClient.prototype, 'trackRequest')
    })

    afterEach(() => {
        sinon.restore()
    })

    describe('getLogger', () => {
        it('Should return an instance of JUILogger', () => {
            expect(isJUILogger(log4jui.getLogger(''))).to.equal(true)
        })

        it('Should return an instance of JUILogger containing a log4jui logger', () => {
            expect((log4jui.getLogger('test')._logger as any).category).to.equal('test')
        })
    })

    describe('warn', () => {
        it('should log a warn with log4js', () => {
            const spy = sinon.spy()
            sinon.stub(log4js, 'getLogger').returns({ warn: spy } as any)

            const logger = log4jui.getLogger('test')
            logger.warn('message')

            expect(spy).to.be.calledWith('message')
        })
    })

    describe('info', () => {
        it('should log an info with log4js', () => {
            const spy = sinon.spy()
            // Set the category for the logger stub to "testCategory", to check it is used when calling
            // appInsights.client.trackTrace
            sinon.stub(log4js, 'getLogger').returns({ category: 'testCategory', info: spy } as any)

            // Initialise AppInsights client to test trackTrace function call
            appInsights.initialiseAppInsights()

            const logger = log4jui.getLogger('test')
            logger.info('message')

            expect(spy).to.be.calledWith('message')
            expect(appInsights.client.trackTrace).to.be.calledWith({ message: '[INFO] testCategory - message'})
        })
    })

    describe('debug', () => {
        it('should log a debug with log4js', () => {
            const spy = sinon.spy()
            sinon.stub(log4js, 'getLogger').returns({ debug: spy } as any)

            const logger = log4jui.getLogger('test')
            logger.debug('message')

            expect(spy).to.be.calledWith('message')
        })
    })

    describe('error', () => {
        it('should log an error with log4js', () => {
            const spy = sinon.spy()
            // Set the category for the logger stub to "test", to check it is used when calling errorStack.push
            sinon.stub(log4js, 'getLogger').returns({ category: 'test', error: spy } as any)
            // Set the logging level to "error" to test calling errorStack.push
            getConfigValueStub.withArgs(LOGGING).returns('error')
            sinon.stub(errorStack, 'push')

            // Initialise AppInsights client to test trackException function call
            appInsights.initialiseAppInsights()

            const logger = log4jui.getLogger('test')
            logger.error('message')

            expect(spy).to.be.calledWith('message')

            // Can't use calledWith and pass in an Error instance because the error stacks will be different, so just
            // check the error message passed in is as expected
            // tslint:disable-next-line:no-unused-expression
            expect(appInsights.client.trackException).to.be.called
            const errorArg = appInsights.client.trackException.args[0][0]
            assert.equal(errorArg.exception.message, '[ERROR] test - message')

            // expect(errorStack.push).to.be.calledWith(['test', 'message'])
        })
    })

    describe('off', () => {
        it('should default the logging level to "off" if none is provided', () => {
            const spy = sinon.spy()
            sinon.stub(log4js, 'getLogger').returns({ debug: spy } as any)
            // Ensure no logging level is set
            getConfigValueStub.withArgs(LOGGING).returns(null)

            const logger = log4jui.getLogger('test')
            logger.debug('message')

            expect(spy).to.be.calledWith('message')
            expect(logger._logger.level).to.equal('off')
        })
    })

    describe('trackRequest', () => {
        it('should call trackRequest if AppInsights is initialised', () => {
            // Initialise AppInsights client to test trackRequest function call
            appInsights.initialiseAppInsights()

            const logger = log4jui.getLogger('test')
            logger.trackRequest({})

            expect(appInsights.client.trackRequest).to.be.calledWith({})
        })

        it('should not call trackRequest if AppInsights is not initialised', () => {
            // Ensure the appInsights client has been reset
            appInsights.resetAppInsights()

            const logger = log4jui.getLogger('test')
            logger.trackRequest({})

            // tslint:disable:no-unused-expression
            expect(appInsights.client).to.be.null
            expect(applicationinsights.TelemetryClient.prototype.trackRequest).not.to.be.called
            // tslint:enable:no-unused-expression
        })
    })
})
