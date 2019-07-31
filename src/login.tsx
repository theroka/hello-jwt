import Koa from "koa";
import chalk from "chalk";
import { validateUser } from "./user";
import createToken from "./token/createToken";
import { Token } from "./token/model";
import { setAuthCookie, setRefreshCookie } from "./cookies";
import { signature } from "./utils";

export const postLogin = async (ctx: Koa.Context) => {
  const { username, secret } = ctx.request.body;
  if (validateUser(username, secret)) {

    let accessToken = createToken({ username }, 60);
    let refreshToken = createToken({ username }, 60 * 24 * 7, ctx.database);

    console.log(chalk.yellow("access token", signature(accessToken)))
    console.log(chalk.yellow("refresh token", signature(refreshToken)))

    ctx.set("Authorization", `Bearer ${accessToken}`);
    setAuthCookie(ctx, accessToken);
    setRefreshCookie(ctx, refreshToken);
    ctx.body = { accessToken };
  } else {
    console.log(chalk.red("credentials not valid"))
    ctx.status = 404;
  }
};
