import jwt from "jsonwebtoken";
import chalk from "chalk";
import { signature } from "../utils";
import { JWT_SECRET } from "./defaults";
import { Connection } from "typeorm";
import { Token } from "./model";

// array of refresh tokens to work as cache/database (temporary solution)
let tokens: Array<[string, number | Date, boolean]> = [];

export const validateAccessToken = (token: string): Promise<boolean> => {
  return new Promise(resolve => {
    console.log(chalk.gray("validate access token", signature(token)));

    jwt.verify(token, JWT_SECRET, err => {
      if (err) resolve(false);
      console.log(chalk.green("access token", signature(token), "valid"));
      resolve(true);
    });
  });
};

export const validateRefreshToken = async (
  token: string,
  database: Connection
): Promise<any> => {
  return new Promise(async resolve => {
    console.log(chalk.gray("validate refresh token", signature(token)));

    jwt.verify(token, JWT_SECRET, async err => {
      if (err) resolve(false);

      let t = await database
        .getRepository(Token)
        .findOne({ token, stale: false });

      if (t) {
        console.log(
          chalk.magenta("token", signature(token), "found in database")
        );
        console.log(chalk.green("refresh token", signature(token), "valid"));
        resolve(true);
      } else {
        console.log(chalk.red("refresh token", signature(token), "invalid"));
        resolve(false);
      }
    });
  });
};
