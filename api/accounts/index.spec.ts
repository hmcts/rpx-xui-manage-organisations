import * as chai from 'chai'
import { expect } from 'chai'
import 'mocha'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'

chai.use(sinonChai)
// below this line you  ut imports to do with our code. Above this line are all testing i ports

import * as accountIndex from './index'
import * as rdProfessionals from '../services/rdProfessionals'
import { getAccountsForOrganisation } from '../services/rdProfessionals'
import {PaymentAccountDto} from '../lib/models/transactions';
import * as util from '../lib/util';
import {accountsForOrganisation} from './index';
import {validatePBANumberForOrganisation} from './index';

import * as payments from '../services/payment'
import {PaymentMock} from './data.mock';
import {getPayments} from '../services/payment';

describe('account index', () => {
  let req
  let res
  let sandbox
  const MockDataForOrganisations: PaymentAccountDto[] = [
    {
      pbaNumber:	'XDDDDDoDDDD',
      organisationId:	'B123123',
      userId:	'A123123'
    }
  ]
  const request = {
    params: {
      id: 'XDDDDDDDDD'
    },
    session: {
      auth: {
        orgId: 'B123123',
      },
    },
  }

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    req = mockReq(request)
    res = mockRes()
  })
  afterEach(() => {
    sandbox.restore()
  })

  it('accountsForOrganisation', async () => {
    sandbox.stub(util, 'asyncReturnOrError').resolves(MockDataForOrganisations)
    sandbox.stub(rdProfessionals, 'getAccountsForOrganisation').resolves(MockDataForOrganisations)
    const retValue = await accountIndex.accountsForOrganisation(req, res)
    expect(retValue).to.equal(MockDataForOrganisations)
  })
  it('handleAccountPbasRoute should return errors', async () => {
    sandbox.stub(accountIndex, 'accountsForOrganisation').resolves(null)
    await accountIndex.handleAccountPbasRoute(req, res)
    expect(res.send).not.to.have.been.called
    sandbox.restore()
  })
  it('handleAccountPbasRoute should return PBS accounts', async () => {
    sandbox.stub(accountIndex, 'accountsForOrganisation').resolves(MockDataForOrganisations)
    await accountIndex.handleAccountPbasRoute(req, res)
    expect(res.send).to.have.been.calledWith(MockDataForOrganisations)
  })
  it('validatePBANumberForOrganisation should return status 401', async () => {
    const response = 'Unauthorised PBA number for organisation'
    sandbox.stub(accountIndex, 'accountsForOrganisation').resolves(MockDataForOrganisations)
    const isValid = await accountIndex.validatePBANumberForOrganisation(req, res)
    expect(res.send).to.have.been.calledWith(response)
    expect(res.status).to.have.been.calledWith(401)
    expect(isValid).to.be.true
  })
  it('validatePBANumberForOrganisation account should fail and return false', async () => {
    const sandbox = sinon.createSandbox()
    const requestFail = {
      params: {
        id: 'A123'
      },
      session: {
        auth: {
          orgId: 'B123123',
        },
      },
    }
    const reqfailuer = mockReq(requestFail)
    sandbox.stub(accountIndex, 'accountsForOrganisation').resolves(MockDataForOrganisations)
    const isValid = await accountIndex.validatePBANumberForOrganisation(reqfailuer, res)
    expect(isValid).to.be.true
    sandbox.restore()
  })
  it('validatePBANumberForOrganisation: account should return null so it return false', async () => {
    sandbox.stub(accountIndex, 'accountsForOrganisation').resolves([])
    const isValid = await accountIndex.validatePBANumberForOrganisation(req, res)
  })
  it('handleAccountRoute', async () => {

    sandbox.stub(accountIndex, 'validatePBANumberForOrganisation').resolves(true)
    const accountsMock = [
        {
        pbaNumber:	'sadasdas',
        userId:	'1',
        organisationId:	'asdasd'
       },
       {
        pbaNumber:	'sadasdas',
        userId:	'2',
        organisationId:	'asdasd'
       }
     ]
    sandbox.stub(util, 'asyncReturnOrError').resolves({data: accountsMock})
    sandbox.stub(payments, 'getAccount').resolves({data: accountsMock})
    await accountIndex.handleAccountRoute(req, res)
    expect(res.send).to.have.been.calledWith(accountsMock)
  })
  it('handleAccountPbaTransactionsRoute', async () => {
    sandbox.stub(accountIndex, 'validatePBANumberForOrganisation').resolves(true)
    sandbox.stub(util, 'asyncReturnOrError').resolves({
        data: PaymentMock
    })
    sandbox.stub(payments, 'getPayments').resolves({data: PaymentMock})
    await accountIndex.handleAccountPbaTransactionsRoute(req, res)
    expect(res.send).to.have.been.calledWith(PaymentMock)
  })
})
