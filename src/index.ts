import express, { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import { configurePassport } from "../src/services/Auth/github/config";
import authRouter from "../src/services/Auth/github/routes/index";

const app = express();
configurePassport();

// Configuring session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
  })
);

// Initializing Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRouter);

// Define routes
app.get("/", (req: Request, res: Response) => {
  res.send('<a href="/auth/github">Login with GitHub</a>');
});

app.get("/profile", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send(`Hello, ${req.user}!`);
});

app.get("/logout", (req: Request, res: Response) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
