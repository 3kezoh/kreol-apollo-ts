import { UserInputError } from "apollo-server-express";

export const expectValidationErrors = (validationErrors: { [i: string]: string }, cb: () => void) => {
  try {
    cb();
  } catch (error) {
    expect(error).toBeInstanceOf(UserInputError);
    expect(error.extensions).toHaveProperty("validationErrors", validationErrors);
  }
};
