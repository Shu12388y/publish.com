import { client } from "../../../config/inngest/inngest.config.js";
import type { Context } from "hono";
export class EmailController {
  static async publish(c: Context) {
    try {
      const { topic } = await c.req.json();
      if (!topic) {
        c.status(403);
        return c.json({
          message: "TOPIC is required",
        });
      }
      await client.send({
        name: "",
        data: {
          topic,
        },
      });
      c.status(201);
      return c.json({ message: "success" });
    } catch (error) {
      console.error(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }
}
