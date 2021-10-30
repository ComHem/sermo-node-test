import express from 'express';
import {userRouter} from './routes/user.js';
import {getEnv} from './utils/getEnv.js';

const NODE_ENV = getEnv('NODE_ENV');
const HOST = getEnv('HOST');
const PORT = parseInt(getEnv('PORT'));

/**
 * Server.
 */

// Export server so it can be tested.
export const server = express();

server.use(express.json());

server.disable('x-powered-by');

/**
 * Routing.
 */

/* istanbul ignore if */
if (NODE_ENV === 'development') {
  server.use('/_coverage', express.static('build/coverage/lcov-report'));
}

server.use(userRouter);

/**
 * Start server.
 */

// `require` won't be defined when this is run as an ES module by Node. It will
// be defined when this is loaded by Jest when testing, and in that case we
// don't want to start the server when it's loaded, but instead let the tests
// start it.
const isEsModuleRunByNode = typeof require === 'undefined';

/* istanbul ignore if */
if (isEsModuleRunByNode) {
  const httpServer = server.listen(PORT, HOST, () => {
    let address = httpServer.address();
    if (address && typeof address !== 'string') {
      address = `http://${address.address}:${address.port}`;
    }
    console.log(`Server started, listening on ${address}`);
  });
}
