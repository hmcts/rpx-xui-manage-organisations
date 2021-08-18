import * as chai from 'chai'
import { expect } from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'
import * as configuration from '../configuration'
import { JURISDICTIONS } from '../configuration/references'
import { handleJurisdictions } from './index'

chai.use(sinonChai)

// Create a custom Error class for testing purposes. (Express is written in JavaScript, which allows the standard Error
// object to be augmented with properties "status", "statusCode", etc. The same is not true in TypeScript.)
// See https://stackoverflow.com/questions/41102060/typescript-extending-error-class
class AppError extends Error {
    statusCode: number

    constructor(message?: string, statusCode?: number) {
        super(message) // 'Error' breaks prototype chain here
        this.name = 'AppError'
        Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain

        this.statusCode = statusCode
    }
}

describe('jurisdictions index', () => {
    const req = mockReq()
    let res: any

    beforeEach(() => {
        sinon.stub(configuration, 'getConfigValue').returns(['Probate', 'Divorce', 'SSCS'])

        // Need a new mock res for each test because res.send will be manipulated for one of the tests
        res = mockRes()
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should send an HTTP response with a list of Jurisdiction value objects, keyed on "id"', async () => {
        // Test the function and check expectations
        await handleJurisdictions(req, res)
        expect(configuration.getConfigValue).to.be.calledWith(JURISDICTIONS)
        expect(res.send).to.be.calledWith([
            {id: 'Probate'},
            {id: 'Divorce'},
            {id: 'SSCS'},
        ])
    })

    it('should return an HTTP error response', async () => {
        // Setup the mock res object to throw an exception on the first res.send call
        const errorCode = 599
        const error = new AppError('Dummy error', errorCode)
        res.send.onFirstCall().throws(error)

        const errorReport = JSON.stringify({
            apiError: error,
            apiStatusCode: errorCode,
            message: 'List of jurisdictions route error',
        })

        // Test the function and check expectations
        await handleJurisdictions(req, res)
        expect(res.send).to.be.calledWith(errorReport)
        expect(res.status).to.be.calledWith(errorCode)
    })
})
