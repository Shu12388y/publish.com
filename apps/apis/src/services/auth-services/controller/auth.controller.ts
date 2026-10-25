import type { Context } from "hono";
export class AuthController {
  static login(c: Context) {
    try {
      c.status(200);
      return c.json({ message: "success" });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }
  static signup(c: Context) {
    try {
      c.status(200);
      return c.json({ message: "success" });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }
  static signout(c: Context) {
    try {
      c.status(200);
      return c.json({ message: "success" });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }
}
