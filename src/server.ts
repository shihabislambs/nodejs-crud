import * as express from 'express';
import * as Environment from './config/environments';
import logger from './config/log';

const app = express();

/**
 * Setup listener port
 */
const PORT = Environment.PORT;
app.listen(PORT, () => {
  logger.info(`Running Node.js version ${process.version}`);
  logger.info(`App environment: ${Environment.NODE_ENV}`);
  logger.info(`App is running on port ${PORT}`);
});

export default app;
