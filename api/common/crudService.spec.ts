import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { handleDelete, handleGet, handlePost, handlePut } from './crudService';

chai.use(sinonChai);

describe('crudService', () => {
  const dummyData = {
    crudId: 'dummy',
    documentId: 'dummy',
    page: 1,
    rectangles: []
  };

  const response = {
    data: 'ok',
    status: 200
  };

  let req: any;
  beforeEach(() => {
    req = {
      http: {
        delete: sinon.stub(),
        get: sinon.stub(),
        post: sinon.stub(),
        put: sinon.stub()
      }
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('handleGet', () => {
    it('should make a get request', async () => {
      req.http.get.resolves(response);
      const crudPath = '/crud/12345';
      const result = await handleGet(crudPath, req);
      expect(req.http.get).to.have.been.calledWith(crudPath);
      expect(result.data).to.equal('ok');
    });

    it('should rethrow get request failures', async () => {
      const error = { status: 500, statusText: 'Server Error', data: { message: 'failed' } };
      req.http.get.rejects(error);
      try {
        await handleGet('/crud/12345', req);
        expect.fail('Expected handleGet to throw');
      } catch (caughtError) {
        expect(caughtError).to.equal(error);
      }
    });
  });

  describe('handlePost', () => {
    it('should make a post request', async () => {
      req.http.post.resolves(response);
      const crudPath = '/crud/12345';
      const result = await handlePost(crudPath, dummyData, req);
      expect(req.http.post).to.have.been.calledWith(crudPath, dummyData);
      expect(result.data).to.equal('ok');
    });

    it('should rethrow post request failures', async () => {
      const error = { status: 409, statusText: 'Conflict', data: { message: 'failed' } };
      req.http.post.rejects(error);
      try {
        await handlePost('/crud/12345', dummyData, req);
        expect.fail('Expected handlePost to throw');
      } catch (caughtError) {
        expect(caughtError).to.equal(error);
      }
    });
  });

  describe('handlePut', () => {
    it('should make a put request', async () => {
      req.http.put.resolves(response);
      const crudPath = '/crud/12345';
      const result = await handlePut(crudPath, dummyData, req);
      expect(req.http.put).to.have.been.calledWith(crudPath, dummyData);
      expect(result.data).to.equal('ok');
    });

    it('should rethrow put request failures', async () => {
      const error = { status: 400, statusText: 'Bad Request', data: { message: 'failed' } };
      req.http.put.rejects(error);
      try {
        await handlePut('/crud/12345', dummyData, req);
        expect.fail('Expected handlePut to throw');
      } catch (caughtError) {
        expect(caughtError).to.equal(error);
      }
    });
  });

  describe('handleDelete', () => {
    it('should make a delete request', async () => {
      req.http.delete.resolves(response);
      const crudPath = '/crud/12345';
      const result = await handleDelete(crudPath, dummyData, req);
      expect(req.http.delete).to.have.been.calledWith(crudPath, { data: dummyData });
      expect(result.data).to.equal('ok');
    });

    it('should rethrow delete request failures', async () => {
      const error = { status: 404, statusText: 'Not Found', data: { message: 'failed' } };
      req.http.delete.rejects(error);
      try {
        await handleDelete('/crud/12345', dummyData, req);
        expect.fail('Expected handleDelete to throw');
      } catch (caughtError) {
        expect(caughtError).to.equal(error);
      }
    });
  });
});
