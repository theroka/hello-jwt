export interface TokenData {
  [key: string]: string | number | boolean | TokenData | Array<string | number | boolean | TokenData>;
}

export type Token = string | null | undefined;
