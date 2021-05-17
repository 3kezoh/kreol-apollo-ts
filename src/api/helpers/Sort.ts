class Sort {
  static readonly BY_SCORE = new Sort(1, -1);

  static readonly BY_DATE = new Sort(-1);

  private constructor(private readonly createdAt: number, private readonly score?: number) {}
}

export default Sort;
