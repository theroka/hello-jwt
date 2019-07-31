import Koa from "koa";
import Router from "koa-router";
import Body from "koa-bodyparser";
import Send from "koa-send";

import { hasValidToken } from "./token/middleware";
import { getIndex, getApp } from "./page";
import { postLogin } from "./login";
import { getLogout, postLogout } from "./logout";
import { getUsers } from "./user";

import { createConnection } from "typeorm";
import { Token } from "./token/model";

createConnection({
  type: "sqlite",
  database: __dirname + "/Database.sqlite",
  entities: [Token],
  synchronize: true
})
  .then(async database => {

    const app = new Koa();
    const router = new Router();

    app.context.database = database;

    app.use(Body());

    app.use(async (ctx: Koa.Context, next) => {
      await next();
      const body = JSON.stringify(ctx.request.body);
      console.log(`${ctx.method} ${ctx.url} - ${body}`);
    });

    // @see: https://github.com/ZijianHe/koa-router/issues/446
    router.get("/static/(.*).(js|css)", async ctx => {
      try {
        return Send(ctx, ctx.path, { root: __dirname });
      } catch (err) {}
    });

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
      .get("/app", hasValidToken, getApp)
      .get("/signin", postLogin)
      .post("/signin", postLogin)
      .get("/signout", getLogout)
      .post("/signout", postLogout)
      // for development only
      .get("/debug/users", getUsers);

    app.use(router.routes());
    app.listen(8080);
  })
  .catch(err => console.log(err));
