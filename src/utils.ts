import { addSeconds } from "date-fns";

export const signature = (token: string): string => token.split(".")[2];
