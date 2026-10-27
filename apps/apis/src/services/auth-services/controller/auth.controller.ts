import type {Context} from "hono";
import {deleteCookie, setCookie} from "hono/cookie";
import {v7 as uuidv7} from "uuid";
import type {AuthRepository} from "../repo/auth.repo.js";
import {AuthRepository as DefaultAuthRepository} from "../repo/auth.repo.js";
import {authUtils as defaultAuthUtils} from "../../../utils/auth.utils.js";
import {
  isCredentials,
  isDuplicateKeyError,
  isSignupInput,
  publicUser,
  type AuthUtils,
} from "../helper/auth.helper.js";

export class AuthController {
  constructor(
    private readonly repository: AuthRepository,
    private readonly authUtils: AuthUtils,
  ) {}

  login = async (c: Context) => {
    try {
      const body: unknown = await c.req.json();
      if (!isCredentials(body) || !body.email.trim() || !body.password) {
        return c.json({message: "Email and password are required"}, 400);
      }

      const email = body.email.trim().toLowerCase();
      const user = await this.repository.findByEmail(email);
      if (!user || !(await this.authUtils.comparePassword(body.password, user.password))) {
        return c.json({message: "Invalid email or password"}, 401);
      }

      const token = this.authUtils.createAuthToken({
        sub: String(user._id),
        organizationID: user.organizationID,
      });
      setCookie(c, "session", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return c.json({
        message: "Signed in successfully",
        user: publicUser(user),
      });
    } catch (error) {
      console.error("Login failed", error);
      return c.json({message: "Internal Server Error"}, 500);
    }
  };

  signup = async (c: Context) => {
    try {
      const body: unknown = await c.req.json();
      if (
        !isSignupInput(body) ||
        !body.email.trim() ||
        !body.password ||
        !body.fullname.trim() ||
        !body.organization.trim()
      ) {
        return c.json(
          {message: "Email, password, fullname, and organization are required"},
          400,
        );
      }

      if (body.password.length < 8) {
        return c.json(
          {message: "Password must be at least 8 characters long"},
          400,
        );
      }

      const email = body.email.trim().toLowerCase();
      const organization = body.organization.trim();
      const existingUser = await this.repository.findByEmailOrOrganization(
        email,
        organization,
      );
      if (existingUser) {
        return c.json(
          {message: "Email or organization is already registered"},
          409,
        );
      }

      const user = await this.repository.createUser({
        email,
        password: await this.authUtils.hashPassword(body.password),
        fullname: body.fullname.trim(),
        organization,
        organizationID: uuidv7(),
      });

      return c.json(
        {
          message: "Account created successfully",
          user: publicUser(user),
        },
        201,
      );
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        return c.json(
          {message: "Email or organization is already registered"},
          409,
        );
      }
      console.error("Signup failed", error);
      return c.json({message: "Internal Server Error"}, 500);
    }
  };

  signout = (c: Context) => {
    deleteCookie(c, "session", {path: "/"});
    return c.json({message: "Signed out successfully"});
  };
}

export const authController = new AuthController(
  new DefaultAuthRepository(),
  defaultAuthUtils,
);
