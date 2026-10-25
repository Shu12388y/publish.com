import {Hono} from "hono";
import {AuthController} from "../controller/auth.controller.js";

export const authRoute = new Hono();

authRoute.post("/signin",AuthController.login);
authRoute.post("/signup",AuthController.signup);
authRoute.post("/signup",AuthController.signout);
