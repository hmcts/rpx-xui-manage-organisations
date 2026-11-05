import { expect } from 'chai';
import express from 'express';
import { Server } from 'http';
import { AddressInfo } from 'net';
import * as sinon from 'sinon';
import * as configuration from '../configuration';
import { handleAddressesRoute } from './index';

describe('Address response content type', () => {
  let server: Server;
  let baseUrl: string;
  let get: sinon.SinonStub;

  beforeEach(async () => {
    sinon.stub(configuration, 'getConfigValue').returns('http://address-service');
    get = sinon.stub();
    const app = express();
    app.get('/addresses', (req, res) => {
      (req as any).http = { get };
      return handleAddressesRoute(req, res);
    });
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', () => resolve());
    });
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterEach(async () => {
    sinon.restore();
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
      server.closeAllConnections();
    });
  });

  for (const data of ['<script>alert(1)</script>', { organisation: '<img src=x onerror=alert(1)>' }]) {
    it(`returns ${typeof data} upstream data as JSON, not HTML`, async () => {
      get.resolves({ data });
      const response = await fetch(`${baseUrl}/addresses?postcode=E1`);
      expect(response.status).to.equal(200);
      expect(response.headers.get('content-type')).to.equal('application/json; charset=utf-8');
      expect(await response.json()).to.deep.equal(data);
      expect(get.firstCall.args[0]).to.equal('http://address-service/addresses?postcode=E1');
    });
  }

  it('returns upstream errors as JSON, not HTML', async () => {
    get.rejects({ statusCode: 502, message: '<script>alert(1)</script>' });
    const response = await fetch(`${baseUrl}/addresses?postcode=E1`);
    expect(response.status).to.equal(502);
    expect(response.headers.get('content-type')).to.equal('application/json; charset=utf-8');
    expect((await response.json() as any).message).to.equal('External address route error');
  });
});
