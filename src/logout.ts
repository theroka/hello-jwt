import Koa from "koa";
import chalk from "chalk";
import { invalidateToken } from "./token";
import { dropCookie, AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from "./cookies";
import { signature } from "./utils";

export const getLogout = async (ctx: Koa.Context) => {
  const refreshToken = ctx.cookies.get("Refresh") || "";
  console.log(chalk.red("invalidate token", signature(refreshToken)))
  await invalidateToken(refreshToken, ctx.database);
  dropCookie(ctx, AUTH_COOKIE_NAME)
  dropCookie(ctx, REFRESH_COOKIE_NAME)
  ctx.body = "Logout.";
  ctx.redirect("/");
};

export const postLogout = async (ctx: Koa.Context) => {
  const refreshToken = ctx.cookies.get("Refresh") || "";
  console.log(chalk.red("invalidate token", signature(refreshToken)))
  await invalidateToken(refreshToken, ctx.database);
  dropCookie(ctx, AUTH_COOKIE_NAME)
  dropCookie(ctx, REFRESH_COOKIE_NAME)
  ctx.body = "Logout.";
  ctx.redirect("/");
};
