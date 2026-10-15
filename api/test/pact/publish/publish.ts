import pactNode from '@pact-foundation/pact-node';
import { execFileSync } from 'child_process';
import * as path from 'path';
import { getConfigValue } from '../../../configuration';
import { PACT_BROKER_PASSWORD, PACT_BROKER_URL, PACT_BROKER_USERNAME } from '../../../configuration/references';

export interface GitSource { version: string; branch: string; dirty: boolean; }
export interface PublicationSettings { broker: string; version?: string; branch?: string; username?: string; password?: string; }

export function readGitSource(): GitSource {
  const git = (args: string[]) => execFileSync('git', args, { encoding: 'utf8' }).trim();
  return { version: git(['rev-parse', 'HEAD']), branch: git(['branch', '--show-current']), dirty: git(['status', '--porcelain']).length > 0 };
}

export function publicationOptions(settings: PublicationSettings, source: GitSource) {
  const version = settings.version || source.version;
  const branch = settings.branch || source.branch;
  if (!/^[a-f0-9]{40}$/i.test(version) || version !== source.version) {
    throw new Error('Pact version must equal the full checked-out Git SHA.');
  }
  if (source.dirty) {
    throw new Error('Commit the Pact changes manually before publishing an immutable Git version.');
  }
  if (!branch || branch === 'HEAD' || /\s/.test(branch)) {
    throw new Error('A first-class Git branch is required for Pact publication.');
  }
  const broker = new URL(settings.broker);
  if (!['http:', 'https:'].includes(broker.protocol) || broker.username || broker.password) {
    throw new Error('Configure an HTTP(S) Pact Broker without credentials embedded in its URL.');
  }
  return {
    consumerVersion: version, branch, tags: [branch], pactBroker: settings.broker,
    pactBrokerUsername: settings.username, pactBrokerPassword: settings.password,
    pactFilesOrDirs: [path.resolve(__dirname, '../pacts/')]
  };
}

export async function publishPacts(settings: PublicationSettings, source: GitSource = readGitSource()): Promise<void> {
  await pactNode.publishPacts(publicationOptions(settings, source));
}

if (require.main === module) {
  const settings: PublicationSettings = {
    broker: getConfigValue(PACT_BROKER_URL),
    version: process.env.PACT_CONSUMER_VERSION,
    branch: process.env.PACT_BRANCH_NAME || process.env.CHANGE_BRANCH || process.env.BRANCH_NAME,
    username: getConfigValue(PACT_BROKER_USERNAME), password: getConfigValue(PACT_BROKER_PASSWORD)
  };
  publishPacts(settings).then(() => console.log('Pact contract publishing complete!')).catch(() => {
    console.error('Pact publication failed; no successful publication is claimed.');
    process.exitCode = 1;
  });
}
