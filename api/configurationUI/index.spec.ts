import * as chai from 'chai'
import { expect } from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'
import * as configuration from '../configuration'
import {
    GOOGLE_ANALYTICS_KEY,
    LAUNCH_DARKLY_CLIENT_ID,
    LINKS_MANAGE_CASES_LINK,
    LINKS_MANAGE_ORG_LINK,
    PROTOCOL,
    SERVICES_IDAM_WEB,
  } from '../configuration/references'
import { configurationUIRoute } from './index'

chai.use(sinonChai)

describe('configurationUI index', () => {
    const req = mockReq()
    const res = mockRes()

    beforeEach(() => {
        // Setup a stub for getConfigValue that returns different values based on the argument passed to it
        const stub = sinon.stub(configuration, 'getConfigValue')
        stub.withArgs(GOOGLE_ANALYTICS_KEY).returns('Google')
        stub.withArgs(LAUNCH_DARKLY_CLIENT_ID).returns('abc123')
        stub.withArgs(LINKS_MANAGE_CASES_LINK).returns('/manage-cases')
        stub.withArgs(LINKS_MANAGE_ORG_LINK).returns('/manage-org')
        stub.withArgs(PROTOCOL).returns('http')
        stub.withArgs(SERVICES_IDAM_WEB).returns('/idam-web')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should send an HTTP response with the configuration values', async () => {
        // Test the function and check expectations
        await configurationUIRoute(req, res)
        expect(configuration.getConfigValue).to.be.calledWith(GOOGLE_ANALYTICS_KEY)
        expect(configuration.getConfigValue).to.be.calledWith(LAUNCH_DARKLY_CLIENT_ID)
        expect(configuration.getConfigValue).to.be.calledWith(LINKS_MANAGE_CASES_LINK)
        expect(configuration.getConfigValue).to.be.calledWith(LINKS_MANAGE_ORG_LINK)
        expect(configuration.getConfigValue).to.be.calledWith(PROTOCOL)
        expect(configuration.getConfigValue).to.be.calledWith(SERVICES_IDAM_WEB)
        expect(res.status).to.be.calledWith(200)
        expect(res.send).to.be.calledWith({
            googleAnalyticsKey: 'Google',
            idamWeb: '/idam-web',
            launchDarklyClientId: 'abc123',
            manageCaseLink: '/manage-cases',
            manageOrgLink: '/manage-org',
            protocol: 'http',
            feeAndPayApiPath: undefined,
            rdProfessionalApiPath: undefined,
            s2sPath: undefined,
            servicesIdamApiPath: undefined,
            servicesTandCPath: undefined,
        })
    })
})
