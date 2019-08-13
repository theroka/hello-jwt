import chalk from "chalk";
import { signature } from "../utils";
import * as types from "./types";
import { Connection } from "typeorm";
import { Token } from "./model";

export const invalidateToken = async (
  token: types.Token,
  database: Connection
): Promise<boolean> => {
  if (!token) return false;
  const repo = database.getRepository(Token);
  let t = await repo.findOne({ token });
  if (t) {
    console.log(chalk.magenta("token", signature(token), "found in database"));
    t.stale = true;
    await repo.save(t);
    console.log(
      chalk.magentaBright("token", signature(token), "marked as stale")
    );
    return true;
  } else {
    console.log(chalk.red("token not found in database"));
    return false;
  }
};
