import { createApp, logger } from './application';
import errorHandler from './lib/error.handler';

createApp()
  .then((app) => {
    const port = process.env.PORT || 3001;

    console.log('WE ARE USING local.ts on the box.');
    app.use(errorHandler);
    app.listen(port, () => logger.info(`Local server up at ${port}`));
  });
