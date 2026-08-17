import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { SignOptions } from "jsonwebtoken";

export interface AccessTokenPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn as SignOptions["expiresIn"],
  });
};

export const verifyRefreshToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.jwtRefreshSecret) as AccessTokenPayload;
};

export const generateRefreshTokenExpirationDate = (): Date => {
  const expirationMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  return new Date(Date.now() + expirationMs);
};