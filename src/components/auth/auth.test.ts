import { expectValidationErrors, mockedAuth, mockedContext, mockedUser, setupMocks } from "@test";
import { AuthenticationError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";
import { EMAIL, NAME, PASSWORD, USER } from "./errors";
import * as mutations from "./resolvers/mutations";
import * as validators from "./validations/mutations";

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

      it("should throw if the email is already taken", async () => {
        mocked(getBy).mockResolvedValueOnce(mockedUser.document);
        await expect(mutations.signup(null, mockedUser.args, mockedContext, null)).rejects.toThrow(
          new AuthenticationError(EMAIL.ALREADY_TAKEN),
        );
        expect(getBy).toBeCalledWith({ email });
        expect(getBy).toBeCalledTimes(1);
        expect(create).not.toBeCalled();
      });

      it("should throw if the name is already taken", async () => {
        mocked(getBy).mockResolvedValueOnce(null);
        mocked(getBy).mockResolvedValueOnce(mockedUser.document);
        await expect(mutations.signup(null, mockedUser.args, mockedContext, null)).rejects.toThrow(
          new AuthenticationError(NAME.ALREADY_TAKEN),
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

      it("should throw if the user is not found", async () => {
        mocked(getBy).mockResolvedValue(null);
        await expect(mutations.login(null, mockedUser.args, mockedContext, null)).rejects.toThrow(
          new AuthenticationError(USER.NOT_FOUND),
        );
        expect(getBy).toBeCalledWith({ email });
      });

      it("should throw if the password is incorrect", async () => {
        const args = { ...mockedUser.args, password: "incorrect password" };
        mocked(getBy).mockResolvedValue(mockedUser.document);
        await expect(mutations.login(null, args, mockedContext, null)).rejects.toThrow(
          new AuthenticationError(PASSWORD.INVALID),
        );
        expect(getBy).toBeCalledWith({ email });
      });
    });
  });

  describe("validation", () => {
    describe("signup", () => {
      it.each(["email", "email@email", "email@email@email.email"])(
        "should throw if the email is invalid",
        (email) =>
          expectValidationErrors({ email: EMAIL.INVALID }, () =>
            validators.signup({ ...mockedUser.args, email }),
          ),
      );

      it.each([
        [
          "password",
          8,
          { password: PASSWORD.TOO_SHORT },
          { password: "p".repeat(7), confirmPassword: "p".repeat(7) },
        ],
        ["name", 2, { name: NAME.TOO_SHORT }, { name: "u" }],
      ])("should throw if the %s length is shorter than %d", (_, __, validationErrors, args) =>
        expectValidationErrors(validationErrors, () => validators.signup({ ...mockedUser.args, ...args })),
      );

      it.each([
        [
          "password",
          128,
          { password: PASSWORD.TOO_LONG },
          { password: "p".repeat(131), confirmPassword: "p".repeat(131) },
        ],
        ["name", 128, { name: NAME.TOO_LONG }, { name: "u".repeat(131) }],
      ])("should throw if the %s length is longer than %d", (_, __, validationErrors, args) =>
        expectValidationErrors(validationErrors, () => validators.signup({ ...mockedUser.args, ...args })),
      );

      it.each(["pass word", "PASSWORD", "password "])(
        "should throw if the password confirmation don't match",
        (password) =>
          expectValidationErrors({ confirmPassword: PASSWORD.NOT_MATCH }, () =>
            validators.signup({ ...mockedUser.args, password }),
          ),
      );
    });

    describe("login", () => {
      it.each([
        ["email", { email: EMAIL.EMPTY }, { email: "" }],
        ["password", { password: PASSWORD.EMPTY }, { password: "" }],
      ])("should throw if the %s is empty", (_, validationErrors, args) =>
        expectValidationErrors(validationErrors, () => validators.login({ ...mockedUser.args, ...args })),
      );
    });
  });
});
