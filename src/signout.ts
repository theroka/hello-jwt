import Koa from "koa";
import { invalidateToken } from "./token";

export const getSignout = async (ctx: Koa.Context) => postSignout(ctx);

export const postSignout = async (ctx: Koa.Context) => {
  const refreshToken = ctx.cookies.get("Refresh") || "";
  invalidateToken(refreshToken);
  console.log("refresh token invalidated", refreshToken.split(".")[2]);
  ctx.cookies.set("Authorization", undefined, {
    secure: false,
    httpOnly: true
  });
  ctx.cookies.set("Refresh", undefined, { secure: false, httpOnly: true });
  ctx.body = "Singned out.";
  ctx.redirect("/");
};
