import './LoadEnv';
import init from '@src/Server';
import logger from '@src/logger/Logger';

const port = Number(process.env.PORT || 3000);
init().then((app) => app.listen(port, () => {
  logger.info(`Server listening on port: ${port}`);
}));
