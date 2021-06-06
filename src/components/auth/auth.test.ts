import { mockedAuth, mockedContext, mockedUser, setupMocks } from "@test";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";
import * as mutations from "./resolvers/mutations";
import { login as loginValidation, signup as signupValidation } from "./validations/mutations";

jest.mock("@User/UserDataSource");

setupMocks();

describe("Auth", () => {
  const { create, getBy } = mockedContext.dataSources.user;
  const { email, password, name } = mockedUser.args;

  describe("mutations", () => {
    describe("signup", () => {
      it("should resolve", async () => {
        mocked(getBy).mockResolvedValue(null);
        mocked(create).mockResolvedValue(mockedUser.document);
        const auth = await mutations.signup(null, mockedUser.args, mockedContext, null);
        expect(auth).toEqual(mockedAuth);
        expect(getBy).toBeCalledWith({ email });
        expect(getBy).toBeCalledWith({ name });
        expect(getBy).toBeCalledTimes(2);
        expect(create).toBeCalledWith({ email, password, name });
      });

      it("should throw is the email is already taken", async () => {
        mocked(getBy).mockResolvedValueOnce(mockedUser.document);
        await expect(mutations.signup(null, mockedUser.args, mockedContext, null)).rejects.toThrow(
          new AuthenticationError("User already exists"),
        );
        expect(getBy).toBeCalledWith({ email });
        expect(getBy).toBeCalledTimes(1);
        expect(create).not.toBeCalled();
      });

      it("should throw is the name is already taken", async () => {
        mocked(getBy).mockResolvedValueOnce(null);
        mocked(getBy).mockResolvedValueOnce(mockedUser.document);
        await expect(mutations.signup(null, mockedUser.args, mockedContext, null)).rejects.toThrow(
          new AuthenticationError("Name is already taken"),
        );
        expect(getBy).toBeCalledWith({ email });
        expect(getBy).toBeCalledWith({ name });
        expect(getBy).toBeCalledTimes(2);
        expect(create).not.toBeCalled();
      });
    });

    describe("login", () => {
      it("should resolve", async () => {
        mocked(getBy).mockResolvedValue(mockedUser.document);
        const auth = await mutations.login(null, mockedUser.args, mockedContext, null);
        expect(auth).toEqual(mockedAuth);
        expect(getBy).toBeCalledWith({ email });
      });

      it("should throw is the user is not found", async () => {
        mocked(getBy).mockResolvedValue(null);
        await expect(mutations.login(null, mockedUser.args, mockedContext, null)).rejects.toThrow(
          new AuthenticationError("User Not Found"),
        );
        expect(getBy).toBeCalledWith({ email });
      });

      it("should throw is the password is incorrect", async () => {
        mockedUser.args.password = "incorrect password";
        mocked(getBy).mockResolvedValue(mockedUser.document);
        await expect(mutations.login(null, mockedUser.args, mockedContext, null)).rejects.toThrow(
          new AuthenticationError("Incorrect Password"),
        );
        expect(getBy).toBeCalledWith({ email });
      });
    });
  });

  describe("validation", () => {
    it.each(["email", "email@email", "email@email@email.email"])(
      "should throw is the email is invalid",
      (email) => {
        mockedUser.args.email = email;
        expect(() => signupValidation(mockedUser.args)).toThrow(
          new UserInputError("Validation Error", {
            validationErrors: [{ field: "%s", message: "email is invalid" }],
          }),
        );
      },
    );

    it.each([
      ["password", 8, 128],
      ["name", 2, 128],
    ])("should throw if %s is not shorter than %d and longer than %d", (attr, min, max) => {
      (mockedUser.args as { [i: string]: string })[attr] = "#".repeat(max + 3);
      expect(() => signupValidation(mockedUser.args)).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "%s", message: "%s is too long" }],
        }),
      );

      (mockedUser.args as { [i: string]: string })[attr] = "#".repeat(min - 1);
      expect(() => signupValidation(mockedUser.args)).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "%s", message: "%s is too short" }],
        }),
      );
    });

    it.each(["pass word", "PASSWORD", "password "])(
      "should throw if the password confirmation don't match",
      (password) => {
        mockedUser.args.confirmPassword = password;
        expect(() => signupValidation(mockedUser.args)).toThrow(
          new UserInputError("Validation Error", {
            validationErrors: [{ field: "confirmPassword", message: "password not match" }],
          }),
        );
      },
    );

    it.each([["email", "password"]])("should throw if %s is empty", (attr) => {
      (mockedUser.args as { [i: string]: string })[attr] = "";
      expect(() => loginValidation(mockedUser.args)).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "%s", message: "%s is empty" }],
        }),
      );
    });
  });
});
