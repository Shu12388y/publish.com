import { Hono } from "hono";
import { authController } from "../controller/auth.controller.js";
import {
  requireAuth,
  type AuthVariables,
} from "../../topics-services/middleware/auth.middleware.js";

export const authRoute = new Hono<{ Variables: AuthVariables }>();

authRoute.post("/signin", authController.login);
authRoute.post("/signup", authController.signup);
authRoute.post("/signout", authController.signout);
authRoute.get("/session", requireAuth, authController.session);
