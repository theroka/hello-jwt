import Koa from "koa";

// user array to work as database (temporary solution)
const users = [
  { username: "robin", secret: "nibor" },
  { username: "flo", secret: "olf" },
  { username: "thomas", secret: "samoht" }
];

export const validateUser = (username: string, secret: string): boolean => {
  return users.some(u => u.username === username && u.secret === secret);
};

// only for development -- don't do this in real production
export const getUsers = async (ctx: Koa.Context) => {
  ctx.body = JSON.stringify(users, null, 4);
};
