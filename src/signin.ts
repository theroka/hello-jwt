import Koa from "koa";
import { validateUser } from "./user";
import { createToken } from "./token";

export const postSignin = async (ctx: Koa.Context) => {
  const { username, secret } = ctx.request.body;

  console.log(`postSignin, ${username}, ${secret}`);

  if (validateUser(username, secret)) {
    let token = createToken({ foo: "bar" });
    ctx.set("Authorization", token);
    ctx.cookies.set("Authorization", token, { secure: false, httpOnly: true });
    ctx.status = 200;
    return;
  } else {
    ctx.cookies.set("Authorization", undefined, { secure: false, httpOnly: true });
    ctx.status = 404;
    return;
  }
};
