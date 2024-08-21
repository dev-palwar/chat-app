import express, { Request, Response } from "express";
import passport from "passport";

const authRouter = express.Router();

authRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req: Request, res: Response) => {
    // Successful authentication, redirecting to the dashboard
    res.redirect("/profile");
  }
);

export default authRouter;
