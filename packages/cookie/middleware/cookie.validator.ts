import { ValidationStatus } from './validation-status.enum';
import {
  ACCESS_TOKEN_KEY,
  ID_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_RESPONSE,
} from './cookie.constant';
import { TokenResponse } from '../../kakao/dto/token.response';

class CookieValidator {
  validate(cookie: any | undefined): ValidationStatus {
    const rawResponse = cookie[TOKEN_RESPONSE];

    if (rawResponse === undefined) {
      return ValidationStatus.EMPTY;
    }

    console.log('is not empty...!', rawResponse);

    const response = JSON.parse(rawResponse) as TokenResponse;

    // if (response.expiresIn)
    // TODO validation
    return ValidationStatus.VALID;
  }
}

export const cookieValidator = new CookieValidator();
