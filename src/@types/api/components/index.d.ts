export type Resolver<TArgs, R> = (
  source: unknown,
  args: TArgs,
  context: Context,
  info: unknown,
) => Promise<R>;

export type Validator<TArgs> = (args: TArgs) => void;

export type Context = {
  user: IUserDocument;
};
