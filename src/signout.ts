import Koa from "koa";
import { deleteToken } from "./token";

export const getSignout = async (ctx: Koa.Context) => postSignout(ctx)

export const postSignout = async (ctx: Koa.Context) => {
  const token = ctx.get("Authorization") || ctx.cookies.get("Authorization");
  deleteToken(token);
  ctx.cookies.set("Authorization", undefined, { secure: false, httpOnly: true });
  ctx.body = "Singned out.";
  ctx.redirect("/")
};
