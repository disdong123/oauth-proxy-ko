class PathChecker {
  private static EXCLUDED_PATHS: string | any[] =
    process.env.EXCLUDED_PATHS?.split(',').map(item => item.trimStart()) || [];

  isExcluded(path: string) {
    return PathChecker.EXCLUDED_PATHS.includes(path);
  }
}

export const pathChecker = new PathChecker();
