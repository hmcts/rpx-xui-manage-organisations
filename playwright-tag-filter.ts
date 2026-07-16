import { readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';

type EnvMap = NodeJS.ProcessEnv;

type TagCatalog = {
  excludedTags?: string[];
  availableTags: string[];
};

export type ResolvedTagFilters = {
  includeTags: string[];
  excludedTags: string[];
  globalExcludedTags: string[];
  ignoredGlobalExcludedTags: string[];
  availableTags: string[];
  grep?: RegExp;
  grepInvert?: RegExp;
};

type ResolveTagFiltersOptions = {
  env?: EnvMap;
  includeTagsEnvVar: string;
  excludedTagsEnvVar: string;
  configPathEnvVar: string;
  defaultConfigPath: string;
  globalExcludedTagsPattern: RegExp;
  suiteTag?: string;
  legacyIncludeTagsEnvVar?: string;
  legacyExcludedTagsEnvVar?: string;
};

const GLOBAL_EXCLUDED_TAGS_ENV_VAR = 'PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS';
const IGNORE_GLOBAL_EXCLUDES_ENV_VAR = 'PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES';
const GLOBAL_TAG_CATALOGS = [
  {
    configPathEnvVar: 'API_PW_TAG_FILTER_CONFIG',
    defaultConfigPath: 'playwright_tests_new/api/tag-filter.json',
  },
  {
    configPathEnvVar: 'E2E_PW_TAG_FILTER_CONFIG',
    defaultConfigPath: 'playwright_tests_new/E2E/tag-filter.json',
  },
  {
    configPathEnvVar: 'INTEGRATION_PW_TAG_FILTER_CONFIG',
    defaultConfigPath: 'playwright_tests_new/integration/tag-filter.json',
  },
] as const;
const WHOLE_SUITE_GLOBAL_EXCLUSIONS = new Set(['@e2e', '@integration']);

const ensureTagPrefix = (value: string): string => {
  const normalized = value.trim();
  if (!normalized) {
    return '';
  }
  return normalized.startsWith('@') ? normalized : `@${normalized}`;
};

export const splitTagInput = (raw?: string): string[] => {
  const tags = (raw ?? '')
    .split(/[\s,]+/)
    .map(ensureTagPrefix)
    .filter(Boolean);
  return Array.from(new Set(tags));
};

const mergeTags = (...tagGroups: string[][]): string[] => Array.from(new Set(tagGroups.flat()));

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildTagRegex = (tags: string[]): RegExp | undefined =>
  tags.length ? new RegExp(`(^|[^\\w-])(?:${tags.map(escapeRegExp).join('|')})(?=$|[^\\w-])`) : undefined;

const resolveBooleanFlag = (raw?: string): boolean => ['1', 'true', 'yes', 'on'].includes((raw ?? '').trim().toLowerCase());

const resolveConfiguredInput = (env: EnvMap, primaryName: string, legacyName?: string): string | undefined => {
  const primaryValue = env[primaryName]?.trim();
  if (primaryValue) {
    return primaryValue;
  }
  return legacyName ? env[legacyName]?.trim() : undefined;
};

const readTagCatalog = (env: EnvMap, configPathEnvVar: string, defaultConfigPath: string): TagCatalog => {
  const configuredPath = env[configPathEnvVar]?.trim() || defaultConfigPath;
  const configPath = isAbsolute(configuredPath) ? configuredPath : resolve(process.cwd(), configuredPath);

  try {
    const catalog = JSON.parse(readFileSync(configPath, 'utf8')) as TagCatalog;
    if (!Array.isArray(catalog.availableTags) || !catalog.availableTags.length) {
      throw new TypeError('availableTags must be a non-empty array');
    }
    if (catalog.excludedTags !== undefined && !Array.isArray(catalog.excludedTags)) {
      throw new TypeError('excludedTags must be an array');
    }
    return catalog;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read tag filter config at "${configPath}": ${message}`);
  }
};

const validateKnownTags = (tags: string[], availableTags: Set<string>, source: string): void => {
  const unknownTags = tags.filter((tag) => !availableTags.has(tag));
  if (unknownTags.length) {
    throw new Error(`${source} contains unknown tag(s): ${unknownTags.join(', ')}`);
  }
};

const validateGlobalExcludedTags = (env: EnvMap, tags: string[]): void => {
  if (!tags.length) {
    return;
  }

  const availableTags = new Set(
    GLOBAL_TAG_CATALOGS.flatMap(({ configPathEnvVar, defaultConfigPath }) =>
      splitTagInput(readTagCatalog(env, configPathEnvVar, defaultConfigPath).availableTags.join(' '))
    )
  );
  validateKnownTags(tags, availableTags, GLOBAL_EXCLUDED_TAGS_ENV_VAR);

  const wholeSuiteTags = tags.filter((tag) => WHOLE_SUITE_GLOBAL_EXCLUSIONS.has(tag));
  if (wholeSuiteTags.length) {
    throw new Error(
      `${GLOBAL_EXCLUDED_TAGS_ENV_VAR} cannot exclude whole-suite tag(s): ${wholeSuiteTags.join(', ')}. ` +
        'Use a narrower functional tag to avoid Playwright "No tests found".'
    );
  }
};

const matchesSuite = (tag: string, pattern: RegExp): boolean => {
  pattern.lastIndex = 0;
  return pattern.test(tag);
};

const normalizeIncludedTags = (includeTags: string[], suiteTag?: string): string[] => {
  if (!suiteTag || includeTags.length < 2 || !includeTags.includes(suiteTag)) {
    return includeTags;
  }
  return includeTags.filter((tag) => tag !== suiteTag);
};

export const resolveTagFilters = ({
  env = process.env,
  includeTagsEnvVar,
  excludedTagsEnvVar,
  configPathEnvVar,
  defaultConfigPath,
  globalExcludedTagsPattern,
  suiteTag,
  legacyIncludeTagsEnvVar,
  legacyExcludedTagsEnvVar,
}: ResolveTagFiltersOptions): ResolvedTagFilters => {
  const catalog = readTagCatalog(env, configPathEnvVar, defaultConfigPath);
  const availableTags = splitTagInput(catalog.availableTags.join(' '));
  const availableTagSet = new Set(availableTags);
  const defaultExcludedTags = splitTagInput(catalog.excludedTags?.join(' '));
  const includeTags = normalizeIncludedTags(
    splitTagInput(resolveConfiguredInput(env, includeTagsEnvVar, legacyIncludeTagsEnvVar)),
    suiteTag
  );
  const rawSuiteOverride = resolveConfiguredInput(env, excludedTagsEnvVar, legacyExcludedTagsEnvVar);
  const parsedSuiteOverride = splitTagInput(rawSuiteOverride);
  const hasSuiteOverride = Boolean(rawSuiteOverride);
  const suiteExcludedTags = hasSuiteOverride ? parsedSuiteOverride.filter((tag) => tag !== '@none') : defaultExcludedTags;

  const configuredGlobalTags = splitTagInput(env[GLOBAL_EXCLUDED_TAGS_ENV_VAR]).filter((tag) => tag !== '@none');
  const ignoreGlobalExcludes = resolveBooleanFlag(env[IGNORE_GLOBAL_EXCLUDES_ENV_VAR]);
  if (!ignoreGlobalExcludes) {
    validateGlobalExcludedTags(env, configuredGlobalTags);
  }
  const inScopeGlobalTags = configuredGlobalTags.filter((tag) => matchesSuite(tag, globalExcludedTagsPattern));
  const globalExcludedTags = ignoreGlobalExcludes ? [] : inScopeGlobalTags;
  const ignoredGlobalExcludedTags = ignoreGlobalExcludes
    ? configuredGlobalTags
    : configuredGlobalTags.filter((tag) => !inScopeGlobalTags.includes(tag));

  validateKnownTags(defaultExcludedTags, availableTagSet, 'Tag catalog excludedTags');
  validateKnownTags(includeTags, availableTagSet, includeTagsEnvVar);
  validateKnownTags(suiteExcludedTags, availableTagSet, excludedTagsEnvVar);

  const excludedTags = mergeTags(suiteExcludedTags, globalExcludedTags);
  return {
    includeTags,
    excludedTags,
    globalExcludedTags,
    ignoredGlobalExcludedTags,
    availableTags,
    grep: buildTagRegex(includeTags),
    grepInvert: buildTagRegex(excludedTags),
  };
};

export const resolveApiTagFilters = (env: EnvMap = process.env): ResolvedTagFilters =>
  resolveTagFilters({
    env,
    includeTagsEnvVar: 'API_PW_INCLUDE_TAGS',
    excludedTagsEnvVar: 'API_PW_EXCLUDED_TAGS_OVERRIDE',
    configPathEnvVar: 'API_PW_TAG_FILTER_CONFIG',
    defaultConfigPath: 'playwright_tests_new/api/tag-filter.json',
    globalExcludedTagsPattern: /^@svc-.+/,
  });

export const resolveE2eTagFilters = (env: EnvMap = process.env): ResolvedTagFilters =>
  resolveTagFilters({
    env,
    includeTagsEnvVar: 'E2E_PW_INCLUDE_TAGS',
    excludedTagsEnvVar: 'E2E_PW_EXCLUDED_TAGS_OVERRIDE',
    configPathEnvVar: 'E2E_PW_TAG_FILTER_CONFIG',
    defaultConfigPath: 'playwright_tests_new/E2E/tag-filter.json',
    globalExcludedTagsPattern:
      /^@(e2e(?:-.+)?|a11y(?:-.+)?|auth(?:-.+)?|organisation(?:-.+)?|registration(?:-.+)?|terms(?:-.+)?|user-admin(?:-.+)?|validation(?:-.+)?|wave-a11y(?:-.+)?)$/,
    suiteTag: '@e2e',
    legacyIncludeTagsEnvVar: 'PLAYWRIGHT_TAGS',
    legacyExcludedTagsEnvVar: 'PLAYWRIGHT_EXCLUDE_TAGS',
  });

export const resolveIntegrationTagFilters = (env: EnvMap = process.env): ResolvedTagFilters =>
  resolveTagFilters({
    env,
    includeTagsEnvVar: 'INTEGRATION_PW_INCLUDE_TAGS',
    excludedTagsEnvVar: 'INTEGRATION_PW_EXCLUDED_TAGS_OVERRIDE',
    configPathEnvVar: 'INTEGRATION_PW_TAG_FILTER_CONFIG',
    defaultConfigPath: 'playwright_tests_new/integration/tag-filter.json',
    globalExcludedTagsPattern: /^@integration(?:-.+)?$/,
    suiteTag: '@integration',
  });

export const logResolvedTagFilters = (suiteName: string, filters: ResolvedTagFilters, env: EnvMap = process.env): void => {
  if (!env.CI && !resolveBooleanFlag(env.PLAYWRIGHT_LOG_TAG_FILTERS)) {
    return;
  }
  const format = (tags: string[]): string => tags.join(' ') || '@none';
  process.stdout.write(
    `[playwright-tags] ${suiteName} include=${format(filters.includeTags)} exclude=${format(filters.excludedTags)} ` +
      `globalApplied=${format(filters.globalExcludedTags)} globalIgnored=${format(filters.ignoredGlobalExcludedTags)}\n`
  );
};
