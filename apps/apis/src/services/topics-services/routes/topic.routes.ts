import {Hono} from "hono";
import {topicController} from "../controller/topic.controller.js";
import {
  requireAuth,
  type AuthVariables,
} from "../middleware/auth.middleware.js";

export const topicRoute = new Hono<{Variables: AuthVariables}>();

topicRoute.use("*", requireAuth);
topicRoute.post("/topics", topicController.create);
topicRoute.get("/topics", topicController.findAll);
topicRoute.get("/topics/:topicID", topicController.find);
topicRoute.patch("/topics/:topicID", topicController.update);
topicRoute.delete("/topics/:topicID", topicController.delete);