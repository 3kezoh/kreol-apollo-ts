import { UserInputError } from "apollo-server-express";

export const expectValidationErrors = (
  validationErrors: { [i: string]: string | string[] },
  cb: () => void,
) => {
  try {
    expect(cb()).toThrowError();
  } catch (error) {
    if (error instanceof UserInputError) {
      expect(error).toBeInstanceOf(UserInputError);
      expect(error.extensions).toHaveProperty("validationErrors", validationErrors);
    }
  }
};
