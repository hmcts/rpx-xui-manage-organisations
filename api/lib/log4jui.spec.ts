import * as chai from 'chai'
import { expect } from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'

chai.use(sinonChai)

import * as log4js from 'log4js'
import * as configuration from '../configuration'
import * as log4jui from '../lib/log4jui'
import { isJUILogger } from '../lib/models'
import * as errorStack from './errorStack'

describe('log4jui', () => {
    afterEach(() => {
        sinon.restore()
    })

    describe('getLogger', () => {
        it('Should return an instance of JUILogger', () => {
            expect(isJUILogger(log4jui.getLogger(''))).to.equal(true)
        })
        it('Should return an instance of JUILogger containing a log4jui logger ', () => {
            expect((log4jui.getLogger('test')._logger as any).category).to.equal('test')
        })
    })

    describe('warn', () => {
        it('should log a warn with log4js', async () => {
            const spy = sinon.spy()
            sinon.stub(log4js, 'getLogger').returns({ warn: spy } as any)

            const logger = log4jui.getLogger('test')
            logger.warn('message')

            expect(spy).to.be.calledWith('message')
        })
    })

    describe('info', () => {
        it('should log an info with log4js', async () => {
            const spy = sinon.spy()
            sinon.stub(log4js, 'getLogger').returns({ info: spy } as any)

            const logger = log4jui.getLogger('test')
            logger.info('message')

            expect(spy).to.be.calledWith('message')
        })
    })

    describe('debug', () => {
        it('should log a debug with log4js', async () => {
            const spy = sinon.spy()
            sinon.stub(log4js, 'getLogger').returns({ debug: spy } as any)

            const logger = log4jui.getLogger('test')
            logger.debug('message')

            expect(spy).to.be.calledWith('message')
        })
    })

    describe('error', () => {
        it('should log an error with log4js', async () => {
            const spy = sinon.spy()
            // Set the category for the logger stub to "test", to check it is used when calling errorStack.push
            sinon.stub(log4js, 'getLogger').returns({ category: 'test', error: spy } as any)
            // Set the logging level to "error" to test calling errorStack.push
            sinon.stub(configuration, 'getConfigValue').returns('error')
            sinon.stub(errorStack, 'push')

            const logger = log4jui.getLogger('test')
            logger.error('message')

            expect(spy).to.be.calledWith('message')
            expect(errorStack.push).to.be.calledWith(['test', 'message'])
        })
    })

    describe('off', () => {
        it('should default the logging level to "off" if none is provided', async () => {
            const spy = sinon.spy()
            sinon.stub(log4js, 'getLogger').returns({ debug: spy } as any)
            // Ensure no logging level is set
            sinon.stub(configuration, 'getConfigValue').returns(null)

            const logger = log4jui.getLogger('test')
            logger.debug('message')

            expect(spy).to.be.calledWith('message')
            expect(logger._logger.level).to.equal('off')
        })
    })
})
