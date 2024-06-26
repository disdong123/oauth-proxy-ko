class PathChecker {
  private static EXCLUDED_PATHS: string | any[] =
    process.env.EXCLUDED_PATHS?.split(',').map(item => item.trimStart()) || [];

  constructor() {
    console.log(`EXCLUDED_PATHS: ${PathChecker.EXCLUDED_PATHS}`);
  }

  isExcluded(path: string) {
    return PathChecker.EXCLUDED_PATHS.includes(path);
  }

  isRedirectUri() {}
}

export const pathChecker = new PathChecker();
