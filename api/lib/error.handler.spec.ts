import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { propsExist } from './objectUtilities';

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
});
