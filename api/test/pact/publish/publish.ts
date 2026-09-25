import { execFile } from 'child_process';
import * as git from 'git-rev-sync';
import * as path from 'path';
import { promisify } from 'util';

import { getConfigValue } from '../../../configuration';
import {
  PACT_BRANCH_NAME,
  PACT_BROKER_PASSWORD,
  PACT_BROKER_URL,
  PACT_BROKER_USERNAME,
  PACT_CONSUMER_VERSION
} from '../../../configuration/references';

const publish = async (): Promise<void> => {
  try {
    const pactBroker = getConfigValue(PACT_BROKER_URL) ?
      getConfigValue(PACT_BROKER_URL) : 'http://localhost:80';

    const pactTag = getConfigValue(PACT_BRANCH_NAME) ?
      getConfigValue(PACT_BRANCH_NAME) : 'Dev';

    const consumerVersion = getConfigValue(PACT_CONSUMER_VERSION) !== '' ?
      // @ts-ignore
      getConfigValue(PACT_CONSUMER_VERSION) : git.short();

    const args = [
      'publish',
      path.resolve(__dirname, '../pacts/'),
      '--broker-base-url', pactBroker,
      '--broker-username', getConfigValue(PACT_BROKER_USERNAME),
      '--broker-password', getConfigValue(PACT_BROKER_PASSWORD),
      '--consumer-app-version', consumerVersion,
      '--tag', pactTag
    ];

    await promisify(execFile)('pact-broker', args);

    console.log('Pact contract publishing complete!');
    console.log('');
    console.log(`Head over to ${pactBroker}`);
    console.log('to see your published contracts.');
  } catch (e) {
    console.log('Pact contract publishing failed: ', e);
  }
};

(async () => {
  await publish();
})();
