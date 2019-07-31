import Koa from "koa";
import chalk from "chalk";
import { signature } from "../utils";
import {
  setAuthCookie,
  AUTH_HEADER_NAME,
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME
} from "../cookies";
import { createToken, validateAccessToken, validateRefreshToken } from "./index"

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
    console.log(
      chalk.yellow("access token"),
      "created",
      signature(newAccessToken)
    );
    await next();
    return;
  }

  ctx.status = 404;
  ctx.body = "Not authorized.";
};
