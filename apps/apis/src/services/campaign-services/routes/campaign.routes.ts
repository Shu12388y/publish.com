import { Hono } from "hono";
import { campaignController } from "../controller/campaign.controller.js";
import {
  requireAuth,
  type AuthVariables,
} from "../../topics-services/middleware/auth.middleware.js";

export const campaignRoute = new Hono<{ Variables: AuthVariables }>();

campaignRoute.use("*", requireAuth);
campaignRoute.post("/campaigns", campaignController.create);
campaignRoute.get("/campaigns", campaignController.findAll);
campaignRoute.get("/campaigns/:campaignID", campaignController.find);
campaignRoute.patch("/campaigns/:campaignID", campaignController.update);
campaignRoute.delete("/campaigns/:campaignID", campaignController.delete);
