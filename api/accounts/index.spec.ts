import * as chai from 'chai'
import { expect } from 'chai'
import 'mocha'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'

chai.use(sinonChai)
// below this line you  ut imports to do with our code. Above this line are all testing i ports
import * as log4js from 'log4js'

import * as accountIndex from './index'
import * as rdProfessionals from '../services/rdProfessionals'
import { getAccountsForOrganisation } from '../services/rdProfessionals'
import {PaymentAccountDto} from '../lib/models/transactions';
import * as util from '../lib/util';

// import * as serviceAuth from '../../services/serviceAuth';
// import * as index from '../../controllers/questions';
//
// import * as securityHeaders from './securityHeaders';
// import {generateToken} from './serviceToken';

describe('account index', () => {
  const MockDataForOrganisations: PaymentAccountDto[] = [
    {
      pbaNumber:	'123123123',
      organisationId:	'B123123',
      userId:	'A123123'
    }
  ]
  it('accountsForOrganisation', async () => {
    const sandbox = sinon.createSandbox()
    const request = {
      session: {
        auth: {
          orgId: 'B123123',
        },
      },
    }
    const req = mockReq(request)
    const res = mockRes()
    sandbox.stub(util, 'asyncReturnOrError').resolves(MockDataForOrganisations)
    sandbox.stub(rdProfessionals, 'getAccountsForOrganisation').resolves(MockDataForOrganisations)
    const retValue = await accountIndex.accountsForOrganisation(req, res)
    expect(retValue).to.equal(MockDataForOrganisations)
    sandbox.restore()
  })
  it('handleAccountPbasRoute should return errors', async () => {
    const sandbox = sinon.createSandbox()
    const ErrorMsg = '3rd party service payment api return error - Cannot get accounts for organisation'
    sandbox.stub(accountIndex, 'accountsForOrganisation').throws(ErrorMsg)
    const retValue = await accountIndex.accountsForOrganisation(req, res)
    expect(retValue).to.equal(MockDataForOrganisations)

  })
  it('handleAccountPbasRoute should return PBS accounts', () => {
    const sandbox = sinon.createSandbox()
    sandbox.stub(accountIndex, 'accountsForOrganisation').resolves(MockDataForOrganisations)

  })


})
