import jwt from "jsonwebtoken";
import { combineResolvers } from "graphql-resolvers";
import { AuthenticationError, UserInputError } from "apollo-server";
import { isAuthenticated } from "./authorization";

import { UserDoc } from "../models/userModel";
import { AuthDoc } from "../models/auth";
import { models } from "mongoose";
import { fetchData, write, User, mutateFile } from "../services/dataset";
import { Password } from "../services/password";

interface contextAttr {
  User: UserDoc;
  Auth: AuthDoc;
  me: any;
  secret: string;
}

interface UsersInterface {}

interface UserInterface {
  email: string;
}

const createToken = async (user: User, secret: string, expiresIn: string) => {
  const { email } = user;
  return jwt.sign({ email }, secret, { expiresIn });
};

export default {
  Query: {
    users: combineResolvers(
      isAuthenticated,
      async (parent: any, args: object) => {
        try {
          let users = await fetchData();
          if (!users) {
            return null;
          }

          return users;
        } catch (e) {
          throw new Error(e);
        }
      }
    ),

    user: combineResolvers(
      isAuthenticated,
      async (parent: any, args: UserInterface) => {
        try {
          const { email } = args;
          let users = await fetchData();

          let result = users.find((user) => user.email === email);
          console.log(result);
          return result;
        } catch (e) {
          throw new Error(e);
        }
      }
    ),

    me: combineResolvers(
      isAuthenticated,
      async (parent: any, args: UsersInterface, context: any) => {
        const { me } = context;
        const { email } = me;

        let users = await fetchData();

        let result = users.find((user) => user.email === email);

        return result;
      }
    ),
  },

  Mutation: {
    signUp: async (parent: any, args: User, context: contextAttr) => {
      try {
        const {
          first_name,
          last_name,
          email,
          password,
          created_at,
          department,
          gender,
        } = args;

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
    signIn: async (parent: any, args: any, context: contextAttr) => {
      const { email, password } = args;

      const { secret } = context;

      let users = await fetchData();

      let result = users.find((user) => user.email === email);

      if (!result) {
        throw new UserInputError("incorrect credentials");
      }

      return { token: createToken(result, secret, "30m") };
    },

    deleteUser: combineResolvers(
      isAuthenticated,
      async (parent: any, args: any) => {
        let users = await fetchData();
        const { email } = args;

        let user = users.filter((user) => user.email !== email);

        await mutateFile(user);

        if (users.length > user.length) {
          return { status: true };
        } else {
          return { status: false };
        }
      }
    ),

    updateUser: combineResolvers(
      isAuthenticated,
      async (parent: any, args: User) => {
        let users = await fetchData();
        const { email, first_name, last_name } = args;

        let response = users.find((user) => user.email === email);

        if (!response) {
          throw new UserInputError("employee not found");
        }

        email ? (response.email = email) : null;
        first_name ? (response.first_name = first_name) : null;
        last_name ? (response.last_name = last_name) : null;

        await mutateFile(users);

        return response;
      }
    ),
  },
};
