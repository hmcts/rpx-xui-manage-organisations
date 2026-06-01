import 'source-map-support/register';

import * as ejs from 'ejs';
import * as express from 'express';
import * as path from 'path';
import { app, logger } from './application';
import errorHandler from './lib/error.handler';

logger.info('Starting server runtime');

/**
 * Used Server side
 */
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.use(express.static(path.join(__dirname, '..', 'assets'), { index: false }));
app.use(express.static(path.join(__dirname, '..'), { index: false }));

/**
 * Used on server.ts only but should be fine to lift and shift to local.ts
 */
app.use('/*', (req, res) => {
  const startTime = Date.now();
  res.set('Cache-Control', 'no-store, s-maxage=0, max-age=0, must-revalidate, proxy-revalidate');
  res.render('../index', {
    providers: [{ provide: 'REQUEST', useValue: req }, { provide: 'RESPONSE', useValue: res }],
    req,
    res
  });
  logger.info('Rendered server route', {
    duration: Date.now() - startTime,
    method: req.method,
    url: req.originalUrl
  });
});

const port = process.env.PORT || 3000;

app.use(errorHandler);
app.listen(port, () => logger.info(`Local server up at ${port}`));
