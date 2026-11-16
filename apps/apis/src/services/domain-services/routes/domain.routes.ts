import { Hono } from "hono";
import { domainController } from "../controller/domain.controller.js";
import {
  requireAuth,
  type AuthVariables,
} from "../../topics-services/middleware/auth.middleware.js";

export const domainRoute = new Hono<{ Variables: AuthVariables }>();

domainRoute.use("*", requireAuth);
domainRoute.get("/domains", domainController.findAll);
domainRoute.post("/domains", domainController.create);
domainRoute.post("/domains/:domainID/verify", domainController.verify);
