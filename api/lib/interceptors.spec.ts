import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

chai.use(sinonChai);

import * as configuration from '../configuration';
import { MAX_LOG_LINE } from '../configuration/references';
import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors';
import * as log4jui from './log4jui';

describe('interceptors', () => {
  const response = {
    config: {
      metadata: {
        startTime: new Date()
      },
      method: 'POST',
      url: 'http://aac-manage-case-assignment-aat.service.core-compute-aat.internal/case-assignments'
    },
    status: 200
  };
  const request = {
    method: 'GET',
    url: 'http://rd-professional-api-aat.service.core-compute-aat.internal/refdata/external/v1/organisations/users?returnRoles=false&status=active'
  };
  const errorWithResponseDataDetails = {
    config: {
      data: {
        authenticated: false
      },
      metadata: {
        startTime: new Date()
      },
      method: 'GET',
      response: {
        status: 500
      },
      url: 'http://aac-manage-case-assignment-aat.service.core-compute-aat.internal/case-assignments'
    },
    request: {},
    response: {
      data: {
        details: {
          error: true
        }
      }
    },
    status: 500
  };
  const errorWithoutResponseDataDetailsWithResponseStatus = {
    config: {
      data: {
        authenticated: false
      },
      metadata: {
        startTime: new Date()
      },
      method: 'GET',
      response: {
        status: 500
      },
      url: 'http://aac-manage-case-assignment-aat.service.core-compute-aat.internal/case-assignments'
    },
    request: {},
    response: {
      data: {
        other: 'random'
      },
      status: 500
    },
    status: 500
  };
  const errorWithoutResponseDataDetailsOrResponseStatus = {
    config: {
      data: {
        authenticated: false
      },
      metadata: {
        startTime: new Date()
      },
      method: 'GET',
      response: {
        status: 500
      },
      url: 'http://aac-manage-case-assignment-aat.service.core-compute-aat.internal/case-assignments'
    },
    request: {},
    response: {
      data: {
        other: 'random'
      }
    },
    status: 500
  };

  beforeEach(() => {
    sinon.stub(configuration, 'getConfigValue').withArgs(MAX_LOG_LINE).returns(20);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('requestInterceptor', () => {
    it('Should log outbound request', () => {
      const spy = sinon.spy();
      sinon.stub(log4jui, 'getLogger').returns({ info: spy } as any);
      requestInterceptor(request);
      expect(spy).to.be.calledWith('GET rd-professional-api /refdata/external/v1...');
    });

    it('Should return request unmutilated', () => {
      const result = requestInterceptor(request);
      expect(result).to.be.equal(request);
    });
  });

  describe('successInterceptor', () => {
    it('Should log returned response', () => {
      const spy = sinon.spy();
      const stub = sinon.stub();
      sinon.stub(log4jui, 'getLogger').returns({ info: spy, trackRequest: stub } as any);
      successInterceptor(response);
      expect(stub).to.be.calledWith({
        duration: sinon.match.number,
        name: `Service ${response.config.method.toUpperCase()} call`,
        resultCode: response.status,
        success: true,
        url: response.config.url
      });
      expect(spy).to.be.calledWith(sinon.match(/^POST aac-manage-case-assignment \/case-assignments -> 200 \([0-9]+ms\)$/));
    });

    it('Should return response unmutilated', () => {
      const result = successInterceptor(response);
      expect(result).to.be.equal(response);
    });
  });

  describe('errorInterceptor', () => {
    it('Should log returned response where response data details exist', () => {
      const spy = sinon.spy();
      const stub = sinon.stub();
      sinon.stub(log4jui, 'getLogger').returns({ error: spy, trackRequest: stub } as any);
      return errorInterceptor(errorWithResponseDataDetails).catch(() => {
        expect(stub).to.be.calledWith({
          duration: sinon.match.number,
          name: `Service ${errorWithResponseDataDetails.config.method.toUpperCase()} call`,
          resultCode: errorWithResponseDataDetails.status,
          success: false,
          url: errorWithResponseDataDetails.config.url
        });
        expect(spy).to.be.calledWith('Outbound service call failed', {
          duration: sinon.match.number,
          message: undefined,
          method: 'GET',
          status: 500,
          target: 'aac-manage-case-assignment /case-assignments'
        });
      });
    });

    it('Should log returned response where response data details do not exist but response status does', () => {
      const spy = sinon.spy();
      const stub = sinon.stub();
      sinon.stub(log4jui, 'getLogger').returns({ error: spy, trackRequest: stub } as any);
      return errorInterceptor(errorWithoutResponseDataDetailsWithResponseStatus).catch(() => {
        expect(stub).to.be.calledWith({
          duration: sinon.match.number,
          name: `Service ${errorWithoutResponseDataDetailsWithResponseStatus.config.method.toUpperCase()} call`,
          resultCode: errorWithoutResponseDataDetailsWithResponseStatus.status,
          success: false,
          url: errorWithoutResponseDataDetailsWithResponseStatus.config.url
        });
        expect(spy).to.be.calledWith('Outbound service call failed', {
          duration: sinon.match.number,
          message: undefined,
          method: 'GET',
          status: 500,
          target: 'aac-manage-case-assignment /case-assignments'
        });
      });
    });

    it('Should log returned response where neither response data details nor response status exist', () => {
      const spy = sinon.spy();
      const stub = sinon.stub();
      sinon.stub(log4jui, 'getLogger').returns({ error: spy, trackRequest: stub } as any);
      return errorInterceptor(errorWithoutResponseDataDetailsOrResponseStatus).catch(() => {
        expect(stub).to.be.calledWith({
          duration: sinon.match.number,
          name: `Service ${errorWithoutResponseDataDetailsOrResponseStatus.config.method.toUpperCase()} call`,
          resultCode: errorWithoutResponseDataDetailsOrResponseStatus.status,
          success: false,
          url: errorWithoutResponseDataDetailsOrResponseStatus.config.url
        });
        expect(spy).to.be.calledWith('Outbound service call failed', {
          duration: sinon.match.number,
          message: undefined,
          method: 'GET',
          status: 500,
          target: 'aac-manage-case-assignment /case-assignments'
        });
      });
    });
  });
});
