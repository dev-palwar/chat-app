import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

export function configurePassport() {
  const clientID = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientID || !clientSecret) {
    throw new Error("GitHub OAuth credentials are missing");
  }

  passport.use(
    new GitHubStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: "http://localhost:3000/auth/github/callback",
      },
      (accessToken: string, refreshToken: string, profile: any, done: any) => {
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
