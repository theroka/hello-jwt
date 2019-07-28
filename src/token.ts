import Koa from "koa";
import jwt from "jsonwebtoken";
import chalk from "chalk";
import {
  setAuthCookie,
  AUTH_HEADER_NAME,
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME
} from "./cookies";
import { signature } from "./utils";

const jwtSecret = "jwtsecret";
// array of refresh tokens to work as cache/database (temporary solution)
let tokens: Array<[string, number | Date, boolean]> = [];

interface ITokenData {
  [key: string]: string | number;
}

type TToken = string | null | undefined;

export const createToken = (
  data: ITokenData,
  lifetimeMinutes: number = 15,
  isRefreshToken: boolean = false
) => {
  let exp: number = Math.floor(Date.now() / 1000) + (60 * lifetimeMinutes);
  let token = jwt.sign(
    {
      exp, // 15 minutes
      ...data
    },
    jwtSecret
  );
  if (isRefreshToken) tokens.push([token, exp, true]);
  return token;
};

export const validateAccessToken = (token: string): Promise<boolean> => {
  return new Promise(resolve => {
    jwt.verify(token, jwtSecret, err => {
      if (err) resolve(false);
      resolve(true);
    });
  });
};

export const validateRefreshToken = async (token: string): Promise<boolean> => {
  return new Promise(async resolve => {
    jwt.verify(token, jwtSecret, err => {
      if (err) resolve(false);
      let isKnown = tokens.some(t => t[0] === token && t[2] === true);

      console.log(
        chalk.magenta("refresh token"),
        "known:",
        isKnown ? chalk.green(`${isKnown}`) : chalk.red(`${isKnown}`),
        signature(token)
      );

      if (isKnown) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export const invalidateToken = (token: TToken): boolean => {
  if (!token) return false;
  tokens.forEach((t, i) => {
    t[0] === token ? (tokens[i][2] = false) : null;
  });
  return true;
};

export const deleteToken = (token: TToken): boolean => {
  if (!token) return false;
  tokens = tokens.filter(t => t[0] != token);
  return true;
};

// only for development -- don't do this in real production
export const getTokens = async (ctx: Koa.Context) => {
  ctx.body = JSON.stringify(Array.from(tokens), null, 4);
};

// Koa middleware to validate access and refresh tokens of client-side request
// with tokens passed in Authorization header and secure cookie
export const hasValidToken = async (
  ctx: Koa.BaseContext,
  next: () => Promise<any>
) => {
  const accessToken =
    ctx.get(AUTH_HEADER_NAME) || ctx.cookies.get(AUTH_COOKIE_NAME) || "";
  const refreshToken = ctx.cookies.get(REFRESH_COOKIE_NAME) || "";

  const accessTokenValid = await validateAccessToken(accessToken);
  const refreshTokenValid = await validateRefreshToken(refreshToken);

  console.log(
    chalk.yellow("access token"),
    "valid:",
    accessTokenValid
      ? chalk.green(`${accessTokenValid}`)
      : chalk.red(`${accessTokenValid}`),
    signature(accessToken)
  );

  console.log(
    chalk.magenta("refresh token"),
    "valid:",
    refreshTokenValid
      ? chalk.green(`${refreshTokenValid}`)
      : chalk.red(`${refreshTokenValid}`),
    signature(refreshToken)
  );

  if (accessTokenValid) {
    await next();
    return;
  }

  if (accessTokenValid === false && refreshTokenValid) {
    let newAccessToken = createToken({ foo: "bar" }, 1, false);
    ctx.set(AUTH_HEADER_NAME, `Bearer ${newAccessToken}`);
    setAuthCookie(ctx, newAccessToken);
    console.log(chalk.yellow("access token"), "created", signature(newAccessToken));
    await next();
    return;
  }

  ctx.status = 404;
  ctx.body = "Not authorized.";
};
