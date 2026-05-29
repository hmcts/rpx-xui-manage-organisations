import { expect } from 'chai';
import * as configModule from 'config';
import 'mocha';
import * as sinon from 'sinon';

import { getConfigValue } from '../configuration';

const config = (configModule as any).default || configModule;

describe('configuration index', () => {
  let sandbox: sinon.SinonSandbox;
  let originalPactBrokerPassword: string | undefined;
  let originalSystemUserPassword: string | undefined;

  const restoreEnv = (name: string, value: string | undefined) => {
    if (value === undefined) {
      delete process.env[name];
      return;
    }

    process.env[name] = value;
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    originalPactBrokerPassword = process.env.PACT_BROKER_PASSWORD;
    originalSystemUserPassword = process.env.SYSTEM_USER_PASSWORD;
  });

  afterEach(() => {
    sandbox.restore();
    restoreEnv('PACT_BROKER_PASSWORD', originalPactBrokerPassword);
    restoreEnv('SYSTEM_USER_PASSWORD', originalSystemUserPassword);
  });

  it('reads the system user password directly from the environment when set', () => {
    process.env.SYSTEM_USER_PASSWORD = 'system-user-password-from-env';
    const configGetStub = sandbox.stub(config, 'get').returns('system-user-password-from-config');

    const value = getConfigValue('secrets.rpx.system-user-password');

    expect(value).to.equal('system-user-password-from-env');
    sinon.assert.notCalled(configGetStub);
  });

  it('reads the Pact broker password directly from the environment when set', () => {
    process.env.PACT_BROKER_PASSWORD = 'pact-broker-password-from-env';
    const configGetStub = sandbox.stub(config, 'get').returns('pact-broker-password-from-config');

    const value = getConfigValue('pact.brokerPassword');

    expect(value).to.equal('pact-broker-password-from-env');
    sinon.assert.notCalled(configGetStub);
  });

  it('falls back to config for env-only references when the environment is not set', () => {
    delete process.env.SYSTEM_USER_PASSWORD;
    const configGetStub = sandbox.stub(config, 'get').returns('system-user-password-from-config');

    const value = getConfigValue('secrets.rpx.system-user-password');

    expect(value).to.equal('system-user-password-from-config');
    sinon.assert.calledOnceWithExactly(configGetStub, 'secrets.rpx.system-user-password');
  });

  it('continues to read normal references from config', () => {
    process.env.SYSTEM_USER_PASSWORD = 'system-user-password-from-env';
    const configGetStub = sandbox.stub(config, 'get').returns('https://idam.example.test');

    const value = getConfigValue('services.idamApi');

    expect(value).to.equal('https://idam.example.test');
    sinon.assert.calledOnceWithExactly(configGetStub, 'services.idamApi');
  });
});
