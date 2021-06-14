import { expectValidationErrors, mockedContext, mockedUser, setupMocks } from "@test";
import { AuthenticationError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";
import { EMAIL, NAME, PASSWORD, USER } from "./errors";
import * as mutations from "./resolvers/mutations";
import * as validators from "./validations/mutations";

jest.mock("@User/UserDataSource");

setupMocks();

describe("User", () => {
  const { create, remove, getBy, update } = mockedContext.dataSources.user;
  const { email, password, name } = mockedUser.args;
  const id = mockedUser.document._id.toHexString();

  describe("mutations", () => {
    describe("createUser", () => {
      it("should resolve", async () => {
        mocked(getBy).mockResolvedValue(null);
        mocked(create).mockResolvedValue(mockedUser.document);
        const user = await mutations.createUser(null, mockedUser.args, mockedContext, null);
        expect(user).toEqual(mockedUser.document);
        expect(getBy).toBeCalledWith({ email });
        expect(getBy).toBeCalledWith({ name });
        expect(getBy).toBeCalledTimes(2);
        expect(create).toBeCalledWith({ email, password, name });
      });

      it("should throw if the email is already taken", async () => {
        mocked(getBy).mockResolvedValueOnce(mockedUser.document);
        await expect(mutations.createUser(null, mockedUser.args, mockedContext, null)).rejects.toThrow(
          new AuthenticationError(EMAIL.ALREADY_TAKEN),
        );
        expect(getBy).toBeCalledWith({ email });
        expect(getBy).toBeCalledTimes(1);
        expect(create).not.toBeCalled();
      });

      it("should throw if the name is already taken", async () => {
        mocked(getBy).mockResolvedValueOnce(null);
        mocked(getBy).mockResolvedValueOnce(mockedUser.document);
        await expect(mutations.createUser(null, mockedUser.args, mockedContext, null)).rejects.toThrow(
          new AuthenticationError(NAME.ALREADY_TAKEN),
        );
        expect(getBy).toBeCalledWith({ email });
        expect(getBy).toBeCalledWith({ name });
        expect(getBy).toBeCalledTimes(2);
        expect(create).not.toBeCalled();
      });
    });

    describe("deleteUser", () => {
      it("should resolve", async () => {
        mocked(remove).mockResolvedValue(mockedUser.document);
        const user = await mutations.deleteUser(null, { id }, mockedContext, null);
        expect(remove).toBeCalledWith(id);
        expect(user).toEqual(mockedUser.document);
      });

      it("should throw if the user is not found", async () => {
        mocked(remove).mockResolvedValue(null);
        await expect(mutations.deleteUser(null, { id }, mockedContext, null)).rejects.toThrow(
          new AuthenticationError(USER.NOT_FOUND),
        );
        expect(remove).toBeCalledWith(id);
      });
    });

    describe("updateUser", () => {
      it("should resolve", async () => {
        mocked(update).mockResolvedValue(mockedUser.document);
        const user = await mutations.updateUser(null, mockedUser.update, mockedContext, null);
        expect(update).toBeCalledWith(mockedUser.update);
        expect(user).toEqual(mockedUser.document);
      });

      it("should throw if the user is not found", async () => {
        mocked(update).mockResolvedValue(null);
        await expect(mutations.updateUser(null, mockedUser.update, mockedContext, null)).rejects.toThrow(
          new AuthenticationError(USER.NOT_FOUND),
        );
        expect(update).toBeCalledWith(mockedUser.update);
      });
    });
  });

  describe("validation", () => {
    describe("createUser", () => {
      it.each(["email", "email@email", "email@email@email.email"])(
        "should throw if the email is invalid",
        (email) =>
          expectValidationErrors({ email: EMAIL.INVALID }, () =>
            validators.createUser({ ...mockedUser.args, email }),
          ),
      );

      it.each([
        ["password", 8, { password: PASSWORD.TOO_SHORT }, { password: "p".repeat(7) }],
        ["name", 2, { name: [NAME.TOO_SHORT] }, { name: "u" }],
      ])("should throw if the %s length is shorter than %d", (_, __, validationErrors, args) => {
        expectValidationErrors(validationErrors, () =>
          validators.createUser({ ...mockedUser.args, ...args }),
        );
      });

      it.each([
        ["password", 128, { password: PASSWORD.TOO_LONG }, { password: "p".repeat(131) }],
        ["name", 128, { name: [NAME.TOO_LONG] }, { name: "u".repeat(131) }],
      ])("should throw if the %s length is longer than %d", (_, __, validationErrors, args) => {
        expectValidationErrors(validationErrors, () =>
          validators.createUser({ ...mockedUser.args, ...args }),
        );
      });

      it.each(["##", "sion?", "@sion"])("should throw if the name is not alphanumeric", (name) => {
        expectValidationErrors({ name: [NAME.NOT_ALPHANUMERIC] }, () =>
          validators.createUser({ ...mockedUser.args, name }),
        );
      });
    });

    describe("updateUser", () => {
      it.each(["email", "email@email", "email@email@email.email"])(
        "should throw if the email is invalid",
        (email) =>
          expectValidationErrors({ email: EMAIL.INVALID }, () =>
            validators.updateUser({ ...mockedUser.update, email }),
          ),
      );

      it("should throw if the name length is shorter than 2", () => {
        expectValidationErrors({ name: [NAME.TOO_SHORT] }, () =>
          validators.updateUser({ ...mockedUser.update, name: "u" }),
        );
      });

      it("should throw if the name length is longer than 128", () => {
        expectValidationErrors({ name: [NAME.TOO_LONG] }, () =>
          validators.updateUser({ ...mockedUser.update, name: "u".repeat(131) }),
        );
      });

      it.each(["##", "sion?", "@sion"])("should throw if the name is not alphanumeric", (name) => {
        expectValidationErrors({ name: [NAME.NOT_ALPHANUMERIC] }, () =>
          validators.updateUser({ ...mockedUser.update, name }),
        );
      });
    });
  });
});
