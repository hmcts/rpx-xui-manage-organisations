import { expect, test } from '@playwright/test';
import { runSessionRecoveryProbe } from '../../utils/test-setup/sessionRecoveryProbe';

test.describe('Worker session recovery', { tag: '@e2e' }, () => {
  test.skip(process.platform === 'win32', 'Nested runner cleanup uses POSIX process groups.');
  test('simultaneous runners isolate worker zero and reuse their own authenticated state', async () => {
    test.setTimeout(70_000);
    const { results, logins } = await runSessionRecoveryProbe('parallel');
    for (const result of results) {
      expect(result.code, result.output).toBe(0);
    }
    expect(results.map((result) => result.receipt.worker)).toEqual([0, 0]);
    expect(results[0].receipt.path).not.toBe(results[1].receipt.path);
    expect(logins).toBe(2);
  });

  test('UI fixture reuses its worker-private state', async () => {
    test.setTimeout(70_000);
    const {
      results: [result],
      logins
    } = await runSessionRecoveryProbe('ui');
    expect(result.code, result.output).toBe(0);
    expect(result.receipt.step).toBe(2);
    expect(logins).toBe(1);
  });

  test('replacement worker captures successfully after a timed-out browser session', async () => {
    test.setTimeout(70_000);
    const {
      results: [result],
      interruptedResponseClosed,
      logins
    } = await runSessionRecoveryProbe('restart');
    expect(result.code, result.output).toBe(1);
    expect(result.output).toContain('1 failed');
    expect(result.output).toContain('1 passed');
    expect(result.receipt.path).not.toBe(result.before.path);
    expect(result.receipt.pid).not.toBe(result.before.pid);
    expect(interruptedResponseClosed).toBe(true);
    expect(logins).toBe(1);
  });
});
