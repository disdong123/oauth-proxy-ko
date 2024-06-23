import { ValidationStatus } from './validation-status.enum';
import {
  ACCESS_TOKEN_KEY,
  ID_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from './cookie.constant';

class CookieValidator {
  validate(cookie: any | undefined): ValidationStatus {
    const accessToken = cookie[ACCESS_TOKEN_KEY];
    const refreshToken = cookie[REFRESH_TOKEN_KEY];
    const idToken = cookie[ID_TOKEN_KEY];

    if (
      accessToken === undefined ||
      refreshToken === undefined ||
      idToken === undefined
    ) {
      return ValidationStatus.EMPTY;
    }

    // TODO validation
    return ValidationStatus.VALID;
  }
}

export const cookieValidator = new CookieValidator();
