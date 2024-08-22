import express, { Request, Response } from "express";
import { GithubUser } from "services/Auth/github/types";

const screenRouter = express.Router();

screenRouter.get("/", (req: Request, res: Response) => {
  res.send('<a href="/auth/github">Login with GitHub</a>');
});

screenRouter.get("/profile", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  const user = req.user as GithubUser;
  const userName = user?.displayName || "User";
  const userProfileUrl = user?.profileUrl || "#";
  const userPhoto = user?.photos[0]?.value || "#";

  res.render("profile", {
    userName,
    userProfileUrl,
    userPhoto,
  });
});

screenRouter.get("/logout", (req: Request, res: Response) => {
  req.logout(() => {
    res.redirect("/");
  });
});

export default screenRouter;
