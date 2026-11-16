import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRoute } from "./services/auth-services/routes/auth.routes.js";
import { topicRoute } from "./services/topics-services/routes/topic.routes.js";
import { subscriberRoute } from "./services/subscriber-services/routes/subscriber.routes.js";
import { domainRoute } from "./services/domain-services/routes/domain.routes.js";
import { campaignRoute } from "./services/campaign-services/routes/campaign.routes.js";
import { webhookRoute } from "./services/webhook-services/routes/webhook.routes.js";
import { serve as InngestServe } from "inngest/hono";
import { client, functions } from "./config/inngest/inngest.config.js";
import { connectionDB } from "@publish.com/database/db";
import { ENV } from "./env/env.js";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  cors({
    origin: process.env.ADMIN_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.route("/api/v1", authRoute);
app.route("/api/v1", topicRoute);
app.route("/api/v1", subscriberRoute);
app.route("/api/v1", domainRoute);
app.route("/api/v1", campaignRoute);
app.route("/api/v1", webhookRoute);
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.on(
  ["GET", "PUT", "POST"],
  "/api/inngest",
  InngestServe({
    client: client,
    functions,
  }),
);

connectionDB(ENV.DB_URI)
  .then(() => {
    serve(
      {
        fetch: app.fetch,
        port: 3000,
      },
      (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
      },
    );
  })
  .catch((e) => {
    console.log(e);
  });
