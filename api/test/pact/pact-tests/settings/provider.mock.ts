import { Pact } from '@pact-foundation/pact';
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
      port: this.port,
      log: path.resolve(process.cwd(), 'api/test/pact/logs', 'mockserver-integration.log'),
      dir: path.resolve(process.cwd(), 'api/test/pact/pacts'),
      spec: 2,
      consumer: 'xui_manageOrg',
      provider: config.provider,
      pactfileWriteMode: 'merge'
    });
  }
}
