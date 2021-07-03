import { UserInputError } from "apollo-server-express";

export const expectValidationErrors = (
  validationErrors: { [i: string]: string | string[] },
  cb: () => void,
) => {
  try {
    expect(cb()).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(UserInputError);
    expect(error.extensions).toHaveProperty("validationErrors", validationErrors);
  }
};
