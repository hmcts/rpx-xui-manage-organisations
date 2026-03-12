
import * as ejs from 'ejs';
import * as express from 'express';
import { readFileSync } from 'fs';
import * as path from 'path';
import { app } from '../api/application';
import errorHandler from '../api/lib/error.handler';

console.log('WE ARE USING server.ts on the box.');

/**
 * Used Server side
 */
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.use(express.static(path.join(__dirname, '../dist/rpx-xui-manage-organisations', 'assets'), { index: false }));
app.use(express.static(path.join(__dirname, '../dist/rpx-xui-manage-organisations'), { index: false }));

/**
 * Used on server.ts only but should be fine to lift and shift to local.ts
 */
app.use('/*', (req, res) => {
  res.set('Cache-Control', 'no-store, s-maxage=0, max-age=0, must-revalidate, proxy-revalidate');
  const html = injectNonce(indexHtmlRaw, res.locals.cspNonce as string);
  res.type('html').send(html);
});

const port = process.env.PORT || 3000;

app.use(errorHandler);
// app.listen(port, () => logger.info(`Local server up at ${port}`));

function loadIndexHtml(): string {
  const built = path.join(__dirname, '../dist/rpx-xui-manage-organisations', 'index.html');
  return readFileSync(built, 'utf8');
}
const indexHtmlRaw = loadIndexHtml();

function injectNonce(html: string, nonce: string): string {
  return html.replace(/{{\s*cspNonce\s*}}/g, nonce);
}

class ApplicationServer {
  server: any
  app: any

  async start() {
    if (process.env.SSR_ALREADY_RUNNING === 'true') {
      console.log('[localServer] SSR already up – skipping second listen()');
      return;
    }
    app.get('/*', (req, res) => {
      res.set('Cache-Control', 'no-store, s-maxage=0, max-age=0, must-revalidate, proxy-revalidate');
      const html = injectNonce(indexHtmlRaw, res.locals.cspNonce as string);
      res.type('html').send(html);
    });
    this.server = await app.listen(3000);
    try {
      // const res = await axios.get('http://localhost:3000/auth/isAuthenticated')
      // console.log(res.data)


    } catch (err) {
      console.log(err)

    }


  }

  async stop() {
    if (!this.server) {
      console.log('[SSR] stop() called but no server instance - skipping');
      return;
    }
    await this.server.close();
  }


}

const applicationServer = new ApplicationServer();

// applicationServer.start()
export default applicationServer;

