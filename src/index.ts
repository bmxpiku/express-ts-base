import './LoadEnv'; // Must be the first import
import init from '@server';
import logger from '@shared/Logger';

// Start the server
const port = Number(process.env.PORT || 3000);
init().then((app) => app.listen(port, () => {
  logger.info(`Server listening on port: ${port}`);
}));
