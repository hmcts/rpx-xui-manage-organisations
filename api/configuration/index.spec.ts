import { expect } from 'chai';
import * as configModule from 'config';
import 'mocha';
import * as sinon from 'sinon';

import { getConfigValue } from '../configuration';
import { PACT_BROKER_PASSWORD, SYSTEM_USER_PASSWORD } from './references';

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
    process.env.SYSTEM_USER_PASSWORD = 'env-value';
    const configGetStub = sandbox.stub(config, 'get').returns('config-value');

    const value = getConfigValue(SYSTEM_USER_PASSWORD);

    expect(value).to.equal('env-value');
    sinon.assert.notCalled(configGetStub);
  });

  it('reads the Pact broker password directly from the environment when set', () => {
    process.env.PACT_BROKER_PASSWORD = 'env-value';
    const configGetStub = sandbox.stub(config, 'get').returns('config-value');

    const value = getConfigValue(PACT_BROKER_PASSWORD);

    expect(value).to.equal('env-value');
    sinon.assert.notCalled(configGetStub);
  });

  it('falls back to config for env-only references when the environment is not set', () => {
    delete process.env.SYSTEM_USER_PASSWORD;
    const configGetStub = sandbox.stub(config, 'get').returns('config-value');

    const value = getConfigValue(SYSTEM_USER_PASSWORD);

    expect(value).to.equal('config-value');
    sinon.assert.calledOnceWithExactly(configGetStub, SYSTEM_USER_PASSWORD);
  });

  it('continues to read normal references from config', () => {
    process.env.SYSTEM_USER_PASSWORD = 'env-value';
    const configGetStub = sandbox.stub(config, 'get').returns('https://idam.example.test');

    const value = getConfigValue('services.idamApi');

    expect(value).to.equal('https://idam.example.test');
    sinon.assert.calledOnceWithExactly(configGetStub, 'services.idamApi');
  });
});
