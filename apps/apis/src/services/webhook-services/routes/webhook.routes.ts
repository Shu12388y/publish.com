import {Hono} from "hono";
import {webhookController} from "../controller/webhook.controller.js";
import {
  requireAuth,
  type AuthVariables,
} from "../../topics-services/middleware/auth.middleware.js";

export const webhookRoute = new Hono<{Variables: AuthVariables}>();

webhookRoute.use("*", requireAuth);
webhookRoute.post("/webhooks", webhookController.create);
webhookRoute.get("/webhooks", webhookController.findAll);
webhookRoute.get("/webhooks/:webhookID", webhookController.find);
webhookRoute.patch("/webhooks/:webhookID", webhookController.update);
webhookRoute.delete("/webhooks/:webhookID", webhookController.delete);
