import {getCookie} from "hono/cookie";
import type {MiddlewareHandler} from "hono";
import {
  verifyAuthToken,
  type AuthTokenPayload,
} from "../../../utils/auth.utils.js";

export type AuthVariables = {
  auth: AuthTokenPayload;
};

export const requireAuth: MiddlewareHandler<{
  Variables: AuthVariables;
}> = async (c, next) => {
  const token = getCookie(c, "session");
  if (!token) {
    return c.json({message: "Authentication required"}, 401);
  }

  try {
    c.set("auth", verifyAuthToken(token));
    await next();
  } catch (error) {
    console.error("Authentication failed", error);
    return c.json({message: "Invalid or expired authentication token"}, 401);
  }
};
