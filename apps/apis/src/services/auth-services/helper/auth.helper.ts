import type { AuthTokenPayload } from "../../../utils/auth.utils.js";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string(),
});

const signupSchema = credentialsSchema.extend({
  fullname: z.string().trim().min(1),
  organization: z.string().trim().min(1),
});

export type Credentials = z.infer<typeof credentialsSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

export type AuthUtils = {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  createAuthToken(payload: AuthTokenPayload): string;
};

export function isCredentials(value: unknown): value is Credentials {
  return credentialsSchema.safeParse(value).success;
}

export function isSignupInput(value: unknown): value is SignupInput {
  return signupSchema.safeParse(value).success;
}

export function publicUser(user: {
  _id: unknown;
  email: string;
  fullname: string;
  organization: string;
  organizationID: string;
}) {
  return {
    id: String(user._id),
    email: user.email,
    fullname: user.fullname,
    organization: user.organization,
    organizationID: user.organizationID,
  };
}

export function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}
