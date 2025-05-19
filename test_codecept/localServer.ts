
import * as ejs from 'ejs';
import * as express from 'express';
import * as path from 'path';
import { createApp, logger } from '../api/application';
import errorHandler from '../api/lib/error.handler';
import axios from 'axios';

class ApplicationServer {
  server: any;
  app: any;

  async initialize() {
    this.app = await createApp();
    console.log('WE ARE USING server.ts on the box.');
    this.app.engine('html', ejs.renderFile);
    this.app.set('view engine', 'html');
    this.app.set('views', __dirname);

    this.app.use(express.static(path.join(__dirname, '../dist/rpx-xui-manage-organisations', 'assets'), { index: false }));
    this.app.use(express.static(path.join(__dirname, '../dist/rpx-xui-manage-organisations'), { index: false }));

    /**
         * Used on server.ts only but should be fine to lift and shift to local.ts
         */
    this.app.use('/*', (req, res) => {
      console.time(`GET: ${req.originalUrl}`);
      res.render('../dist/rpx-xui-manage-organisations/index', {
        providers: [{ provide: 'REQUEST', useValue: req }, { provide: 'RESPONSE', useValue: res }],
        req,
        res
      });
      console.timeEnd(`GET: ${req.originalUrl}`);
    });

    const port = process.env.PORT || 3000;

    this.app.use(errorHandler);
  }

  async start() {
    this.server = await this.app.listen(3000);
    try {
      // const res = await axios.get('http://localhost:3000/auth/isAuthenticated')
      // console.log(res.data)

    } catch (err) {
      console.log(err);
    }
  }

  async stop() {
    return await this.server.close();
  }
}

const applicationServer = new ApplicationServer();

// applicationServer.start()
export default applicationServer;

