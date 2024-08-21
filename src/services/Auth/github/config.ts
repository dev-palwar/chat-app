import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

// Configuring Passport to use GitHubStrategy
export function configurePassport() {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        callbackURL: "http://localhost:3000/auth/github/callback",
      },
      (profile: any, done: any) => {
        // save the data in a db
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
    done(null, user);
  });

  passport.deserializeUser((obj: any, done: (err: any, user?: any) => void) => {
    done(null, obj);
  });
}
