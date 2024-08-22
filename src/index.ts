import express from "express";
import session from "express-session";
import passport from "passport";
import { configurePassport } from "../src/services/Auth/github/config";
import authRouter from "../src/services/Auth/github/routes/index";
import { config } from "dotenv";
import screenRouter from "frontend/routes";
import path from "path";
import { fileURLToPath } from "url";

// initializing enviorment variables
config();

const app = express();
configurePassport();

// Getting the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "frontend", "static"));

// Serving static files
app.use(express.static(path.join(__dirname, "frontend", "static")));

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
app.use(screenRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
