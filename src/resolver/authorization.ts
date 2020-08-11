import { ForbiddenError } from "apollo-server";
import { combineResolvers, skip } from "graphql-resolvers";

export const isAuthenticated = (parent: any, args: any, context: any) => {
  const { me } = context;
  return me ? skip : new ForbiddenError("Not authenticated as user");
};
