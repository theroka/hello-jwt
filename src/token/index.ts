import Koa from "koa";
import jwt from "jsonwebtoken";
import chalk from "chalk";
import { signature } from "../utils";
import * as types from "./types";
import { JWT_SECRET } from "./defaults";

// array of refresh tokens to work as cache/database (temporary solution)
let tokens: Array<[string, number | Date, boolean]> = [];

export const createToken = (
  data: types.TokenData,
  lifetimeMinutes: number = 15,
  isRefreshToken: boolean = false
) => {
  let exp: number = Math.floor(Date.now() / 1000) + 60 * lifetimeMinutes;
  let token = jwt.sign(
    {
      exp, // 15 minutes
      ...data
    },
    JWT_SECRET
  );
  if (isRefreshToken) tokens.push([token, exp, true]);
  return token;
};

export const validateAccessToken = (token: string): Promise<boolean> => {
  return new Promise(resolve => {
    jwt.verify(token, JWT_SECRET, err => {
      if (err) resolve(false);
      resolve(true);
    });
  });
};

export const validateRefreshToken = async (token: string): Promise<boolean> => {
  return new Promise(async resolve => {
    jwt.verify(token, JWT_SECRET, err => {
      if (err) resolve(false);
      let isKnown = tokens.some(t => t[0] === token && t[2] === true);

      console.log(
        chalk.magenta("refresh token"),
        "known:",
        isKnown ? chalk.green(`${isKnown}`) : chalk.red(`${isKnown}`),
        signature(token)
      );

      if (isKnown) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export const invalidateToken = (token: types.Token): boolean => {
  if (!token) return false;
  tokens.forEach((t, i) => {
    t[0] === token ? (tokens[i][2] = false) : null;
  });
  return true;
};

export const deleteToken = (token: types.Token): boolean => {
  if (!token) return false;
  tokens = tokens.filter(t => t[0] != token);
  return true;
};

// only for development -- don't do this in real production
export const getTokens = async (ctx: Koa.Context) => {
  ctx.body = JSON.stringify(Array.from(tokens), null, 4);
};
