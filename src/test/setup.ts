import { signIn, signUp, deleteUser } from "./api";
import { fetchData } from "../services/dataset";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string>;
      signup(): Promise<string>;
      getToken(): Promise<string>;
    }
  }
}

beforeEach(async () => {});

afterEach(async () => {
  let token = await global.getToken();
  await deleteUser({ email: "testUser@gmail.com" }, token);
});

global.getToken = async () => {
  const users = await fetchData();
  let checkIfExists = users.find((user) => user.email === "michy@gmail.com");

  if (checkIfExists) {
    let token = await global.signin();
    return token;
  } else {
    let token = await global.signup();
    return token;
  }
};

global.signin = async () => {
  const {
    data: {
      data: {
        signIn: { token },
      },
    },
  } = await signIn({
    email: "michy@gmail.com",
    password: "password",
  });

  return token;
};

global.signup = async () => {
  const {
    data: {
      data: {
        signUp: { token },
      },
    },
  } = await signUp({
    first_name: "michy",
    last_name: "king",
    email: "testUser@gmail.com",
    password: "password",
  });

  return token;
};
