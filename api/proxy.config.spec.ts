import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as configuration from './configuration';
import { SERVICES_TRANSLATION_API_URL } from './configuration/references';
import { createTranslationProxyConfig } from './proxy.config';

describe('translation proxy configuration', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('maps the frontend translation endpoint to the translation service endpoint', () => {
    sandbox.stub(configuration, 'getConfigValue').withArgs(SERVICES_TRANSLATION_API_URL).returns('http://translation-service');

    const proxyConfig = createTranslationProxyConfig();
    const rewriteUrl = proxyConfig.rewriteUrl as (path: string) => string;

    expect(proxyConfig.source).to.equal('/api/translation');
    expect(proxyConfig.target).to.equal('http://translation-service');
    expect(rewriteUrl('/cy')).to.equal('/translation/cy');
    expect(rewriteUrl('/')).to.equal('/translation');
  });
});
