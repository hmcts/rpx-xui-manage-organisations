import * as chai from 'chai'
import { expect } from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'

chai.use(sinonChai)

import * as configuration from '../configuration'
import { MAX_LOG_LINE } from '../configuration/references'
import * as errorStack from './errorStack'
import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors'
import * as log4jui from './log4jui'

describe('interceptors', () => {
    const response = {
        config: {
            metadata: {
                startTime: new Date(),
            },
            method: 'POST',
            url: 'http://test2.com',
        },
        status: 200,
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
        status: 500,
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
        status: 500,
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
        status: 500,
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
            sinon.stub(log4jui, 'getLogger').returns({ info: spy } as any)
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
            const stub = sinon.stub()
            sinon.stub(log4jui, 'getLogger').returns({ info: spy, trackRequest: stub } as any)
            successInterceptor(response)
            expect(stub).to.be.calledWith({
                duration: sinon.match.number,
                name: `Service ${response.config.method.toUpperCase()} call`,
                resultCode: response.status,
                success: true,
                url: response.config.url,
            })
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
            const stub = sinon.stub()
            sinon.stub(log4jui, 'getLogger').returns({ error: spy, trackRequest: stub } as any)
            errorInterceptor(errorWithResponseDataDetails).catch( () => {
                expect(stub).to.be.calledWith({
                    duration: sinon.match.number,
                    name: `Service ${errorWithResponseDataDetails.config.method.toUpperCase()} call`,
                    resultCode: errorWithResponseDataDetails.status,
                    success: true,
                    url: errorWithResponseDataDetails.config.url,
                })
                expect(spy).to.be.calledWith(sinon.match(
                    /^Error on GET to http:\/\/test.com in \([0-9]+\) - \[object Object\] \n\s*{"error":true}$/))
                expect(errorStack.push).to.be.calledWith(['request', sinon.match.object])
                expect(errorStack.push).to.be.calledWith(['response', sinon.match.object])
            })
        })
        it('Should log returned response where response data details do not exist but response status does', () => {
            const spy = sinon.spy()
            const stub = sinon.stub()
            sinon.stub(log4jui, 'getLogger').returns({ error: spy, trackRequest: stub } as any)
            errorInterceptor(errorWithoutResponseDataDetailsWithResponseStatus).catch( () => {
                expect(stub).to.be.calledWith({
                    duration: sinon.match.number,
                    name: `Service ${errorWithoutResponseDataDetailsWithResponseStatus.config.method.toUpperCase()} call`,
                    resultCode: errorWithoutResponseDataDetailsWithResponseStatus.status,
                    success: true,
                    url: errorWithoutResponseDataDetailsWithResponseStatus.config.url,
                })
                expect(spy).to.be.calledWith(sinon.match(
                    /^Error on GET to http:\/\/test.com in \([0-9]+\) - \[object Object\] \n\s*{\n\s*"other": "random"\n\s*\[truncated\]$/))
                expect(errorStack.push).to.be.calledWith(['request', sinon.match.object])
                expect(errorStack.push).to.be.calledWith(['response', sinon.match.object])
            })
        })
        it('Should log returned response where neither response data details nor response status exist', () => {
            const spy = sinon.spy()
            const stub = sinon.stub()
            sinon.stub(log4jui, 'getLogger').returns({ error: spy, trackRequest: stub } as any)
            errorInterceptor(errorWithoutResponseDataDetailsOrResponseStatus).catch( () => {
                expect(stub).to.be.calledWith({
                    duration: sinon.match.number,
                    name: `Service ${errorWithoutResponseDataDetailsOrResponseStatus.config.method.toUpperCase()} call`,
                    resultCode: errorWithoutResponseDataDetailsOrResponseStatus.status,
                    success: true,
                    url: errorWithoutResponseDataDetailsOrResponseStatus.config.url,
                })
                expect(spy).to.be.calledWith(sinon.match(
                    /^Error on GET to http:\/\/test.com in \([0-9]+\) - \[object Object\] \n\s*null$/))
                expect(errorStack.push).to.be.calledWith(['request', sinon.match.object])
                expect(errorStack.push).to.be.calledWith(['response', sinon.match.object])
            })
        })
    })
})
