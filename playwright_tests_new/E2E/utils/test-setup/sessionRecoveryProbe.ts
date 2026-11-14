import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

export async function runSessionRecoveryProbe(mode: 'parallel' | 'restart' | 'ui') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mo-session-probe-'));
  const repo = process.cwd();
  const children: ChildProcess[] = [];
  let firstRequest = true;
  let interruptedResponseClosed = false;
  let logins = 0;
  const server = http.createServer((req, res) => {
    if (mode === 'restart' && firstRequest) {
      firstRequest = false;
      res.on('close', () => {
        if (!res.writableFinished) {
          interruptedResponseClosed = true;
        }
      });
      return;
    }
    if (req.url === '/authenticate') {
      logins++;
      res.writeHead(302, { location: '/organisation', 'set-cookie': '__auth__=synthetic; Path=/; HttpOnly' });
      res.end();
      return;
    }
    if (req.url === '/api/organisation/v1') {
      res.writeHead(req.headers.cookie?.includes('__auth__=synthetic') ? 200 : 401);
      res.end('{}');
      return;
    }
    res.setHeader('content-type', 'text/html');
    res.end(
      req.headers.cookie?.includes('__auth__=synthetic')
        ? '<a href="/organisation">Organisation</a>'
        : '<form method="post" action="/authenticate"><label>Email address<input name="email"></label><label>Password<input name="password" type="password"></label><button>Sign in</button></form>'
    );
  });
  const terminate = async (child: ChildProcess) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      return;
    }
    const exited = new Promise<void>((resolve) => child.once('close', () => resolve()));
    const signal = (name: NodeJS.Signals) => {
      try {
        process.kill(-child.pid!, name);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ESRCH') {
          throw error;
        }
      }
    };
    signal('SIGTERM');
    let timer: NodeJS.Timeout | undefined;
    try {
      await Promise.race([
        exited,
        new Promise<void>((resolve) => {
          timer = setTimeout(resolve, 5_000);
        })
      ]);
    } finally {
      clearTimeout(timer);
    }
    if (child.exitCode === null && child.signalCode === null) {
      signal('SIGKILL');
      try {
        await Promise.race([
          exited,
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error('Test runner did not stop; fixtures retained.')), 5_000);
          })
        ]);
      } finally {
        clearTimeout(timer);
      }
    }
  };
  try {
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Synthetic server has no address.');
    }
    const baseUrl = `http://127.0.0.1:${address.port}/`;
    const run = async (name: string, restart: boolean) => {
      const directory = path.join(root, name);
      fs.mkdirSync(directory);
      const receipt = path.join(directory, 'receipt.json');
      const before = path.join(directory, 'before.json');
      fs.writeFileSync(path.join(directory, 'playwright.config.cjs'), `module.exports=${JSON.stringify({
        testDir: path.join(repo, 'playwright_tests_new/E2E/test/framework'),
        testMatch: 'session-recovery.child.test.ts', workers: 1, retries: 0,
        timeout: 25_000, globalTimeout: 45_000, reporter: 'line',
        use: { baseURL: baseUrl }, outputDir: path.join(directory, 'results')
      })};`);
      const env = Object.fromEntries(
        ['PATH', 'HOME', 'TMPDIR', 'PLAYWRIGHT_BROWSERS_PATH'].flatMap((key) =>
          process.env[key] === undefined ? [] : [[key, process.env[key]!]]
        )
      );
      const child = spawn(
        process.execPath,
        [path.join(repo, 'node_modules/@playwright/test/cli.js'), 'test', '-c', path.join(directory, 'playwright.config.cjs')],
        {
          cwd: repo,
          detached: true,
          stdio: ['ignore', 'pipe', 'pipe'],
          env: {
            ...env,
            TEST_URL: baseUrl,
            TEST_ROO_EMAIL: 'fictional@example.invalid',
            TEST_ROO_PASSWORD: 'synthetic',
            TEST_USER1_EMAIL: 'base@example.invalid',
            TEST_USER1_PASSWORD: 'synthetic',
            MANAGE_ORG_STORAGE_STATE: path.join(root, 'shared-state'),
            MO_RECOVERY_PROBE_MODE: mode === 'ui' ? 'ui' : restart ? 'restart' : 'parallel',
            MO_RECOVERY_PROBE_RECEIPT: receipt, MO_RECOVERY_PROBE_BEFORE: before
          }
        }
      );
      children.push(child);
      let output = '';
      child.stdout.on('data', (chunk) => {
        output += chunk.toString();
      });
      child.stderr.on('data', (chunk) => {
        output += chunk.toString();
      });
      let timer: NodeJS.Timeout | undefined;
      try {
        const code = await Promise.race([
          new Promise<number | null>((resolve, reject) => {
            child.once('error', reject);
            child.once('close', resolve);
          }),
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error('Synthetic runner exceeded its deadline.')), 55_000);
          })
        ]);
        return {
          code,
          output,
          receipt: fs.existsSync(receipt) ? JSON.parse(fs.readFileSync(receipt, 'utf8')) : undefined,
          before: fs.existsSync(before) ? JSON.parse(fs.readFileSync(before, 'utf8')) : undefined
        };
      } finally {
        clearTimeout(timer);
      }
    };
    const results =
      mode === 'parallel'
        ? await Promise.all([run('first', false), run('second', false)])
        : [await run(mode, mode === 'restart')];
    return { results, interruptedResponseClosed, logins };
  } finally {
    try {
      await Promise.all(children.map(terminate));
      fs.rmSync(root, { recursive: true, force: true });
    } finally {
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  }
}
