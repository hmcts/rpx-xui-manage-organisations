import { AxiosResponse } from 'axios';
import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import * as configuration from '../configuration';
import { http } from '../lib/http';
import { handleUserDetailsRoute } from './index';

chai.use(sinonChai);

describe('User details status proxy @EXUI-4006', () => {
  afterEach(() => sinon.restore());

  for (const idamStatus of ['ACTIVE', 'PENDING', 'SUSPENDED']) {
    it(`preserves ${idamStatus} for a direct user detail request`, async () => {
      const req = mockReq({ query: { userId: 'status-user' } });
      req.http = http(req);
      const res = mockRes();
      const data = { users: [{ userIdentifier: 'status-user', idamStatus }] };
      sinon.stub(configuration, 'getConfigValue').returns('https://refdata.example');
      sinon.stub(req.http, 'get').resolves({ data } as AxiosResponse);

      await handleUserDetailsRoute(req, res);

      expect(req.http.get).to.have.been.calledWithExactly(
        'https://refdata.example/refdata/external/v1/organisations/users?returnRoles=true&userIdentifier=status-user'
      );
      expect(res.send).to.have.been.calledWithExactly(data);
      expect(data.users[0].idamStatus).to.equal(idamStatus);
    });
  }
});
