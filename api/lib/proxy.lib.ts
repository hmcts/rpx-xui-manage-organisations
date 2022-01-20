import * as chai from 'chai'
import { expect } from 'chai'
import 'mocha'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { mockReq } from 'sinon-express-mock'

chai.use(sinonChai)

import * as proxy from './proxy'

describe('proxy', () => {

  let sandbox
  let req

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    req = mockReq({
      baseUrl: '/api/documents/',
      cookies: [],
      headers: {
        'accept': '*/*',
        'content-type': 'text/test',
        'experimental': 'experiment/test',
      },
      session: {
        save: fun => {
          fun()
        },
      },
      url: 'fdafu4543543/binary',
    })

  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should set content type', () => {
    req.headers.accept = false
    req.headers.experimental = false
    const headers = proxy.setHeaders(req)
    expect(headers).to.deep.equal({ 'content-type': 'text/test' })
  })

  it('should return a headers object from request', () => {
    const headers = proxy.setHeaders(req)
    expect(headers).to.deep.equal(req.headers)
  })

})
