import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const BCRYPT_ROUNDS = 12;
const TOKEN_EXPIRY = "7d";

export type AuthTokenPayload = {
  sub: string;
  organizationID: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, getJwtSecret(), {expiresIn: TOKEN_EXPIRY});
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const payload = jwt.verify(token, getJwtSecret());
  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.sub !== "string" ||
    typeof payload.organizationID !== "string"
  ) {
    throw new Error("Invalid authentication token payload");
  }
  return {
    sub: payload.sub,
    organizationID: payload.organizationID,
  };
}

export const authUtils = {
  hashPassword,
  comparePassword,
  createAuthToken,
  verifyAuthToken,
};
