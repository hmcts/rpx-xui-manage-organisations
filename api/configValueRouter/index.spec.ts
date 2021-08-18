import * as chai from 'chai'
import { expect } from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'
import * as configuration from '../configuration'
import { handleAddressRoute } from './index'

chai.use(sinonChai)

describe('configValueRouter index', () => {
    const req = mockReq()
    const res = mockRes()

    beforeEach(() => {
        sinon.stub(configuration, 'getConfigValue').returns('some config value')

        // Create a dummy request with "configurationKey" query string parameter
        req.query = {
            configurationKey: 'abc',
        }
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should get the configuration value and send it in an HTTP response', async () => {
        // Stub the hasConfigValue call to return true
        sinon.stub(configuration, 'hasConfigValue').returns(true)

        // Test the function and check expectations
        await handleAddressRoute(req, res)
        expect(configuration.getConfigValue).to.be.calledWith('abc')
        expect(res.send).to.be.calledWith('some config value')
    })

    it('should return an HTTP Bad Request (400) response', async () => {
        // Stub the hasConfigValue call to return false
        sinon.stub(configuration, 'hasConfigValue').returns(false)

        const errorCode = 400
        const errorReport = {
            apiStatusCode: errorCode,
            message: 'Missing Key not found for abc',
        }

        // Test the function and check expectations
        await handleAddressRoute(req, res)
        expect(res.status).to.be.calledWith(errorCode)
        expect(res.send).to.be.calledWith(errorReport)
    })
})
