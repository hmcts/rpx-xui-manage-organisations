import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import {
  resolveApiTagFilters,
  resolveE2eTagFilters,
  resolveIntegrationTagFilters,
  splitTagInput
} from '../../../playwright-tag-filter';

test.describe('Playwright global exclusion policy', { tag: '@svc-internal' }, () => {
  test('parses spaces and commas, normalises prefixes and deduplicates in order', () => {
    expect(splitTagInput('svc-user-admin, @svc-user-session  svc-user-admin')).toEqual([
      '@svc-user-admin',
      '@svc-user-session'
    ]);
  });

  test('adds only API-scoped global tags and deduplicates suite exclusions', () => {
    const filters = resolveApiTagFilters({
      API_PW_EXCLUDED_TAGS_OVERRIDE: '@svc-user-admin',
      PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS:
        '@svc-user-admin, @svc-user-session @registration @integration-user-admin @svc-user-session'
    });

    expect(filters.excludedTags).toEqual(['@svc-user-admin', '@svc-user-session']);
    expect(filters.globalExcludedTags).toEqual(['@svc-user-admin', '@svc-user-session']);
    expect(filters.ignoredGlobalExcludedTags).toEqual(['@registration', '@integration-user-admin']);
    expect(filters.grepInvert?.test('contract @svc-user-session')).toBe(true);
    expect(filters.grepInvert?.test('journey @registration')).toBe(false);
  });

  test('keeps suite override replacement semantics and supports @none', () => {
    expect(resolveE2eTagFilters({ E2E_PW_EXCLUDED_TAGS_OVERRIDE: '@registration' }).excludedTags).toEqual([
      '@registration'
    ]);
    expect(resolveE2eTagFilters({ E2E_PW_EXCLUDED_TAGS_OVERRIDE: '@none' }).excludedTags).toEqual([]);
    expect(
      resolveE2eTagFilters({ E2E_PW_EXCLUDED_TAGS_OVERRIDE: '@none @registration' }).excludedTags
    ).toEqual(['@registration']);
  });

  test('treats global @none as a no-op without clearing suite defaults', () => {
    const filters = resolveE2eTagFilters({ PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@none' });

    expect(filters.excludedTags).toEqual([]);
    expect(filters.globalExcludedTags).toEqual([]);
    expect(filters.ignoredGlobalExcludedTags).toEqual([]);
  });

  test('bypasses only the global layer', () => {
    const filters = resolveE2eTagFilters({
      E2E_PW_EXCLUDED_TAGS_OVERRIDE: '@organisation',
      PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@registration @svc-user-admin',
      PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES: 'true'
    });

    expect(filters.excludedTags).toEqual(['@organisation']);
    expect(filters.globalExcludedTags).toEqual([]);
    expect(filters.ignoredGlobalExcludedTags).toEqual(['@registration', '@svc-user-admin']);
  });

  test('bypasses validation for an obsolete global exclusion', () => {
    const filters = resolveE2eTagFilters({
      E2E_PW_EXCLUDED_TAGS_OVERRIDE: '@organisation',
      PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@registration-does-not-exist',
      PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES: 'true'
    });

    expect(filters.excludedTags).toEqual(['@organisation']);
    expect(filters.globalExcludedTags).toEqual([]);
    expect(filters.ignoredGlobalExcludedTags).toEqual(['@registration-does-not-exist']);
  });

  test('matches an excluded tag exactly without suppressing longer tag names', () => {
    const filters = resolveIntegrationTagFilters({
      PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@integration'
    });

    expect(filters.grepInvert?.test('test @integration')).toBe(true);
    expect(filters.grepInvert?.test('test @integration-user-admin')).toBe(false);
  });

  test('preserves legacy E2E include and exclude aliases', () => {
    const filters = resolveE2eTagFilters({
      PLAYWRIGHT_TAGS: '@e2e @registration',
      PLAYWRIGHT_EXCLUDE_TAGS: '@organisation'
    });

    expect(filters.includeTags).toEqual(['@registration']);
    expect(filters.excludedTags).toEqual(['@organisation']);
    expect(filters.grep?.test('journey @registration')).toBe(true);
    expect(filters.grepInvert?.test('journey @organisation')).toBe(true);
  });

  test('prefers suite E2E variables over legacy aliases', () => {
    const filters = resolveE2eTagFilters({
      E2E_PW_INCLUDE_TAGS: '@terms',
      E2E_PW_EXCLUDED_TAGS_OVERRIDE: '@user-admin',
      PLAYWRIGHT_TAGS: '@registration',
      PLAYWRIGHT_EXCLUDE_TAGS: '@organisation'
    });

    expect(filters.includeTags).toEqual(['@terms']);
    expect(filters.excludedTags).toEqual(['@user-admin']);
  });

  test('applies integration globals without leaking other suites', () => {
    const filters = resolveIntegrationTagFilters({
      PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@integration-user-admin @registration @svc-user-admin'
    });

    expect(filters.excludedTags).toEqual(['@integration-user-admin']);
    expect(filters.ignoredGlobalExcludedTags).toEqual(['@registration', '@svc-user-admin']);
  });

  test('keeps integration accessibility selectable but outside the global exclusion namespace', () => {
    const filters = resolveIntegrationTagFilters({
      INTEGRATION_PW_INCLUDE_TAGS: '@a11y',
      PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@a11y'
    });

    expect(filters.includeTags).toEqual(['@a11y']);
    expect(filters.globalExcludedTags).toEqual([]);
    expect(filters.ignoredGlobalExcludedTags).toEqual(['@a11y']);
  });

  test('rejects unknown tags that belong to the active suite namespace', () => {
    expect(() =>
      resolveApiTagFilters({ PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@svc-does-not-exist' })
    ).toThrow(/PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS contains unknown tag/);
    expect(() =>
      resolveE2eTagFilters({ PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@registration-does-not-exist' })
    ).toThrow(/PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS contains unknown tag/);
    expect(() =>
      resolveIntegrationTagFilters({ PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@integration-does-not-exist' })
    ).toThrow(/PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS contains unknown tag/);
  });
});

test.describe('Playwright global exclusion Jenkins wiring', { tag: '@svc-internal' }, () => {
  const pipelineFiles = ['Jenkinsfile_CNP', 'Jenkinsfile_nightly', 'Jenkinsfile_parameterized'];
  const expectedSecret =
    'secret(\'xui-manage-org-playwright-global-excluded-tags\', \'PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS\')';

  for (const pipelineFile of pipelineFiles) {
    test(`${pipelineFile} maps the Manage Org secret and exposes the bypass`, () => {
      const pipeline = fs.readFileSync(path.resolve(process.cwd(), pipelineFile), 'utf8');

      expect(pipeline).toContain(expectedSecret);
      expect(pipeline).toContain('name: \'PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES\'');
      expect(pipeline).toContain(
        'PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES=${params.PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES'
      );
    });
  }

  test('parameterized wiring remains covered because the repo identifies it as an active pipeline', () => {
    const architectureGuard = fs.readFileSync(path.resolve(process.cwd(), 'scripts/check-playwright-architecture.js'), 'utf8');
    const parameterizedPipeline = fs.readFileSync(path.resolve(process.cwd(), 'Jenkinsfile_parameterized'), 'utf8');

    expect(architectureGuard).toMatch(
      /activePipelineFiles\s*=\s*\[[\s\S]*?'Jenkinsfile_parameterized'[\s\S]*?\]/
    );
    expect(parameterizedPipeline).toContain('$class: \'GitHubPushTrigger\'');
  });
});
