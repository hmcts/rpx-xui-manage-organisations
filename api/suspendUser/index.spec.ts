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
import { suspendUser } from './index'

chai.use(sinonChai)

describe('suspendUser index', () => {
    const req = mockReq()
    req.http = http(req)
    const res = mockRes()

    beforeEach(() => {
        sinon.stub(configuration, 'getConfigValue').returns('apiPath')
        sinon.stub(refdataUserUrlUtil, 'getRefdataUserUrl').returns('refdata/users/')

        // Create a dummy request with userId param and a body
        req.params = {
            userId: '123456',
        }
        req.body = {
            data: 'someData',
        }
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should put the Suspend User request and send the returned data in an HTTP response', async () => {
        // Stub the http.put call to return a mock response
        const mockAxiosResponse = {
            data: 'test',
        }
        sinon.stub(req.http, 'put').resolves(mockAxiosResponse as AxiosResponse)

        // Test the function and check expectations
        await suspendUser(req, res)
        expect(configuration.getConfigValue).to.be.calledWith(SERVICES_RD_PROFESSIONAL_API_PATH)
        expect(refdataUserUrlUtil.getRefdataUserUrl).to.be.calledWith('apiPath')
        expect(req.http.put).to.be.calledWith('refdata/users/123456', req.body)
        expect(res.send).to.be.calledWith('test')
    })

    it('should return an HTTP error response', async () => {
        // Stub the http.put call to throw an exception
        const errorMessage = 'Something went wrong'
        const errorCode = 599
        const error = {
            data: {
                message: errorMessage,
            },
            status: errorCode,
        }
        sinon.stub(req.http, 'put').throws(error)

        const errorReport = {
            apiError: errorMessage,
            apiStatusCode: errorCode,
            message: errorMessage,
        }

        // Test the function and check expectations
        await suspendUser(req, res)
        expect(res.status).to.be.calledWith(errorCode)
        expect(res.send).to.be.calledWith(errorReport)
    })
})
