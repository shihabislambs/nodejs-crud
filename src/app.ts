import { install as installSourceMapSupport } from 'source-map-support';
installSourceMapSupport();

import * as express from 'express';
import * as compress from 'compression';
import * as process from 'process';
import app from './server';
import './config/passport';
import logger from './config/log';
import * as Environment from './config/environments';
import { configCors } from './config/cors';

app.disable('x-powered-by'); // Hide information
app.use(compress()); // Compress

/**
 * Cors configuration
 * Allow REST tools or server-to-server requests
 */
configCors(app);

/**
 * MySQL configuration
 **/
import { connectToDatabase } from './config/database';
connectToDatabase();

/**
 * Body-parser
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Wraps async functions, catching all errors and sending them forward to express error handler
function asyncMiddleware(fn: CallableFunction) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * End-Points
 */
app.get('/environment', function (_req, res) {
  res.send({ environment: Environment.NODE_ENV, log_level: process.env.LOG_LEVEL });
});

import * as authController from './controllers/authenticationController';
app.post('/login', asyncMiddleware(authController.login));
app.get('/issue-jwt', authController.isAuthenticated, asyncMiddleware(authController.issueNewJwt));

import * as todoController from './controllers/todosController';
app.post('/api/todo', authController.isAuthenticated, asyncMiddleware(todoController.create));
app.get('/api/todo', asyncMiddleware(todoController.get));
app.get('/api/todo/:id', asyncMiddleware(todoController.find));
app.put('/api/todo/:id', authController.isAuthenticated, asyncMiddleware(todoController.update));
app.delete('/api/todo/:id', authController.isAuthenticated, asyncMiddleware(todoController.remove));

import * as userController from './controllers/userController';
app.post('/api/user', asyncMiddleware(userController.create));
app.get('/api/user', asyncMiddleware(userController.get));

import { NotFoundError, ApplicationError } from './controllers/errorController';

// If you are lost
app.use(function (_req: express.Request, _res: express.Response) {
  throw new NotFoundError();
});

// Request error handler
app.use((err, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof ApplicationError) {
    if (err.message) {
      logger.info(err.message);
    }

    res.status(err.code).send(err.message);
    return;
  }

  if (err && err.status && parseInt(err.status) > 0) {
    res.sendStatus(err.status);
    return;
  }

  next(err);
});

// Log all errors
app.use(function (err, req: express.Request, _res: express.Response, next: express.NextFunction) {
  if (err instanceof Error) {
    logger.error(`${req.method} ${req.path}: Unhandled request error. ${err.message}`);
  } else if (typeof err === 'string') {
    logger.error(`${req.method} ${req.path}: Unhandled request error. ${err}`);
  }

  next(err);
});

// Optional fallthrough error handler
app.use(function onError(_err, _req: express.Request, res, _next: express.NextFunction) {
  res.sendStatus(500);
});

export default app;
