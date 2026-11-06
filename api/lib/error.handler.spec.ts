import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { propsExist } from './objectUtilities';
import * as log4jui from './log4jui';
import * as appInsights from './appInsights';

chai.use(sinonChai);

import * as errorHandler from './error.handler';

describe('errorHandler', () => {
  let sandbox;
  let req;
  let res;
  let next;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    res = mockRes();
    res.headersSent = false;
    next = sandbox.spy();
    req = mockReq({
      cookies: [],
      headers: [],
      session: {
        save: (fun) => {
          fun();
        }
      }
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should empty headers if it exists', () => {
    const err = {
      config: {
        headers: {

        }
      }
    };
    errorHandler.default(err, req, res, next);
    expect(propsExist(err, ['config', 'headers'])).to.be.false;
  });

  it('should return default response', () => {
    const err = {};
    errorHandler.default(err, req, res, next);
    expect(res.status).to.have.been.calledWith(500);
    expect(res.send).to.have.been.calledWith({ message: 'Internal Server Error' });
  });

  it('should return status and content if it exists', () => {
    const err = {
      status: 404,
      data: {
        test: 'dummy'
      }
    };
    errorHandler.default(err, req, res, next);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.send).to.have.been.calledWith({ test: 'dummy' });
  });

  it('should empty _header if it exists', () => {
    const err = {
      request: {
        _header: {
        }
      }
    };
    errorHandler.default(err, req, res, next);
    expect(propsExist(err, ['request', '_header'])).to.be.false;
  });

  it('should delegate when headers have already been sent', () => {
    const err = {
      status: 500
    };
    res.headersSent = true;

    errorHandler.default(err, req, res, next);

    expect(next).to.have.been.calledWith(err);
    expect(res.status).not.to.have.been.called;
    expect(res.send).not.to.have.been.called;
  });

  it('logs only status and method while preserving the provider response body', () => {
    const log = sandbox.stub(Object.getPrototypeOf(log4jui.getLogger('errorHandler')._logger), 'error');
    const err = {
      status: 500,
      message: 'ADDRESS_MARKER',
      data: { message: 'ADDRESS_MARKER' },
      config: { headers: { Authorization: 'TOKEN_MARKER' }, data: 'ADDRESS_MARKER' },
      request: { _header: 'TOKEN_MARKER', body: 'ADDRESS_MARKER' }
    };
    req.method = 'PUT';

    errorHandler.default(err, req, res, next);

    expect(log).to.have.been.calledOnceWithExactly('Request failed {"method":"PUT","status":500}');
    expect(res.status).to.have.been.calledWith(500);
    expect(res.send).to.have.been.calledWith(err.data);
  });

  it('preserves the original internal exception and its throw-site stack in telemetry', () => {
    const trackException = sandbox.spy();
    sandbox.stub(appInsights, 'client').value({ trackException });
    const err = new TypeError('Internal invariant failed');

    errorHandler.default(err, req, res, next);

    expect(trackException).to.have.been.calledOnce;
    expect(trackException.firstCall.args[0].exception).to.equal(err);
  });

  it('does not send a transport Error or its submitted address to exception telemetry', () => {
    const trackException = sandbox.spy();
    sandbox.stub(appInsights, 'client').value({ trackException });
    const err = Object.assign(new Error('ADDRESS_MARKER'), {
      config: { data: 'ADDRESS_MARKER', headers: { Authorization: 'TOKEN_MARKER' } }
    });

    errorHandler.default(err, req, res, next);

    const telemetry = trackException.firstCall.args[0];
    expect(telemetry.exception).not.to.equal(err);
    expect(telemetry.exception.message).not.to.contain('ADDRESS_MARKER');
    expect(JSON.stringify(telemetry.properties)).not.to.contain('ADDRESS_MARKER');
    expect(JSON.stringify(telemetry)).not.to.contain('TOKEN_MARKER');
  });
});
