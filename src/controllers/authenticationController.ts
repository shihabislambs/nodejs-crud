import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import User from '../models/UserModel';
// import { RefreshToken } from '../models/RefreshTokenModel';
import { InvalidCredentialError, MissingFieldError } from './errorController';
import * as Environment from '../config/environments';

/**
 * Login using email and password then issue an access token and a refresh token
 * @body email User email
 * @body password User password
 */
export async function login(req: Request, res: Response) {
  if (!req.body.username) {
    throw new MissingFieldError('username');
  }

  if (!req.body.password) {
    throw new MissingFieldError('password');
  }

  const { username, password } = req.body;
  const user = await User.query().findOne({ username });

  if (!user) {
    throw new InvalidCredentialError();
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new InvalidCredentialError();
  }

  const accessTokenDuration = Environment.NODE_ENV === 'localhost' ? '7d' : '1h';
  const [access, refresh] = await Promise.all([
    generateJWT({ id: user.id }, accessTokenDuration, 'access'),
    generateJWT({ id: user.id }, '7d', 'refresh')
  ]);

  res.send({ access, refresh });
}

/**
 * Issue new JWT tokens and add the existing refresh token to block list
 * @header JWT refresh token
 */
export async function issueNewJwt(req: Request, res: Response) {
  const accessTokenDuration = Environment.NODE_ENV === 'localhost' ? '7d' : '1h';
  const [access, refresh] = await Promise.all([
    generateJWT({ id: req.user.id }, accessTokenDuration, 'access'),
    generateJWT({ id: req.user.id }, '7d', 'refresh')
  ]);

  res.send({ access, refresh });
}

/************************* HELPER FUNCTIONS ***********************/

/**
 * Generate JWT and return a promise
 * @param payload JWT payload
 * @param expiresIn Expiration timeline
 * @param subject Token subject
 */
async function generateJWT(payload: object, expiresIn: string, subject: string): Promise<{}> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, 'very-secret-token', { expiresIn, subject }, (error, sha) => {
      if (error) {
        reject(`Couldn\'t generate refresh token. Reason: ${error}`);
      }
      resolve(sha);
    });
  });
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  return passport.authenticate('jwt', { session: false })(req, res, next);
}
