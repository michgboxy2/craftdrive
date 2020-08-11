export interface contextAttr {
  me: { email: string; iat: number; exp: number };
  secret: string;
}

export interface UsersInterface {}

export interface UserInterface {
  email: string;
}
