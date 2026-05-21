import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import {
  externalRouteExclusions,
  protectedRouteInventory
} from '../utils/protected-api-route-inventory';

const routeFile = (relativePath: string): string => join(process.cwd(), relativePath);

const protectedRoutesFromSource = (source: string): string[] => {
  const protectedBlock = source.split('router.use(xuiNode.authenticate);')[1] ?? '';

  return [...protectedBlock.matchAll(/router\.use\('([^']+)'/g)]
    .map((match) => match[1])
    .sort();
};

const externalRoutesFromSource = (source: string): string[] =>
  [...source.matchAll(/router\.use\('([^']+)'/g)]
    .map((match) => match[1])
    .sort();

test.describe('Protected API route coverage inventory', { tag: '@svc-route-coverage' }, () => {
  test('matches every protected API route registered after authentication', async () => {
    const routesSource = await fs.readFile(routeFile('api/routes.ts'), 'utf8');
    const actualProtectedRoutes = protectedRoutesFromSource(routesSource);
    const inventoriedRoutes = protectedRouteInventory.map(({ route }) => route).sort();

    expect(inventoriedRoutes, 'Every protected API route should have guardrail coverage or an explicit decision').toEqual(
      actualProtectedRoutes
    );
    expect(
      protectedRouteInventory.filter(({ evidence }) => evidence.trim().length === 0),
      'Every protected route inventory entry should state coverage evidence or an exclusion reason'
    ).toEqual([]);
  });

  test('keeps inventory coverage files present and guardrail entries tied to executable tests', async () => {
    const entriesWithCoverageFiles = protectedRouteInventory.filter(({ coverageFile }) => coverageFile);
    const guardrailEntries = protectedRouteInventory.filter(({ coverageType }) => coverageType === 'guardrail-test');

    expect(entriesWithCoverageFiles.length, 'Protected route inventory should reference executable coverage files').toBeGreaterThan(0);
    expect(guardrailEntries.length, 'Protected route inventory should include executable guardrail-test entries').toBeGreaterThan(0);

    const sourceByFile = new Map<string, string>();
    for (const entry of entriesWithCoverageFiles) {
      const coverageFile = entry.coverageFile as string;
      if (!sourceByFile.has(coverageFile)) {
        sourceByFile.set(coverageFile, await fs.readFile(routeFile(coverageFile), 'utf8'));
      }
    }

    for (const entry of guardrailEntries) {
      const coverageFile = entry.coverageFile as string;
      expect(sourceByFile.get(coverageFile), `${entry.route} should stay tied to its guardrail test`).toContain(entry.evidence);
    }
  });

  test('documents every intentional external API route separately from protected routes', async () => {
    const openRoutesSource = await fs.readFile(routeFile('api/openRoutes.ts'), 'utf8');
    const actualExternalRoutes = externalRoutesFromSource(openRoutesSource);
    const inventoriedExternalRoutes = externalRouteExclusions.map(({ route }) => route).sort();

    expect(
      inventoriedExternalRoutes,
      'Every /external route should have an explicit reason for being outside protected API auth'
    ).toEqual(actualExternalRoutes);
    expect(
      externalRouteExclusions.filter(({ reason }) => reason.trim().length === 0),
      'Every external route exclusion should explain why it is intentionally open'
    ).toEqual([]);
  });
});
