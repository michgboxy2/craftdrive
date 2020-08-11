import "dotenv/config";
import express, { Request } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { ApolloServer, gql, AuthenticationError } from "apollo-server-express";
import http from "http";
import jwt from "jsonwebtoken";

import schema from "./schema";
import resolvers from "./resolver";
import * as models from "./models";

const app = express();
app.use(cors());

const {
  MONGO_USER,
  MONGO_PASS,
  MONGO_URI,
  MONGO_PORT,
  PORT = 3000,
  SECRET,
} = process.env;

// const schema = gql`
//   type Query {
//     me: User
//   }

//   type User {
//     username: String!
//   }
// `;

// const resolvers = {
//   Query: {
//     me: () => {
//       return {
//         username: "Robin Wieruch",
//       };
//     },
//   },
// };

const start = async () => {
  if (!MONGO_USER) {
    throw new Error("mongodb username must be set");
  }

  if (!MONGO_PASS) {
    throw new Error("mongodb password must be set");
  }

  if (!MONGO_URI) {
    throw new Error("mongodb password must be set");
  }

  if (!MONGO_PORT) {
    throw new Error("mongodb port must be set");
  }

  if (!SECRET) {
    throw new Error("jwt secret required");
  }

  try {
    await mongoose.connect(
      `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_URI}:${MONGO_PORT}/craftdrive`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log("connected to MongoDb");

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
            models,
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
