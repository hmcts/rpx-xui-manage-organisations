import { test as base, expect } from '@playwright/test';
import { PageFixtures, pageFixtures } from './page-objects/pages/page.fixtures';

export const test = base.extend<PageFixtures>(pageFixtures);
export { expect };
