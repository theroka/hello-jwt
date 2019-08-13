import jwt from "jsonwebtoken";
import chalk from "chalk";
import { signature } from "../utils";
import * as types from "./types";
import { Token } from "./model";
import { JWT_SECRET } from "./defaults";
import { Connection } from "typeorm";

/**
 * Create and sign a new JWT token.
 */
export const createToken = (
  data: types.TokenData,
  minutes: number,
  database?: Connection
): string => {
  let exp = Math.floor(Date.now() / 1000) + 60 * minutes;
  let hash = jwt.sign({ ...data, exp }, JWT_SECRET);

  console.log(chalk.blue("new token created", signature(hash)));

  if (database) {
    let token = new Token();
    token.token = hash;
    token.stale = false;
    database.getRepository(Token).save(token);
    console.log(chalk.magenta("token", signature(hash), "written to database"));
  }

  return hash;
};

export default createToken;
