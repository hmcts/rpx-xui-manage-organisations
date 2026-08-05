import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { AUTH, xuiNode } from '@hmcts/rpx-xui-node-lib';
import * as appInsights from '../lib/appInsights';
import * as log4jui from '../lib/log4jui';
import { EnhancedRequest } from '../models/enhanced-request.interface';

describe('Auth access denied telemetry', () => {
  let sandbox: sinon.SinonSandbox;
  let clientStub: { trackEvent: sinon.SinonStub };
  let loggerStub: { warn: sinon.SinonStub; info: sinon.SinonStub; error: sinon.SinonStub; _logger: { info: sinon.SinonStub } };
  let xuiNodeOnStub: sinon.SinonStub;
  let accessDeniedCallback: any;
  let importCount = 0;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    clientStub = {
      trackEvent: sandbox.stub()
    };
    loggerStub = {
      warn: sandbox.stub(),
      info: sandbox.stub(),
      error: sandbox.stub(),
      _logger: {
        info: sandbox.stub()
      }
    };

    sandbox.stub(appInsights, 'client').value(clientStub);
    sandbox.stub(log4jui, 'getLogger').returns(loggerStub as any);
    xuiNodeOnStub = sandbox.stub(xuiNode, 'on');

    if (!accessDeniedCallback) {
      const authModule = await import('./index');
      accessDeniedCallback = authModule.accessDeniedCallback;
      importCount += 1;
    }
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should register the access denied telemetry listener', () => {
    expect(importCount).to.equal(1);
    sinon.assert.calledWith(xuiNodeOnStub, AUTH.EVENT.AUTHENTICATE_ACCESS_DENIED, accessDeniedCallback);
  });

  it('should track post-auth role denied details for citizens', () => {
    const details = {
      allowRolesRegex: 'caseworker',
      roles: ['citizen']
    };

    accessDeniedCallback({} as EnhancedRequest, {} as any, sandbox.stub(), details);

    sinon.assert.calledOnceWithExactly(clientStub.trackEvent, {
      name: 'ManageOrganisationsPostAuthRoleDenied',
      properties: {
        isCitizen: true,
        roles: 'citizen',
        requiredRoleMatcher: 'caseworker'
      }
    });
  });

  it('should track access denied details when event details are missing', () => {
    accessDeniedCallback({} as EnhancedRequest, {} as any, sandbox.stub());

    sinon.assert.calledOnceWithExactly(clientStub.trackEvent, {
      name: 'ManageOrganisationsPostAuthRoleDenied',
      properties: {
        isCitizen: false,
        requiredRoleMatcher: '',
        roles: ''
      }
    });
  });
});
