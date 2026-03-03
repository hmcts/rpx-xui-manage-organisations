import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { organisationTypes } from './mockOrganisationTypes';
import { getRegulatoryOrganisationTypes } from './index';

chai.use(sinonChai);

describe('getRegulatoryOrganisationTypes', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call API and return organisationTypes with status 200', async () => {
    await getRegulatoryOrganisationTypes(req, res, next);
    expect(res.status).to.be.calledWith(200);
    expect(res.send).to.be.calledWith(organisationTypes);
  });

  it('should call next with error if sending fails', async () => {
    const error = new Error('Test error');
    sinon.stub(res, 'send').throws(error);

    await getRegulatoryOrganisationTypes(req, res, next);

    expect(next).to.be.calledWith(error);
  });
});
