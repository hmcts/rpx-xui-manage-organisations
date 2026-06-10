import { app, logger } from './application';
import errorHandler from './lib/error.handler';

const port = process.env.PORT || 3001;

logger.info('Starting local runtime');
app.use(errorHandler);
app.listen(port, () => logger.info(`Local server up at ${port}`));
