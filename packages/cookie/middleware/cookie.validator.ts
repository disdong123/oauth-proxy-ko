import { ValidationStatus } from './validation-status.enum';

class CookieValidator {
  validate(cookie: any | undefined): ValidationStatus {
    const accessToken = cookie['op-access'];
    if (accessToken === undefined) {
      return ValidationStatus.EMPTY;
    }

    // TODO validation
    return ValidationStatus.VALID;
  }
}

export const cookieValidator = new CookieValidator();
