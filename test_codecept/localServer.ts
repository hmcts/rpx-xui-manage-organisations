// test_codecept/localServer.ts
import * as express from 'express';
import { app as realApp, logger } from '../api/application';
import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import * as net from 'net';
import helmet from 'helmet';
import { csp, SECURITY_POLICY } from '@hmcts/rpx-xui-node-lib';
import { MO_CSP } from '../api/interfaces/csp-config';

// ---- helpers ---------------------------------------------------------------
function isHtmlNav(req: express.Request) {
  const accept = String(req.headers['accept'] || '');
  return req.method === 'GET' && accept.includes('text/html');
}
function looksLikeAssetOrApi(p: string) {
  return (
    p === '/favicon.ico' ||
    p.startsWith('/assets') ||
    p.startsWith('/dist') ||
    p.startsWith('/api') ||
    p.startsWith('/external') ||
    /\.(js|css|map|png|jpg|svg|ico|woff2?)$/i.test(p)
  );
}
// Build-time index loader (in-memory, no files written)
function loadPatchedBuiltIndex(): string {
  const distRoot = path.join(__dirname, '..', 'dist', 'rpx-xui-manage-organisations');
  const p = path.join(distRoot, 'index.html');
  if (!existsSync(p)) {
    throw new Error(`Built index not found at ${p}. Run "yarn build" first.`);
  }
  let html = readFileSync(p, 'utf8');

  // Ensure <base> so all bundle URLs resolve from /dist/... even though we serve the shell ourselves
  if (/<base\s+href=/i.test(html)) {
    html = html.replace(
      /<base\s+href=["'][^"']*["']\s*\/?>/i,
      `<base href="/dist/rpx-xui-manage-organisations/">`
    );
  } else {
    html = html.replace(
      /<head([^>]*)>/i,
      `<head$1>\n  <base href="/dist/rpx-xui-manage-organisations/">`
    );
  }

  // Ensure a nonce placeholder the wrapper will fill (and tests can read)
  if (!/meta\s+name=["']csp-nonce["']/i.test(html)) {
    html = html.replace(
      /<head([^>]*)>/i,
      `<head$1>\n  <meta name="csp-nonce" content="{{cspNonce}}">`
    );
  }

  // (Recommended) nonce stamping for dynamic chunks & styles
  if (!/__webpack_nonce__/.test(html)) {
    const patch = `
    <script nonce="{{cspNonce}}">
      (function() {
        var n = document.querySelector('meta[name="csp-nonce"]')?.content || '';
        // @ts-ignore
        window.__webpack_nonce__ = n;
        var ce = Document.prototype.createElement;
        Document.prototype.createElement = function(tag) {
          var el = ce.call(this, tag);
          var t = String(tag).toLowerCase();
          if (t === 'script' || t === 'style') try { el.setAttribute('nonce', n); } catch(e) {}
          return el;
        };
      })();
    </script>`;
    html = html.replace(/<\/head>/i, `${patch}\n</head>`);
  }

  return html;
}

async function isPortOpen(port: number, host = '127.0.0.1') {
  return await new Promise<boolean>((resolve) => {
    const s = new net.Socket();
    s.setTimeout(500);
    s.once('connect', () => { s.destroy(); resolve(true); });
    s.once('timeout', () => { s.destroy(); resolve(false); });
    s.once('error', () => resolve(false));
    s.connect(port, host);
  });
}

// ---- server wrapper --------------------------------------------------------
class ApplicationServer {
  private server: import('http').Server | null = null;
  private ownsServer = false;

  private port() { return Number(process.env.PORT || 3000); }

  async start() {
    const type = process.env.TEST_TYPE;
    if (!(type === 'ngIntegration' || type === 'a11y')) {
      logger?.info?.(`[localServer] Skipping start for TEST_TYPE=${type}`);
      return;
    }
    const port = this.port();
    if (await isPortOpen(port)) { this.ownsServer = false; return; }

    const builtShell = loadPatchedBuiltIndex();

    // Host wraps the real app: it serves the SPA shell for HTML navigations,
    // and delegates everything else (assets, APIs, health, etc.) to realApp.
    const host = express();

    // Add Helmet/CSP here so the shell we serve has proper headers + a nonce
    host.use(helmet()); // keep defaults; mirrors your app’s behaviour in tests
    host.use(csp({ defaultCsp: SECURITY_POLICY, ...MO_CSP }));

    // Serve the built shell for navigations *before* handing off to the real app
    host.use((req, res, next) => {
      if (isHtmlNav(req) && !looksLikeAssetOrApi(req.path)) {
        const nonce: string = (res.locals as any)?.cspNonce || '';
        const html = builtShell.replace(/{{cspNonce}}/g, nonce);
        res.type('html').set('Cache-Control', 'no-store, max-age=0').send(html);
      } else {
        next();
      }
    });

    // Hand off everything else to the real app (which serves /dist assets, /api, etc.)
    host.use(realApp);

    this.server = host.listen(port, () => {
      this.ownsServer = true;
      logger?.info?.(`[localServer] Wrapper listening on ${port}`);
    });
  }

  async stop() {
    if (this.server && this.ownsServer) {
      await new Promise<void>((resolve) => this.server!.close(() => resolve()));
      this.server = null;
      this.ownsServer = false;
      logger?.info?.('[localServer] Stopped');
    }
  }
}

export default new ApplicationServer();
