import { ForbiddenError } from "apollo-server";
import { combineResolvers, skip } from "graphql-resolvers";
import { contextAttr } from "../services/types";

export const isAuthenticated = (parent: any, args: any, context: any) => {
  const { me } = context;
  return me ? skip : new ForbiddenError("Not authenticated as user");
};

export const checkIfLoggedIn = (me: contextAttr["me"]) => {
  if (!me) {
    throw new ForbiddenError("Not authenticated as user");
  }
};
