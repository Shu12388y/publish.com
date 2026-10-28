import {Hono} from "hono";
import {subscriberController} from "../controller/subscriber.controller.js";
import {
  requireAuth,
  type AuthVariables,
} from "../../topics-services/middleware/auth.middleware.js";

export const subscriberRoute = new Hono<{Variables: AuthVariables}>();

subscriberRoute.post("/subscribers/webhook", subscriberController.webhook);
subscriberRoute.use("*", requireAuth);
subscriberRoute.post("/subscribers", subscriberController.create);
subscriberRoute.post("/subscribers/csv", subscriberController.uploadCsv);
