const progressBar = (total: number, i: number): void => {
  const progress = Math.floor((100 * i) / total);
  const dots = ".".repeat(progress);
  const empty = " ".repeat(100 - progress);
  process.stdout.write(`\r${dots}${empty}${progress}%`);
};

export default progressBar;
