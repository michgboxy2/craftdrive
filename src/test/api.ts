import axios from "axios";
import { contextAttr, User, LoginReq, TokenType } from "../services/types";

const API_URL = "http://localhost:3000/graphql";

type emailType = {
  email: string;
};

type updateType = {
  email: string;
  first_name: string;
};

export const user = async (variables: emailType, token: string) => {
  return await axios.post(
    API_URL,
    {
      query: `
        query($email: String){
            user(email: $email){
                first_name
                last_name
                email
            }
        }`,
      variables,
    },
    {
      headers: {
        "x-token": token,
      },
    }
  );
};

export const users = async (token: string) => {
  return await axios.post(
    API_URL,
    {
      query: `
        query{
            users{
                first_name
            }
        }`,
    },
    {
      headers: {
        "x-token": token,
      },
    }
  );
};

export const me = async (token: string) =>
  await axios.post(
    API_URL,
    {
      query: `
           query{
               me{
                first_name
                last_name
                email  
               }
           }`,
    },
    {
      headers: {
        "x-token": token,
      },
    }
  );

export const signUp = async (variables: User) =>
  axios.post(API_URL, {
    query: `
        mutation($first_name: String!, $last_name: String!, $email: String!, $password: String!){
            signUp(email: $email, password: $password, first_name: $first_name, last_name: $last_name){
                token
            }
        },
      `,
    variables,
  });

export const signIn = async (variables: LoginReq) =>
  await axios.post(API_URL, {
    query: `
    mutation($email: String!, $password: String!){
        signIn(email: $email, password: $password){
            token
        }
    },
  `,
    variables,
  });

export const deleteUser = async (variables: emailType, token: string) =>
  await axios.post(
    API_URL,
    {
      query: `
            mutation($email: String!){
                deleteUser(email: $email){
                  status
                }
            }`,
      variables,
    },
    {
      headers: {
        "x-token": token,
      },
    }
  );

export const updateUser = async (variables: updateType, token: string) => {
  return await axios.post(
    API_URL,
    {
      query: `
        mutation($email: String!, $first_name: String){
            updateUser(email: $email, first_name: $first_name){
              first_name
            }
        }`,
      variables,
    },
    {
      headers: {
        "x-token": token,
      },
    }
  );
};
