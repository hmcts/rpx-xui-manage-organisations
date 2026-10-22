import pactNode from '@pact-foundation/pact-node';
import { execFileSync } from 'child_process';
import * as path from 'path';
import { getConfigValue } from '../../../configuration';
import { PACT_BROKER_PASSWORD, PACT_BROKER_URL, PACT_BROKER_USERNAME } from '../../../configuration/references';

export interface GitSource { version: string; branch: string; dirty: boolean; ciInstallMarkerUntracked?: boolean; gitStatus?: string; }
export interface PublicationSettings { broker: string; version?: string; branch?: string; username?: string; password?: string; }

export function readGitSource(): GitSource {
  const git = (args: string[]) => execFileSync('git', args, { encoding: 'utf8' }).trim();
  const status = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trimEnd();
  return {
    version: git(['rev-parse', 'HEAD']), branch: git(['branch', '--show-current']), dirty: status.length > 0,
    ciInstallMarkerUntracked: status.split('\n').includes('?? .yarn_dependencies_installed'),
    gitStatus: status
  };
}

/** Deliberately excludes credentials, Broker URLs, file contents and arbitrary environment values. */
export function publicationDiagnostics(settings: PublicationSettings, source: GitSource) {
  const configuredVersion = settings.version || source.version;
  return {
    checkedOutSha: /^[a-f0-9]{40}$/i.test(source.version) ? source.version : 'INVALID',
    configuredVersionLength: configuredVersion.length,
    configuredVersionIsFullSha: /^[a-f0-9]{40}$/i.test(configuredVersion),
    configuredVersionMatchesHead: configuredVersion === source.version,
    versionOverridePresent: Boolean(settings.version),
    dirtySource: source.dirty,
    gitStatus: source.gitStatus ? source.gitStatus.split('\n') : [],
    ciInstallMarkerUntracked: source.ciInstallMarkerUntracked === true,
    branchPresent: Boolean(settings.branch || source.branch)
  };
}

/** Report known validation reasons; never forward raw publisher/HTTP exceptions to CI output. */
export function publicationFailure(error: unknown) {
  const reasons: Record<string, string> = {
    'Pact version must equal the full checked-out Git SHA.': 'VERSION_MISMATCH',
    'A first-class Git branch is required for Pact publication.': 'INVALID_BRANCH',
    'Configure an HTTP(S) Pact Broker without credentials embedded in its URL.': 'INVALID_BROKER_URL'
  };
  return error instanceof Error && Object.prototype.hasOwnProperty.call(reasons, error.message)
    ? reasons[error.message] : 'UNCLASSIFIED_FAILURE';
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
  console.log('Pact publication preflight:', JSON.stringify(publicationDiagnostics(settings, source)));
  const options = publicationOptions(settings, source);
  console.log('Pact publication validation passed; Broker upload starting.');
  await pactNode.publishPacts(options);
}

if (require.main === module) {
  const settings: PublicationSettings = {
    broker: getConfigValue(PACT_BROKER_URL),
    version: process.env.PACT_CONSUMER_VERSION,
    branch: process.env.PACT_BRANCH_NAME || process.env.CHANGE_BRANCH || process.env.BRANCH_NAME,
    username: getConfigValue(PACT_BROKER_USERNAME), password: getConfigValue(PACT_BROKER_PASSWORD)
  };
  publishPacts(settings).then(() => console.log('Pact contract publishing complete!')).catch((error: unknown) => {
    console.error('Pact publication failed; no successful publication is claimed. Reason:', publicationFailure(error));
    process.exitCode = 1;
  });
}
