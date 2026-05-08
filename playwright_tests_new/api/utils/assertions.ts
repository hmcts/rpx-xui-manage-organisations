import { expect } from '@playwright/test';

export const expectStatus = (actual: number, allowed: ReadonlyArray<number>, message?: string): void => {
  expect(allowed, message ?? `Expected status ${actual} to be one of: ${allowed.join(', ')}`).toContain(actual);
};

export const expectObject = (value: unknown, message: string): Record<string, unknown> => {
  expect(value, message).toBeTruthy();
  expect(typeof value, message).toBe('object');
  expect(Array.isArray(value), message).toBe(false);
  return value as Record<string, unknown>;
};

export const expectArray = <T = unknown>(value: unknown, message: string): T[] => {
  expect(Array.isArray(value), message).toBe(true);
  return value as T[];
};
