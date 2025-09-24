import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all API routes onto this Express app.
// registerRoutes returns an http.Server, but on Vercel we only need the routes on the app.
await registerRoutes(app);

export default serverless(app);