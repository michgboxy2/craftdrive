export interface contextAttr {
  me: { email: string; iat: number; exp: number };
  secret: string;
}

export interface UsersInterface {}

export interface UserInterface {
  email: string;
}

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export type LoginReq = {
  email: string;
  password: string;
};

export type TokenType = {
  token: string;
};
