import axios from 'axios'
import { AxiosInstance } from 'axios'
import { AxiosResponse } from 'axios'
import * as chai from 'chai'
import { expect } from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as otp from 'otp'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import * as configuration from '../configuration'
import { MICROSERVICE, S2S_SECRET } from '../configuration/references'
import * as log4jui from './log4jui'
import { JUILogger } from './models/index'
import * as s2sTokenGeneration from './s2sTokenGeneration'

chai.use(sinonChai)
chai.use(chaiAsPromised)

describe('s2sTokenGeneration', () => {
    let otpStub: sinon.SinonStub
    let loggerErrorSpy: sinon.SinonSpy
    let loggerInfoSpy: sinon.SinonSpy
    let fakeAxiosInstance: AxiosInstance

    const s2sSecret = 'topSecret'
    const url = 'http://s2s.local'
    const microservice = 'xui_mo'
    const oneTimePassword = 'password'

    beforeEach(() => {
        // Stub the OTP.totp call to return a dummy password
        otpStub = sinon.stub(otp.prototype, 'totp').returns(oneTimePassword)

        // Setup a stub for getConfigValue that returns different values based on the argument passed to it
        const configValueStub = sinon.stub(configuration, 'getConfigValue')
        configValueStub.withArgs(MICROSERVICE).returns(microservice)
        configValueStub.withArgs(S2S_SECRET).returns(s2sSecret)

        // Setup spies on the logger
        sinon.stub(log4jui, 'getLogger').returns({
            error: loggerErrorSpy = sinon.spy(),
            info: loggerInfoSpy = sinon.spy(),
        } as unknown as JUILogger)

        // Ensure that when requestS2sToken() calls http(req), its axios.create() function call returns a fake AxiosInstance
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

    it('should generate a one-time password', () => {
        const secret = 'secret'
        const password = s2sTokenGeneration.generateOneTimePassword(secret)

        // Check the value of the secret passed as an argument is as expected
        expect(otpStub.args[0][0].secret).to.equal(secret)
        expect(password).to.equal(oneTimePassword)
    })

    it('should generate an S2S token', async () => {
        // Stub the fakeAxiosInstance.post call to return a mock response
        sinon.stub(fakeAxiosInstance, 'post').resolves({ data: 's2sToken' } as AxiosResponse)

        const s2sToken = await s2sTokenGeneration.generateS2sToken(url)

        expect(configuration.getConfigValue).to.be.calledWith(S2S_SECRET)
        expect(configuration.getConfigValue).to.be.calledWith(MICROSERVICE)
        expect(log4jui.getLogger).to.be.calledWith('S2S token generation')
        expect(loggerInfoSpy).to.be.calledWith('Generating the S2S token for microservice: ', microservice)
        expect(s2sToken).to.equal('s2sToken')
    })

    it('should throw an error on a failed S2S token request', async () => {
        // Stub the fakeAxiosInstance.post call to return an error
        sinon.stub(fakeAxiosInstance, 'post').rejects(new Error('S2S token request failed'))

        await expect(s2sTokenGeneration.generateS2sToken(url)).to.be.rejectedWith('Error generating S2S Token')
    })

    it('should request an S2S token', async () => {
        // Stub the fakeAxiosInstance.post call to return a mock response
        sinon.stub(fakeAxiosInstance, 'post').resolves({ data: 's2sToken' } as AxiosResponse)

        const s2sTokenResponse = await s2sTokenGeneration.requestS2sToken(url, microservice, oneTimePassword)

        expect(fakeAxiosInstance.post).to.be.calledWith(`${url}/lease`, { microservice, oneTimePassword })

        // Check for deep equality rather than strict;
        // it would fail strict equality because the returned object is not the same instance, though identical
        expect(s2sTokenResponse).to.deep.equal({ data: 's2sToken' })
    })
})
