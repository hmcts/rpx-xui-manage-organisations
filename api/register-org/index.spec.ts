import axios from 'axios'
import { AxiosInstance } from 'axios'
import { AxiosResponse } from 'axios'
import * as chai from 'chai'
import { expect } from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'
import * as configuration from '../configuration'
import { SERVICE_S2S_PATH, SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import * as payloadBuilder from '../lib/payloadBuilder'
import * as s2sTokenGeneration from '../lib/s2sTokenGeneration'
import { handleRegisterOrgRoute } from './index'

chai.use(sinonChai)

describe('register-org index', () => {
    const ERROR_GENERATING_S2S_TOKEN = 'Error generating S2S Token'
    const s2sServicePath = '/s2s'
    const req = mockReq()
    const res = mockRes()
    let fakeAxiosInstance: AxiosInstance

    beforeEach(() => {
        // Setup a stub for getConfigValue that returns different values based on the argument passed to it
        const stub = sinon.stub(configuration, 'getConfigValue')
        stub.withArgs(SERVICE_S2S_PATH).returns(s2sServicePath)
        stub.withArgs(SERVICES_RD_PROFESSIONAL_API_PATH).returns('apiPath')

        // Create a dummy request body
        req.body = {
            fromValues: {
                value1: 'One',
                value2: 'Two',
            },
        }

        sinon.stub(payloadBuilder, 'makeOrganisationPayload').returns({ name: 'Test organisation' })

        // Ensure that when handleRegisterOrgRoute() calls http(req), its axios.create() function call returns a fake AxiosInstance
        fakeAxiosInstance = {
            interceptors: {
                request: {
                    use: sinon.stub(),
                },
                response: {
                    use: sinon.stub(),
                },
            },
            post: Function(),
        } as unknown as AxiosInstance
        sinon.stub(axios, 'create').returns(fakeAxiosInstance)
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should post the Register Organisation request and send the returned data in an HTTP response', async () => {
        sinon.stub(s2sTokenGeneration, 'generateS2sToken').resolves('abc123')

        // Stub the fakeAxiosInstance.post call to return a mock response
        sinon.stub(fakeAxiosInstance, 'post').resolves({ data: 'test' } as AxiosResponse)

        // Test the function and check expectations
        await handleRegisterOrgRoute(req, res)
        expect(configuration.getConfigValue).to.be.calledWith(SERVICE_S2S_PATH)
        expect(configuration.getConfigValue).to.be.calledWith(SERVICES_RD_PROFESSIONAL_API_PATH)
        expect(payloadBuilder.makeOrganisationPayload).to.be.calledWith({ value1: 'One', value2: 'Two' })
        expect(s2sTokenGeneration.generateS2sToken).to.be.calledWith(s2sServicePath)

        const options = {
            headers: { 'ServiceAuthorization': 'Bearer abc123' },
        }
        expect(fakeAxiosInstance.post).to.be.calledWith('apiPath/refdata/internal/v1/organisations',
            { name: 'Test organisation' }, options)
        expect(res.send).to.be.calledWith('test')
    })

    it('should return an HTTP 500 error response if there is an error generating the S2S token', async () => {
        // Stub generateS2sToken to throw an exception
        sinon.stub(s2sTokenGeneration, 'generateS2sToken').throws(new Error(ERROR_GENERATING_S2S_TOKEN))

        // Test the function and check expectations
        await handleRegisterOrgRoute(req, res)
        expect(res.status).to.be.calledWith(500)
        expect(res.send).to.be.calledWith({ errorMessage: ERROR_GENERATING_S2S_TOKEN, errorOnPath: s2sServicePath })
    })

    it('should return an HTTP error response', async () => {
        sinon.stub(s2sTokenGeneration, 'generateS2sToken').resolves('abc123')

        // Stub the fakeAxiosInstance.post call to throw an exception
        const errorMessage = 'Something went wrong'
        const errorCode = 599
        const errorDescription = 'There was an error with the request'
        const error = {
            data: {
                errorDescription,
                errorMessage,
            },
            status: errorCode,
        }
        sinon.stub(fakeAxiosInstance, 'post').throws(error)

        const errorReport = {
            apiError: errorMessage,
            apiErrorDescription: errorDescription,
            statusCode: errorCode,
        }

        // Test the function and check expectations
        await handleRegisterOrgRoute(req, res)
        expect(res.status).to.be.calledWith(errorCode)
        expect(res.send).to.be.calledWith(errorReport)
    })
})
