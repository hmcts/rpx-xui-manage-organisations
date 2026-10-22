import pactNode from '@pact-foundation/pact-node';
import { execFileSync } from 'child_process';
import * as path from 'path';
import { getConfigValue } from '../../../configuration';
import { PACT_BROKER_PASSWORD, PACT_BROKER_URL, PACT_BROKER_USERNAME } from '../../../configuration/references';

export interface GitSource { version: string; branch: string; }
export interface PublicationSettings { broker: string; version?: string; branch?: string; username?: string; password?: string; }

export function readGitSource(): GitSource {
  const git = (args: string[]) => execFileSync('git', args, { encoding: 'utf8' }).trim();
  return { version: git(['rev-parse', 'HEAD']), branch: git(['branch', '--show-current']) };
}

export function publicationOptions(settings: PublicationSettings, source: GitSource) {
  const version = settings.version || source.version;
  const branch = settings.branch || source.branch;
  if (!/^[a-f0-9]{40}$/i.test(version) || version !== source.version) {
    throw new Error('Pact version must equal the full checked-out Git SHA.');
  }
  if (!branch || branch === 'HEAD' || /\s/.test(branch)) {
    throw new Error('A first-class Git branch is required for Pact publication.');
  }
  let broker: URL;
  try {
    broker = new URL(settings.broker);
  } catch {
    throw new Error('Configure an HTTP(S) Pact Broker without credentials embedded in its URL.');
  }
  if (!['http:', 'https:'].includes(broker.protocol) || broker.username || broker.password) {
    throw new Error('Configure an HTTP(S) Pact Broker without credentials embedded in its URL.');
  }
  return {
    consumerVersion: version, branch, pactBroker: settings.broker,
    pactBrokerUsername: settings.username, pactBrokerPassword: settings.password,
    pactFilesOrDirs: [path.resolve(__dirname, '../pacts/')]
  };
}

export async function publishPacts(settings: PublicationSettings, source: GitSource = readGitSource()): Promise<void> {
  const options = publicationOptions(settings, source);
  await pactNode.publishPacts(options);
}

describe('Pact publication', function () {
  this.timeout(15000);

  it('publishes Pact contracts to the configured broker', async () => {
    try {
      const settings: PublicationSettings = {
        broker: getConfigValue(PACT_BROKER_URL),
        version: process.env.PACT_CONSUMER_VERSION,
        branch: process.env.PACT_BRANCH_NAME || process.env.CHANGE_BRANCH || process.env.BRANCH_NAME,
        username: getConfigValue(PACT_BROKER_USERNAME), password: getConfigValue(PACT_BROKER_PASSWORD)
      };
      await publishPacts(settings);
      console.log('Pact contract publishing complete!');
    } catch {
      throw new Error('Pact publication failed; no successful publication is claimed.');
    }
  });
});
