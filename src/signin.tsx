import Koa from "koa";
import chalk from "chalk";
import { validateUser } from "./user";
import { createToken } from "./token";
import { setAuthCookie, setRefreshCookie } from "./cookies";
import { signature } from "./utils";

export const postSignin = async (ctx: Koa.Context) => {
  const { username, secret } = ctx.request.body;

  console.log(`postSignin, ${username}, ${secret}`);

  if (validateUser(username, secret)) {
    let accessToken = createToken({ username }, 1, false); // access token, valid for 1 min
    let refreshToken = createToken({ username }, 5, true); // refresh token, valid for 5 min

    console.log("user is valid", username, secret);

    console.log(
      chalk.yellow("access token"),
      "created",
      signature(accessToken)
    );

    console.log(
      chalk.magenta("refresh token"),
      "created",
      signature(refreshToken)
    );

    ctx.set("Authorization", `Bearer ${accessToken}`);
    setAuthCookie(ctx, accessToken);
    setRefreshCookie(ctx, refreshToken);
    ctx.body = { accessToken };
  } else {
    ctx.status = 404;
  }
};
