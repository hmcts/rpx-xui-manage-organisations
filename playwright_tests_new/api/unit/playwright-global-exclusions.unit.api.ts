import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  resolveApiTagFilters,
  resolveE2eTagFilters,
  resolveIntegrationTagFilters,
  splitTagInput
} from '../../../playwright-tag-filter';

let smokeRunner: {
  buildSmokePlaywrightArgs: (env?: NodeJS.ProcessEnv, extraArgs?: string[]) => string[];
};

test.describe('Playwright global exclusion policy', { tag: '@svc-internal' }, () => {
  test.beforeAll(async () => {
    const smokeModule = await import('../../../scripts/run-playwright-smoke.cjs');
    smokeRunner = (smokeModule.default ?? smokeModule) as typeof smokeRunner;
  });

  test('parses spaces and commas, normalises prefixes and deduplicates in order', () => {
    expect(splitTagInput('svc-user-admin, @svc-user-session  svc-user-admin')).toEqual(['@svc-user-admin', '@svc-user-session']);
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
    expect(resolveE2eTagFilters({ E2E_PW_EXCLUDED_TAGS_OVERRIDE: '@registration' }).excludedTags).toEqual(['@registration']);
    expect(resolveE2eTagFilters({ E2E_PW_EXCLUDED_TAGS_OVERRIDE: '@none' }).excludedTags).toEqual([]);
    expect(resolveE2eTagFilters({ E2E_PW_EXCLUDED_TAGS_OVERRIDE: '@none @registration' }).excludedTags).toEqual([
      '@registration'
    ]);
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
      PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@integration-user-admin'
    });

    expect(filters.grepInvert?.test('test @integration-user-admin')).toBe(true);
    expect(filters.grepInvert?.test('test @integration-user-admin-extended')).toBe(false);
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

  test('validates global exclusions against custom API, E2E and integration catalogs', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'playwright-tag-catalogs-'));
    const catalogPaths = {
      API_PW_TAG_FILTER_CONFIG: path.join(tempDir, 'api.json'),
      E2E_PW_TAG_FILTER_CONFIG: path.join(tempDir, 'e2e.json'),
      INTEGRATION_PW_TAG_FILTER_CONFIG: path.join(tempDir, 'integration.json')
    };

    fs.writeFileSync(catalogPaths.API_PW_TAG_FILTER_CONFIG, JSON.stringify({ availableTags: ['@svc-custom'] }));
    fs.writeFileSync(catalogPaths.E2E_PW_TAG_FILTER_CONFIG, JSON.stringify({ availableTags: ['@registration-custom'] }));
    fs.writeFileSync(catalogPaths.INTEGRATION_PW_TAG_FILTER_CONFIG, JSON.stringify({ availableTags: ['@integration-custom'] }));

    try {
      const env = {
        ...catalogPaths,
        PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@svc-custom @registration-custom @integration-custom'
      };

      expect(resolveApiTagFilters(env).globalExcludedTags).toEqual(['@svc-custom']);
      expect(resolveE2eTagFilters(env).globalExcludedTags).toEqual(['@registration-custom']);
      expect(resolveIntegrationTagFilters(env).globalExcludedTags).toEqual(['@integration-custom']);

      fs.writeFileSync(catalogPaths.E2E_PW_TAG_FILTER_CONFIG, JSON.stringify({ availableTags: ['@registration-other'] }));
      expect(() => resolveApiTagFilters(env)).toThrow(
        /PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS contains unknown tag.*@registration-custom/
      );
    } finally {
      fs.rmSync(tempDir, { force: true, recursive: true });
    }
  });

  test('bypass does not read irrelevant global catalogs', () => {
    const missingCatalog = path.join(os.tmpdir(), `playwright-tag-catalog-${process.pid}-${Date.now()}.json`);
    const filters = resolveE2eTagFilters({
      API_PW_TAG_FILTER_CONFIG: missingCatalog,
      INTEGRATION_PW_TAG_FILTER_CONFIG: missingCatalog,
      PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@obsolete-global-tag',
      PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES: 'true'
    });

    expect(filters.globalExcludedTags).toEqual([]);
    expect(filters.ignoredGlobalExcludedTags).toEqual(['@obsolete-global-tag']);
  });

  test('rejects unknown global tags before suite intersection', () => {
    expect(() => resolveApiTagFilters({ PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@registraton' })).toThrow(
      /PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS contains unknown tag.*@registraton/
    );
  });

  test('rejects whole-suite global exclusions but preserves include tags', () => {
    for (const tag of ['@e2e', '@integration']) {
      expect(() => resolveE2eTagFilters({ PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: tag })).toThrow(
        new RegExp(`cannot exclude whole-suite tag\\(s\\): ${tag}`)
      );
    }

    expect(resolveE2eTagFilters({ E2E_PW_INCLUDE_TAGS: '@e2e-smoke' }).includeTags).toEqual(['@e2e-smoke']);
    expect(resolveIntegrationTagFilters({ INTEGRATION_PW_INCLUDE_TAGS: '@integration' }).includeTags).toEqual(['@integration']);
  });

  test('allows the smoke project to be globally excluded through its safe package runner', () => {
    const filters = resolveE2eTagFilters({ PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@e2e-smoke' });

    expect(filters.globalExcludedTags).toEqual(['@e2e-smoke']);
    expect(filters.grepInvert?.test('journey @e2e-smoke')).toBe(true);
    expect(smokeRunner.buildSmokePlaywrightArgs({ PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@e2e-smoke' })).toEqual([
      'test',
      '--project=smoke',
      '--pass-with-no-tests',
      '--reporter=list'
    ]);
    expect(
      smokeRunner.buildSmokePlaywrightArgs({
        PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: '@e2e-smoke',
        PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES: 'true'
      })
    ).toEqual(['test', '--project=smoke']);
    expect(
      smokeRunner.buildSmokePlaywrightArgs(
        { PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS: 'e2e-smoke' },
        ['--reporter=null', '--list']
      )
    ).toEqual(['test', '--project=smoke', '--reporter=null', '--list', '--pass-with-no-tests']);
  });
});

test.describe('Playwright global exclusion Jenkins wiring', { tag: '@svc-internal' }, () => {
  const pipelineFiles = ['Jenkinsfile_CNP', 'Jenkinsfile_nightly'];
  const expectedSecret = /secret\('xui-manage-org-playwright-global-excluded-tags', 'PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS'\)/;
  const bypassParameter = /name: 'PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES'/;

  for (const pipelineFile of pipelineFiles) {
    test(`${pipelineFile} maps the Manage Org secret and exposes the bypass`, () => {
      const pipeline = fs.readFileSync(path.resolve(process.cwd(), pipelineFile), 'utf8');

      expect(pipeline).toMatch(expectedSecret);
      expect(pipeline).toMatch(bypassParameter);
      expect(pipeline).toContain('PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES=${params.PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES');
    });
  }

  test('legacy parameterized pipeline does not require the CNP Key Vault secret', () => {
    const parameterizedPipeline = fs.readFileSync(path.resolve(process.cwd(), 'Jenkinsfile_parameterized'), 'utf8');

    expect(parameterizedPipeline).not.toMatch(expectedSecret);
    expect(parameterizedPipeline).not.toMatch(bypassParameter);
  });

  test('local population overwrites an ambiguous tagged value from the exact Manage Org secret', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mo-key-vault-population-'));
    const binDir = path.join(tempDir, 'bin');
    const outputFile = path.join(tempDir, '.env');
    const templateFile = path.join(tempDir, '.env.example');
    const azLog = path.join(tempDir, 'az.log');
    fs.mkdirSync(binDir);
    fs.writeFileSync(templateFile, 'PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS=@none\n', 'utf8');

    fs.writeFileSync(
      path.join(binDir, 'node'),
      `#!/usr/bin/env bash
set -euo pipefail
if [[ "\${1:-}" == *get-secrets.js ]]; then
  cp "$3" "$4"
  printf '\\nPLAYWRIGHT_GLOBAL_EXCLUDED_TAGS=@svc-user-admin\\n' >> "$4"
  exit 0
fi
exec ${JSON.stringify(process.execPath)} "$@"
`,
      { mode: 0o755 }
    );
    fs.writeFileSync(
      path.join(binDir, 'az'),
      `#!/usr/bin/env bash
set -euo pipefail
printf '%s\\n' "$*" >> "$AZ_LOG"
if [[ "$*" == *"--name xui-manage-org-playwright-global-excluded-tags"* ]]; then
  printf '%s\\n' '@registration'
fi
`,
      { mode: 0o755 }
    );

    try {
      execFileSync(
        'bash',
        [path.resolve(process.cwd(), 'scripts/populate-env-from-keyvault.sh'), 'aat', outputFile, templateFile],
        {
          cwd: process.cwd(),
          env: {
            ...process.env,
            AZ_LOG: azLog,
            PATH: `${binDir}:${process.env.PATH}`
          }
        }
      );

      const populatedEnv = fs.readFileSync(outputFile, 'utf8');
      const keyVaultCalls = fs.readFileSync(azLog, 'utf8');
      expect(populatedEnv).toContain('PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS=@registration');
      expect(populatedEnv).not.toContain('PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS=@svc-user-admin');
      expect(keyVaultCalls).toContain('--name xui-manage-org-playwright-global-excluded-tags');
      expect(keyVaultCalls).not.toContain('--name xui-playwright-global-excluded-tags');
      expect(keyVaultCalls).not.toContain('--name xui-approve-org-playwright-global-excluded-tags');
    } finally {
      fs.rmSync(tempDir, { force: true, recursive: true });
    }
  });
});
