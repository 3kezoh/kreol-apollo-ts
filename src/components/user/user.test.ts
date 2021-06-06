import { mockedContext, mockedUser, setupMocks } from "@test";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";
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

      it("should throw is the email is already taken", async () => {
        mocked(getBy).mockResolvedValueOnce(mockedUser.document);
        await expect(mutations.createUser(null, mockedUser.args, mockedContext, null)).rejects.toThrow(
          new AuthenticationError("User already exists"),
        );
        expect(getBy).toBeCalledWith({ email });
        expect(getBy).toBeCalledTimes(1);
        expect(create).not.toBeCalled();
      });

      it("should throw is the name is already taken", async () => {
        mocked(getBy).mockResolvedValueOnce(null);
        mocked(getBy).mockResolvedValueOnce(mockedUser.document);
        await expect(mutations.createUser(null, mockedUser.args, mockedContext, null)).rejects.toThrow(
          new AuthenticationError("Name is already taken"),
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

      it("should throw is the user is not found", async () => {
        mocked(remove).mockResolvedValue(null);
        await expect(mutations.deleteUser(null, { id }, mockedContext, null)).rejects.toThrow(
          new AuthenticationError("User Not Found"),
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

      it("should throw is the user is not found", async () => {
        mocked(update).mockResolvedValue(null);
        await expect(mutations.updateUser(null, mockedUser.update, mockedContext, null)).rejects.toThrow(
          new AuthenticationError("User Not Found"),
        );
        expect(update).toBeCalledWith(mockedUser.update);
      });
    });
  });

  describe("validation", () => {
    describe("createUser", () => {
      it.each(["email", "email@email", "email@email@email.email"])(
        "should throw is the email is invalid",
        (email) => {
          mockedUser.args.email = email;
          expect(() => validators.createUser(mockedUser.args)).toThrow(
            new UserInputError("Validation Error", {
              validationErrors: [{ field: "email", message: "email is invalid" }],
            }),
          );
        },
      );

      it.each([
        ["password", 8, 128],
        ["name", 2, 128],
      ])("should throw if %s is not shorter than %d and longer than %d", (attr, min, max) => {
        (mockedUser.args as { [i: string]: string })[attr] = "#".repeat(max + 3);
        expect(() => validators.createUser(mockedUser.args)).toThrow(
          new UserInputError("Validation Error", {
            validationErrors: [{ field: "%s", message: "%s is too long" }],
          }),
        );

        (mockedUser.args as { [i: string]: string })[attr] = "#".repeat(min - 1);
        expect(() => validators.createUser(mockedUser.args)).toThrow(
          new UserInputError("Validation Error", {
            validationErrors: [{ field: "%s", message: "%s is too short" }],
          }),
        );
      });

      it.each(["pass word", "PASSWORD", "password "])(
        "should throw if the password confirmation don't match",
        (password) => {
          mockedUser.args.confirmPassword = password;
          expect(() => validators.createUser(mockedUser.args)).toThrow(
            new UserInputError("Validation Error", {
              validationErrors: [{ field: "confirmPassword", message: "password not match" }],
            }),
          );
        },
      );
    });

    describe("updateUser", () => {
      it.each(["email", "email@email", "email@email@email.email"])(
        "should throw is the email is invalid",
        (email) => {
          mockedUser.update.email = email;
          expect(() => validators.updateUser(mockedUser.update)).toThrow(
            new UserInputError("Validation Error", {
              validationErrors: [{ field: "email", message: "email is invalid" }],
            }),
          );
        },
      );

      it("should throw if name is not shorter than 2 and longer than 128", () => {
        mockedUser.update.name = "#";
        expect(() => validators.updateUser(mockedUser.update)).toThrow(
          new UserInputError("Validation Error", {
            validationErrors: [{ field: "name", message: "name is too long" }],
          }),
        );

        mockedUser.update.name = "#".repeat(128 + 3);
        expect(() => validators.updateUser(mockedUser.update)).toThrow(
          new UserInputError("Validation Error", {
            validationErrors: [{ field: "%s", message: "%s is too short" }],
          }),
        );
      });
    });
  });
});
