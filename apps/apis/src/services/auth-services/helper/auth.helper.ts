import type {AuthTokenPayload} from "../../../utils/auth.utils.js";

export type Credentials = {
  email: string;
  password: string;
};

export type SignupInput = Credentials & {
  fullname: string;
  organization: string;
};

export type AuthUtils = {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  createAuthToken(payload: AuthTokenPayload): string;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isCredentials(value: unknown): value is Credentials {
  return (
    isRecord(value) &&
    typeof value.email === "string" &&
    typeof value.password === "string"
  );
}

export function isSignupInput(value: unknown): value is SignupInput {
  return (
    isRecord(value) &&
    typeof value.email === "string" &&
    typeof value.password === "string" &&
    typeof value.fullname === "string" &&
    typeof value.organization === "string"
  );
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
  return isRecord(error) && error.code === 11000;
}
