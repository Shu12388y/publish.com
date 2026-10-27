import {Hono} from "hono";
import {authController} from "../controller/auth.controller.js";

export const authRoute = new Hono();

authRoute.post("/signin",authController.login);
authRoute.post("/signup",authController.signup);
authRoute.post("/signout",authController.signout);
