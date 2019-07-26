import Koa from "koa";
import jwt from "jsonwebtoken";

const jwtSecret = "jwtsecret";
// tokens array to work as cache/database (temporary solution)
let tokens: Array<string> = [];

interface ITokenData {
  [key: string]: string | number;
}

type TToken = string | null | undefined;

const expiration = (seconds: number): number => {
  return Math.floor(Date.now() / 1000) + seconds;
};

export const createToken = (data: ITokenData) => {
  let token = jwt.sign(
    {
      exp: expiration(60 * 60), // 1 hour
      ...data
    },
    jwtSecret
  );
  tokens.push(token);
  return token;
};

export const validateToken = (token: TToken): boolean => {
  if (!token) return false;
  const isValid = !!jwt.verify(token, jwtSecret);
  return isValid && tokens.includes(token);
};

export const deleteToken = (token: TToken): boolean => {
  if (!token) return false;
  tokens = tokens.filter(t => t != token);
  return true;
};

// only for development -- don't do this in real production
export const getTokens = async (ctx: Koa.Context) => {
  ctx.body = JSON.stringify(Array.from(tokens), null, 4);
};
