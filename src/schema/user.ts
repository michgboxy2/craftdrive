import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    me: User
    user(email: String): User
    users: [User]
  }

  extend type Mutation {
    signUp(
      first_name: String!
      last_name: String!
      email: String!
      department: String
      password: String!
      gender: String
      created_at: String
    ): Token!

    signIn(email: String!, password: String!): Token!
    deleteUser(email: String!): Deletion!
    updateUser(first_name: String, last_name: String, email: String!): User!
  }

  type Deletion {
    status: Boolean!
  }

  type Token {
    token: String!
  }

  type User {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    department: String!
    password: String!
    created_at: String!
  }
`;
