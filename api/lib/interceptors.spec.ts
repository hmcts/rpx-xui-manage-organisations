import * as chai from 'chai'
import { expect } from 'chai'
import * as log4js from 'log4js'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'

chai.use(sinonChai)

import * as configuration from '../configuration'
import { MAX_LOG_LINE } from '../configuration/references'
import * as errorStack from './errorStack'
import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors'

describe('interceptors', () => {
    const response = {
        config: {
            metadata: {
                startTime: new Date(),
            },
            method: 'POST',
            url: 'http://test2.com',
        },
    }
    const request = {
        method: 'GET',
        url: 'http://test.com',
    }
    const errorWithResponseDataDetails = {
        config: {
            data: {
                authenticated: false,
            },
            metadata: {
                startTime: new Date(),
            },
            method: 'GET',
            response: {
                status: 500,
            },
            url: 'http://test.com',
        },
        request: {},
        response: {
            data: {
                details: {
                    error: true,
                },
            },
        },
    }
    const errorWithoutResponseDataDetailsWithResponseStatus = {
        config: {
            data: {
                authenticated: false,
            },
            metadata: {
                startTime: new Date(),
            },
            method: 'GET',
            response: {
                status: 500,
            },
            url: 'http://test.com',
        },
        request: {},
        response: {
            data: {
                other: 'random',
            },
            status: 500,
        },
    }
    const errorWithoutResponseDataDetailsOrResponseStatus = {
        config: {
            data: {
                authenticated: false,
            },
            metadata: {
                startTime: new Date(),
            },
            method: 'GET',
            response: {
                status: 500,
            },
            url: 'http://test.com',
        },
        request: {},
        response: {
            data: {
                other: 'random',
            },
        },
    }

    beforeEach(() => {
        sinon.stub(configuration, 'getConfigValue').withArgs(MAX_LOG_LINE).returns(20)
        sinon.stub(errorStack, 'push')
    })

    afterEach(() => {
        sinon.restore()
    })

    describe('requestInterceptor', () => {
        it('Should log outbound request', () => {
            const spy = sinon.spy()
            sinon.stub(log4js, 'getLogger').returns({ info: spy } as any)
            requestInterceptor(request)
            expect(spy).to.be.calledWith('GET to http://test.com')
        })
        it('Should return request unmutilated', () => {
            const result = requestInterceptor(request)
            expect(result).to.be.equal(request)
        })
    })

    describe('successInterceptor', () => {
        it('Should log returned response', () => {
            const spy = sinon.spy()
            sinon.stub(log4js, 'getLogger').returns({ info: spy } as any)
            successInterceptor(response)
            expect(spy).to.be.calledWith(sinon.match(/^Success on POST to http:\/\/test2.com \([0-9]+\)$/))
        })
        it('Should return response unmutilated', () => {
            const result = successInterceptor(response)
            expect(result).to.be.equal(response)
        })
    })

    describe('errorInterceptor', () => {
        it('Should log returned response where response data details exist', () => {
            const spy = sinon.spy()
            sinon.stub(log4js, 'getLogger').returns({ error: spy } as any)
            errorInterceptor(errorWithResponseDataDetails).catch( () => {
                expect(spy).to.be.calledWith(sinon.match(
                    /^Error on GET to http:\/\/test.com in \([0-9]+\) - \[object Object\] \n\s*{"error":true}$/))
                expect(errorStack.push).to.be.calledWith(['request', sinon.match.object])
                expect(errorStack.push).to.be.calledWith(['response', sinon.match.object])
            })
        })
        it('Should log returned response where response data details do not exist but response status does', () => {
            const spy = sinon.spy()
            sinon.stub(log4js, 'getLogger').returns({ error: spy } as any)
            errorInterceptor(errorWithoutResponseDataDetailsWithResponseStatus).catch( () => {
                expect(spy).to.be.calledWith(sinon.match(
                    /^Error on GET to http:\/\/test.com in \([0-9]+\) - \[object Object\] \n\s*{\n\s*"other": "random"\n\s*\[truncated\]$/))
                expect(errorStack.push).to.be.calledWith(['request', sinon.match.object])
                expect(errorStack.push).to.be.calledWith(['response', sinon.match.object])
            })
        })
        it('Should log returned response where neither response data details nor response status exist', () => {
            const spy = sinon.spy()
            sinon.stub(log4js, 'getLogger').returns({ error: spy } as any)
            errorInterceptor(errorWithoutResponseDataDetailsOrResponseStatus).catch( () => {
                expect(spy).to.be.calledWith(sinon.match(
                    /^Error on GET to http:\/\/test.com in \([0-9]+\) - \[object Object\] \n\s*null$/))
                expect(errorStack.push).to.be.calledWith(['request', sinon.match.object])
                expect(errorStack.push).to.be.calledWith(['response', sinon.match.object])
            })
        })
    })
})
