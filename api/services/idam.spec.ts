import axios from 'axios'
import { AxiosInstance } from 'axios'
import { AxiosResponse } from 'axios'
import * as chai from 'chai'
import { expect } from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import * as http from '../lib/http'
import * as idam from './idam'

chai.use(sinonChai)

describe('idam', () => {
    let fakeAxiosInstance: AxiosInstance

    const jwt = 'ey.e4jwt'
    const url = 'http://idam.local'

    beforeEach(() => {
        // Setup a spy on the http(req) function, to check the jwt value is passed to it
        sinon.spy(http, 'http')

        // Ensure that when getUserDetails() calls http(req), its axios.create() function call returns a fake AxiosInstance
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
        } as unknown as AxiosInstance
        sinon.stub(axios, 'create').returns(fakeAxiosInstance)
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should get the user details', async () => {
        // Stub the fakeAxiosInstance.get call to return a mock response
        sinon.stub(fakeAxiosInstance, 'get').resolves({ data: 'testUser' } as AxiosResponse)

        const response = await idam.getUserDetails(jwt, url)
        expect(http.http).to.be.calledWith({
            session: {
                auth: {
                    token: jwt,
                },
            },
        })
        expect(fakeAxiosInstance.get).to.be.calledWith(`${url}/details`)

        // Check for deep equality rather than strict;
        // it would fail strict equality because the returned object is not the same instance, though identical
        expect(response).to.deep.equal({ data: 'testUser' })
    })
})
