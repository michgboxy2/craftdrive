import * as userApi from "../test/api";

describe("users", () => {
  describe("users", () => {
    it("returns a user details when user can be found", async () => {
      let token = await global.getToken();

      const result = await userApi.users(token);
      expect(result.data.data).toHaveProperty("users");
    });
  });

  describe("user(email: String!)", () => {
    it("searches a user via email and returns the user if found", async () => {
      let token = await global.getToken();

      await userApi.signUp({
        first_name: "michy",
        last_name: "king",
        email: "testUser@gmail.com",
        password: "password",
      });

      let loginCredentials = { email: "testUser@gmail.com" };

      const {
        data: {
          data: { user },
        },
      } = await userApi.user(loginCredentials, token);
      expect(user.email).toEqual(loginCredentials.email);
    });
  });

  describe("signIn(email: String!, password: String!)", () => {
    it("returns a token on successful user signin", async () => {
      await userApi.signUp({
        first_name: "michy",
        last_name: "king",
        email: "testUser@gmail.com",
        password: "password",
      });

      // return signupToken;
      const token = await userApi.signIn({
        email: "testUser@gmail.com",
        password: "password",
      });
      expect(token.data.data.signIn).toHaveProperty("token");
    });

    it("returns an error if a mismatched login credential was passed", async () => {
      const token = await userApi.signIn({
        email: "testUser@gmail.com",
        password: "password56klkl",
      });
      expect(token.data).toHaveProperty("errors");
    });
  });

  describe("updateUser(email: String!, first_name: String)", () => {
    it("update user profile", async () => {
      //signup user account
      const {
        data: {
          data: {
            signUp: { token },
          },
        },
      } = await userApi.signUp({
        first_name: "michy",
        last_name: "king",
        email: "testUser@gmail.com",
        password: "password",
      });

      //////////Update User//////////
      let updateData = {
        email: "testUser@gmail.com",
        first_name: "michyKing",
      };

      const {
        data: {
          data: { updateUser },
        },
      } = await userApi.updateUser(updateData, token);
      expect(updateUser).toHaveProperty("first_name");
    });
  });

  describe("delete(email: String!)", () => {
    it("deletes a user", async () => {
      let token = await global.getToken();

      await userApi.signUp({
        first_name: "michy",
        last_name: "king",
        email: "testUser@gmail.com",
        password: "password",
      });
      const {
        data: {
          data: {
            deleteUser: { status },
          },
        },
      } = await userApi.deleteUser({ email: "testUser@gmail.com" }, token);
      expect(status).toBe(true);
    });
  });

  describe("signUp(first_name: String!, last_name: String!, email: String!, password: Password!)", () => {
    it("signup the user", async () => {
      // let token = await global.getToken();
      // await userApi.deleteUser({ email: "testUser@gmail.com" }, token);
      const {
        data: {
          data: { signUp },
        },
      } = await userApi.signUp({
        first_name: "michy",
        last_name: "king",
        email: "testUser@gmail.com",
        password: "password",
      });

      expect(signUp).toHaveProperty("token");
    });
  });
});
