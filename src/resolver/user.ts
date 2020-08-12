import jwt from "jsonwebtoken";
import { UserInputError } from "apollo-server";
import { checkIfLoggedIn } from "./authorization";
import { fetchData, write, mutateFile } from "../services/dataset";
import { Password } from "../services/password";
import {
  contextAttr,
  UserInterface,
  UsersInterface,
  User,
} from "../services/types";

const createToken = async (user: User, secret: string, expiresIn: string) => {
  const { email } = user;
  return jwt.sign({ email }, secret, { expiresIn });
};

export default {
  Query: {
    users: async (parent: any, args: UserInterface, context: contextAttr) => {
      try {
        const { me } = context;
        checkIfLoggedIn(me);

        let users = await fetchData();
        if (!users) {
          return null;
        }

        return users;
      } catch (e) {
        throw new Error(e);
      }
    },

    user: async (parent: any, args: UserInterface, context: contextAttr) => {
      try {
        const { me } = context;
        checkIfLoggedIn(me);
        const { email } = args;
        let users = await fetchData();

        let result = users.find((user) => user.email === email);
        return result;
      } catch (e) {
        throw new Error(e);
      }
    },

    me: async (parent: any, args: UsersInterface, context: contextAttr) => {
      const { me } = context;

      checkIfLoggedIn(me);

      const { email } = me;

      let users = await fetchData();

      let result = users.find((user) => user.email === email);

      return result;
    },
  },

  Mutation: {
    signUp: async (parent: any, args: User, context: contextAttr) => {
      try {
        const { first_name, last_name, email, password } = args;

        let employeeList = await fetchData();

        let checkIfExists = employeeList.find((user) => user.email === email);

        if (checkIfExists) {
          throw new UserInputError("Email already exists");
        }

        const { secret } = context;

        const hashed = await Password.toHash(password);
        args.password = hashed;

        await write(args);

        return { token: createToken(args, secret, "30m") };
      } catch (e) {
        throw new Error(e);
      }
    },
    signIn: async (parent: any, args: User, context: contextAttr) => {
      const { email, password } = args;

      const { secret } = context;

      let users = await fetchData();

      let result = users.find((user) => user.email === email);

      if (!result) {
        throw new UserInputError("incorrect credentials");
      }

      const passwordMatch = await Password.compare(result.password, password);

      if (!passwordMatch) {
        throw new UserInputError("incorrect credentials");
      }

      return { token: createToken(result, secret, "30m") };
    },

    deleteUser: async (parent: any, args: any, context: contextAttr) => {
      const { me } = context;

      checkIfLoggedIn(me);

      let users = await fetchData();
      const { email } = args;

      let user = users.filter((user) => user.email !== email);

      await mutateFile(user);

      if (users.length > user.length) {
        return { status: true };
      } else {
        return { status: false };
      }
    },

    updateUser: async (parent: any, args: User, context: contextAttr) => {
      const { me } = context;
      checkIfLoggedIn(me);

      let users = await fetchData();
      const { email, first_name, last_name } = args;

      let response = users.find((user) => user.email === me.email);

      if (!response) {
        throw new UserInputError("employee not found");
      }

      email ? (response.email = email) : null;
      first_name ? (response.first_name = first_name) : null;
      last_name ? (response.last_name = last_name) : null;

      await mutateFile(users);

      return response;
    },
  },
};
