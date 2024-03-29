import Koa from "koa";

type Context = Koa.BaseContext | Koa.Context

export const AUTH_HEADER_NAME = "Authorization"
export const AUTH_COOKIE_NAME = "Authorization"
export const REFRESH_COOKIE_NAME = "Refresh"

export const setAuthCookie = (ctx: Context, token: string): Context => {
  let maxAge = 1000 * 60 * 60 * 24 * 7
  let opts = { secure: false, httpOnly: false, maxAge }
  ctx.cookies.set(AUTH_COOKIE_NAME, token, opts);
  return ctx
}

export const setRefreshCookie = (ctx: Context, token: string): Context => {
  let maxAge = 1000 * 60 * 60 * 24 * 7
  let opts = { secure: false, httpOnly: false, maxAge }
  ctx.cookies.set(REFRESH_COOKIE_NAME, token, opts);
  return ctx
}

export const dropCookie = (ctx: Context, name: string): Context => {
  ctx.cookies.set(name, undefined, { maxAge: 0 });
  return ctx
}
