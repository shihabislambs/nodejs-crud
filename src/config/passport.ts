import User from '../models/UserModel';
import * as passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

/**
 * Verfiy JWT
 */
const jwtOptions = {
  secretOrKey: 'very-secret-token',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  if (!payload.id) {
    done('Invalid token.', null);
    return;
  }

  const user = await User.query().findById(payload.id);
  done(null, user);
}));
