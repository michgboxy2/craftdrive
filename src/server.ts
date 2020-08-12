import "dotenv/config";
import express, { Request } from "express";
import cors from "cors";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import http from "http";
import jwt from "jsonwebtoken";

import schema from "./schema";
import resolvers from "./resolver";

const app = express();
app.use(cors());

const { PORT = 3000, SECRET } = process.env;

const start = async () => {
  if (!SECRET) {
    throw new Error("jwt secret required");
  }

  try {
    const getMe = async (req: Request) => {
      const token = req.headers["x-token"];

      if (token) {
        try {
          return jwt.verify(token.toString(), SECRET);
        } catch (e) {
          throw new AuthenticationError("Your session expired, sign in again");
        }
      }
    };

    const server = new ApolloServer({
      typeDefs: schema,
      resolvers,
      context: async ({ req }) => {
        if (req) {
          const me = await getMe(req);

          return {
            me,
            secret: process.env.SECRET,
          };
        }
      },
    });

    server.applyMiddleware({ app, path: "/graphql" });

    const httpServer = http.createServer(app);

    httpServer.listen(PORT, () => {
      console.log(`server started at ${PORT}`);
    });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

start();
