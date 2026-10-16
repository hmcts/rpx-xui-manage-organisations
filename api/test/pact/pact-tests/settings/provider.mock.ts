import { Pact, PactV3 } from '@pact-foundation/pact';
import { SpecificationVersion } from '@pact-foundation/pact/src/v3/types';
import * as path from 'path';

export interface PactTestSetupConfig {
  provider: string;
  port: number;
}

export class PactTestSetup {
  provider: Pact;
  port: number;

  constructor(config: PactTestSetupConfig) {
    this.provider = new Pact({
      port: config.port,
      log: path.resolve(process.cwd(), 'api/test/pact/logs', 'mockserver-integration.log'),
      dir: path.resolve(process.cwd(), 'api/test/pact/pacts'),
      spec: 2,
      consumer: 'xui_manageOrg',
      provider: config.provider,
      pactfileWriteMode: 'merge'
    });
  }
}

/** Ticket-scoped V3 setup; legacy consumers keep their existing V2 API. */
export class PactV3TestSetup {
  provider: PactV3;

  constructor(config: PactTestSetupConfig) {
    this.provider = new PactV3({
      consumer: 'xui_manageOrg', provider: config.provider,
      port: config.port,
      dir: path.resolve(process.cwd(), 'api/test/pact/pacts'),
      spec: SpecificationVersion.SPECIFICATION_VERSION_V3,
      logLevel: 'warn'
    });
  }
}
