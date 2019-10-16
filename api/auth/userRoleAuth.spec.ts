import {expect} from 'chai'
import 'mocha'
import {mockReq, mockRes} from 'sinon-express-mock'
import {userHasAccess} from './userRoleAuth'

describe('userRoleAuthentication', () => {

  it('Should take in roles', () => {
    expect(userHasAccess()).to.equal(false)
  })
})
