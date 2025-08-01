import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserService } from '../services/userService';
import { logger } from './logger';

const userService = new UserService();

export function setupPassport(): void {
  // JWT Strategy
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'fallback_secret',
    algorithms: ['HS256']
  }, async (payload, done) => {
    try {
      const user = await userService.findById(payload.userId);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      logger.error('JWT Strategy error:', error);
      return done(error, false);
    }
  }));

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await userService.findByGoogleId(profile.id);
        
        if (user) {
          return done(null, user);
        }
        
        // Check if user exists with same email
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await userService.findByEmail(email);
          if (user) {
            // Link Google account to existing user
            await userService.linkGoogleAccount(user.id, profile.id);
            return done(null, user);
          }
        }
        
        // Create new user
        user = await userService.createFromGoogle({
          googleId: profile.id,
          email: email || '',
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          avatar: profile.photos?.[0]?.value || '',
          isEmailVerified: true
        });
        
        return done(null, user);
      } catch (error) {
        logger.error('Google Strategy error:', error);
        return done(error, false);
      }
    }));
  }

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await userService.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}