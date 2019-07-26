import Koa from "koa";
import Router from "koa-router";
import Body from "koa-bodyparser";
import Send from "koa-send";
import React from "react";

import { postSignin } from "./signin";
import { postSignout, getSignout } from "./signout";
import { getTokens, validateToken } from "./token";
import { getUsers } from "./user";

import { renderToString } from "react-dom/server";
import { renderFullPage } from "./page";

import PublicApp from "./public/App";
import ProtectedApp from "./protected/App";

const app = new Koa();
const router = new Router();

app.use(Body());

app.use(async (ctx: Koa.Context, next) => {
  await next();
  const body = JSON.stringify(ctx.request.body);
  console.log(`${ctx.method} ${ctx.url} - ${body}`);
});

const hasValidToken = async (
  ctx: Koa.BaseContext,
  next: () => Promise<any>
) => {
  const token = ctx.get("Authorization") || ctx.cookies.get("Authorization");
  if (validateToken(token)) {
    await next();
  } else {
    ctx.status = 404;
    ctx.body = "Not authorized.";
  }
};

const getIndex = async (ctx: Koa.Context) => {
  const token = ctx.get("Authorization") || ctx.cookies.get("Authorization");
  const isValid = validateToken(token);
  const assetRoot = isValid ? "/protected" : "/public";
  let jsx = renderToString(<PublicApp />);
  if (isValid) jsx = renderToString(<ProtectedApp />);
  ctx.body = renderFullPage("hello-jwt", jsx, assetRoot);
};

// @see: https://github.com/ZijianHe/koa-router/issues/446
router.get("/public/(.*).(js|css)", async ctx => {
  try {
    return Send(ctx, ctx.path, { root: __dirname });
  } catch (err) {}
});

// @see: https://github.com/ZijianHe/koa-router/issues/446
router.get("/protected/(.*).(js|css)", hasValidToken, async ctx => {
  try {
    return Send(ctx, ctx.path, { root: __dirname });
  } catch (err) {}
});

router
  .get("/", getIndex)
  .post("/signin", postSignin)
  .get("/signout", getSignout)
  .post("/signout", postSignout)
  // for development only
  .get("/debug/tokens", getTokens)
  .get("/debug/users", getUsers);

app.use(router.routes());
app.listen(8080);
