import { Request, Response } from 'express';
import * as sinon from 'sinon';
import * as configuration from '../../../../configuration';
import { SERVICES_MCA_PROXY_API_PATH } from '../../../../configuration/references';
import { http } from '../../../../lib/http';
import { EnhancedRequest } from '../../../../models/enhanced-request.interface';

/** Test scaffolding around the production client; no HTTP transport is stubbed. */
export function consumerRequest(baseUrl: string, query: Record<string, string>, values: Record<string, any> = {}) {
  const sandbox = sinon.createSandbox();
  const original = configuration.getConfigValue;
  sandbox.stub(configuration, 'getConfigValue').callsFake((reference: string) => {
    if (reference === SERVICES_MCA_PROXY_API_PATH) {
      return baseUrl;
    }
    return Object.prototype.hasOwnProperty.call(values, reference) ? values[reference] : original(reference);
  });
  const req = {
    headers: { Authorization: 'Bearer some-access-token', ServiceAuthorization: 'serviceAuthToken' },
    query,
    session: { auth: { orgId: 'organisationId' } }
  } as unknown as EnhancedRequest;
  req.http = http(req as Request);
  let rawResponse: any;
  req.http.interceptors.response.use((response) => {
    rawResponse = JSON.parse(JSON.stringify(response.data));
    return response;
  });
  const res = { status: sandbox.stub(), send: sandbox.stub() };
  res.status.returns(res);
  res.send.returns(res);
  const next = sandbox.spy();
  const modules: Array<{ key: string; previous: NodeModule | undefined }> = [];
  return {
    req,
    res: res as unknown as Response,
    sent: res.send,
    next,
    get rawResponse() {
      return rawResponse;
    },
    load(modulePath: string) {
      const key = require.resolve(modulePath);
      modules.push({ key, previous: require.cache[key] });
      delete require.cache[key];
      return module.require(key);
    },
    restore() {
      sandbox.restore();
      for (const { key, previous } of modules) {
        if (previous) {
          require.cache[key] = previous;
        } else {
          delete require.cache[key];
        }
      }
    }
  };
}
