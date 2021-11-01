import {log} from './utils/log.js';
import express, {ErrorRequestHandler} from 'express';
import {StatusCodes} from 'http-status-codes';
import {getEnv} from './utils/getEnv.js';
import {deleteUserRoute} from './routes/user/deleteUserRoute.js';
import {getUserRoute} from './routes/user/getUserRoute.js';
import {postUserRoute} from './routes/user/postUserRoute.js';
import {patchUserRoute} from './routes/user/patchUserRoute.js';

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

server.use(postUserRoute);
server.use(getUserRoute);
server.use(patchUserRoute);
server.use(deleteUserRoute);

/**
 * Error handling.
 */

const errorRequestHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
  } else {
    log(error);

    if (getEnv('NODE_ENV') === 'production') {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
      res.end();
    } else {
      res.status(error.statusCode).send(error.stack);
    }
  }
};

server.use(errorRequestHandler);

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
    log(`Server started, listening on ${address}`);
  });
}
