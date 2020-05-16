import axios from 'axios'
import { AxiosInstance } from 'axios'
import { AxiosResponse } from 'axios'
import * as chai from 'chai'
import { expect } from 'chai'
import * as otp from 'otp'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import * as configuration from '../configuration'
import { S2S_SECRET, SERVICE_S2S_PATH } from '../configuration/references'
import { application } from '../lib/config/application.config'
import * as tunnel from '../lib/tunnel'
import * as serviceAuth from './serviceAuth'

chai.use(sinonChai)

describe('serviceAuth', () => {
    let fakeAxiosInstance: AxiosInstance

    const s2sSecret = 'topSecret'
    const url = 'http://s2s.local'
    const microservice = application.microservice
    const oneTimePassword = 'password'

    let configValueStub: sinon.SinonStub

    beforeEach(() => {
        // Setup a stub for getConfigValue that returns different values based on the argument passed to it
        configValueStub = sinon.stub(configuration, 'getConfigValue')
        configValueStub.withArgs(S2S_SECRET).returns(s2sSecret)
        configValueStub.withArgs(SERVICE_S2S_PATH).returns(url)

        // Ensure that when postS2SLease() calls http(req), its axios.create() function call returns a fake AxiosInstance
        fakeAxiosInstance = {
            get: Function(),
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

        sinon.stub(tunnel, 'end')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should make a http.post call when NODE_CONFIG_ENV is not equal to "ldocker"', async () => {
        process.env.NODE_CONFIG_ENV = 'test'

        // Stub the fakeAxiosInstance.post call to return a mock response
        sinon.stub(fakeAxiosInstance, 'post').resolves({ data: 'okay' } as AxiosResponse)

        // Stub the OTP.totp call to return a dummy password
        sinon.stub(otp.prototype, 'totp').returns(oneTimePassword)

        const response = await serviceAuth.postS2SLease()
        expect(configuration.getConfigValue).to.be.calledWith(S2S_SECRET)
        expect(configuration.getConfigValue).to.be.calledWith(SERVICE_S2S_PATH)
        expect(fakeAxiosInstance.post).to.be.calledWith(`${url}/lease`, { microservice, oneTimePassword })
        expect(response).to.equal('okay')
    })

    it('should make a http.get call when NODE_CONFIG_ENV is equal to "ldocker"', async () => {
        process.env.NODE_CONFIG_ENV = 'ldocker'

        // Stub the fakeAxiosInstance.get call to return a mock response
        sinon.stub(fakeAxiosInstance, 'get').resolves({ data: 'okay' } as AxiosResponse)

        const response = await serviceAuth.postS2SLease()
        expect(configuration.getConfigValue).to.be.calledWith(S2S_SECRET)
        expect(configuration.getConfigValue).to.be.calledWith(SERVICE_S2S_PATH)
        // tslint:disable-next-line:no-unused-expression
        expect(tunnel.end).to.be.called
        expect(fakeAxiosInstance.get).to.be.calledWith(`${url}`)
        expect(response).to.equal('okay')
    })

    it('should use the default S2S secret if one does not exist as a configuration value', async () => {
        process.env.NODE_CONFIG_ENV = 'test'

        // Set the configValueStub to return null for the S2S secret
        configValueStub.withArgs(S2S_SECRET).returns(null)

        // Stub the fakeAxiosInstance.post call to return a mock response
        sinon.stub(fakeAxiosInstance, 'post').resolves({ data: 'okay' } as AxiosResponse)

        // Spy on the OTP.totp call
        const spy = sinon.spy(otp.prototype, 'totp')

        await serviceAuth.postS2SLease()

        // Check the value of the secret passed as an argument is as expected
        expect(spy.args[0][0].secret).to.equal('AAAAAAAAAAAAAAAA')
    })
})
