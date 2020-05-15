import { AxiosResponse } from 'axios'
import * as chai from 'chai'
import { expect } from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'
import * as configuration from '../configuration'
import { SERVICES_RD_PROFESSIONAL_API_PATH } from '../configuration/references'
import { http } from '../lib/http'
import * as refdataUserUrlUtil from '../refdataUserUrlUtil'
import { handleUserListRoute } from './index'

chai.use(sinonChai)

describe('userList index', () => {
    const req = mockReq()
    req.http = http(req)
    const res = mockRes()

    beforeEach(() => {
        sinon.stub(configuration, 'getConfigValue').returns('apiPath')
        sinon.stub(refdataUserUrlUtil, 'getRefdataUserUrl').returns('refdata/users/')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should return User List data and send it in an HTTP response', async () => {
        // Stub the http.get call to return a mock response
        const mockAxiosResponse = {
            data: 'test',
        }
        sinon.stub(req.http, 'get').resolves(mockAxiosResponse as AxiosResponse)

        // Test the function and check expectations
        await handleUserListRoute(req, res)
        expect(configuration.getConfigValue).to.be.calledWith(SERVICES_RD_PROFESSIONAL_API_PATH)
        expect(refdataUserUrlUtil.getRefdataUserUrl).to.be.calledWith('apiPath')
        expect(req.http.get).to.be.calledWith('refdata/users/')
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
            statusCode: errorCode,
        }
        sinon.stub(req.http, 'get').throws(error)

        const errorReport = {
            apiError: errorMessage,
            apiStatusCode: errorCode,
            message: 'List of users route error',
        }

        // Test the function and check expectations
        await handleUserListRoute(req, res)
        expect(res.status).to.be.calledWith(errorCode)
        expect(res.send).to.be.calledWith(errorReport)
    })
})
