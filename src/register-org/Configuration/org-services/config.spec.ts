import { baseConfig } from './base-config';
import { aatDifferences } from './aat-diffs';
import { testDifferences } from './test-diffs';
import { organisationServices } from './config';

describe('organisationServices', () => {
  it('keeps NONE as final fallback for aat and inserts new entries before it', () => {
    const config = organisationServices('aat');
    const noneIndex = config.findIndex((item) => item.key === 'NONE');
    const addedItemIndex = config.findIndex((item) => item.key === 'AAA3');

    expect(noneIndex).toBe(config.length - 1);
    expect(addedItemIndex).toBeGreaterThanOrEqual(0);
    expect(addedItemIndex).toBeLessThan(noneIndex);
  });

  it('keeps NONE as final fallback for non-prod, non-aat and non-preview environments', () => {
    const config = organisationServices('demo');
    const noneIndex = config.findIndex((item) => item.key === 'NONE');
    const addedItemIndex = config.findIndex((item) => item.key === 'AAA3');

    expect(noneIndex).toBe(config.length - 1);
    expect(addedItemIndex).toBeGreaterThanOrEqual(0);
    expect(addedItemIndex).toBeLessThan(noneIndex);
  });

  it('uses test differences when no environment is supplied', () => {
    const config = organisationServices(undefined);
    const addedItemIndex = config.findIndex((item) => item.key === 'AAA3');

    expect(addedItemIndex).toBeGreaterThanOrEqual(0);
  });

  it('returns base config for prod', () => {
    const config = organisationServices('prod');

    expect(config).toEqual(baseConfig);
    expect(config[config.length - 1].key).toBe('NONE');
  });

  it('returns a copy of base config when aat differences are empty', () => {
    const originalAatDifferences = [...aatDifferences];
    aatDifferences.length = 0;

    try {
      const config = organisationServices('aat');

      expect(config).toEqual(baseConfig);
      expect(config).not.toBe(baseConfig);
      expect(config[config.length - 1].key).toBe('NONE');
    } finally {
      aatDifferences.splice(0, aatDifferences.length, ...originalAatDifferences);
    }
  });

  it('uses base config when the runtime config value identifies prod', () => {
    expect(organisationServices('production')).toEqual(baseConfig);
    expect(organisationServices(undefined, 'https://hmcts-access.service.gov.uk')).toEqual(baseConfig);
  });

  it('uses aat differences when the fallback URL identifies aat', () => {
    const config = organisationServices(undefined, 'https://idam-web-public.aat.platform.hmcts.net');

    expect(config.find((item) => item.key === 'AAA3')).toBeTruthy();
  });

  it('uses test differences for other environment values', () => {
    const originalTestDifferences = [...testDifferences];
    testDifferences.splice(0, testDifferences.length, {
      key: 'TEST_ONLY',
      value: 'Test only service'
    });

    try {
      const config = organisationServices('saat');

      expect(config.find((item) => item.key === 'TEST_ONLY')).toBeTruthy();
    } finally {
      testDifferences.splice(0, testDifferences.length, ...originalTestDifferences);
    }
  });
});
