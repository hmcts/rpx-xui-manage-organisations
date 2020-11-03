import axios from 'axios'
import { AxiosInstance } from 'axios'
import { AxiosResponse } from 'axios'
import * as chai from 'chai'
import { expect } from 'chai'
import { Request} from 'express'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'
import * as configuration from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import { http } from '../lib/http'
import { getOrganisationDetails } from './index'
import { handleOrganisationRoute } from './index'

chai.use(sinonChai)

describe('organisation index', () => {
    const req = mockReq()
    req.http = http(req)
    const res = mockRes()

    beforeEach(() => {
        sinon.stub(configuration, 'getConfigValue').returns('apiPath')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should return Organisation data and send it in an HTTP response', async () => {
        // Stub the http.get call to return a mock response
        const mockAxiosResponse = {
            data: 'test',
        }
        sinon.stub(req.http, 'get').resolves(mockAxiosResponse as AxiosResponse)

        // Test the function and check expectations
        await handleOrganisationRoute(req, res)
        expect(configuration.getConfigValue).to.be.calledWith(SERVICES_RD_PROFESSIONAL_API_PATH)
        expect(req.http.get).to.be.calledWith('apiPath/refdata/external/v1/organisations')
        expect(res.send).to.be.calledWith('test')
    })

    it('should return an HTTP error response', async () => {
        // Stub the http.get call to throw an exception
        const errorMessage = 'Something went wrong'
        const errorCode = 599
        const error = {
            data: {
                message: errorMessage,
            },
            status: errorCode,
        }
        sinon.stub(req.http, 'get').throws(error)

        const errorReport = {
            apiError: errorMessage,
            apiStatusCode: errorCode,
            message: 'Organisation route error',
        }

        // Test the function and check expectations
        await handleOrganisationRoute(req, res)
        expect(res.status).to.be.calledWith(errorCode)
        expect(res.send).to.be.calledWith(errorReport)
    })

    it('should get the Organisation details', () => {
        // Ensure that when getOrganisationDetails() calls http(req), its axios.create() function call returns a fake AxiosInstance
        const fakeAxiosInstance = {
            get: sinon.stub(),
            interceptors: {
                request: {
                    use: sinon.stub(),
                },
                response: {
                    use: sinon.stub(),
                },
            },
        } as unknown as AxiosInstance
        sinon.stub(axios, 'create').returns(fakeAxiosInstance)
        getOrganisationDetails({} as Request, 'http://local')
        expect(fakeAxiosInstance.get).to.be.calledWith('http://local/refdata/external/v1/organisations')
    })
})
