import { CookieValidationStatus } from './validation-status.enum';
import { TOKEN_RESPONSE } from './cookie.constant';
import {
  RefreshTokenResponse,
  TokenResponse,
} from '../../kakao/dto/token.response';
import dayjs from 'dayjs';

class CookieValidator {
  /**
   *
   * @param cookie
   * @param unsigned req.unsignCookie // FIXME
   */
  validate(
    cookie: any | undefined,
    unsigned: Function,
  ): CookieValidationResponse {
    const signedCookie = cookie[TOKEN_RESPONSE];

    if (signedCookie === undefined) {
      console.log('cookie is empty');
      return new CookieValidationResponse(CookieValidationStatus.EMPTY);
    }

    const parseSignedCookie: {
      valid: boolean;
      renew: boolean;
      value: string;
    } = unsigned(signedCookie);
    if (!parseSignedCookie.valid) {
      console.log('cookie is not valid');
      return new CookieValidationResponse(CookieValidationStatus.INVALID_SIGN);
    }

    const response = JSON.parse(
      parseSignedCookie.value,
      this.reviver,
    ) as TokenResponse;
    const now = dayjs();

    if (response.expiredAt.isBefore(now)) {
      console.log('expired access token', response);
      return new CookieValidationResponse(
        CookieValidationStatus.EXPIRED,
        response,
      );
    }

    console.log('everything is fine');
    return new CookieValidationResponse(CookieValidationStatus.VALID, response);
  }

  private reviver(key: string, value: any) {
    if (key === 'expiredAt' || key === 'refreshTokenExpiredAt') {
      return dayjs(value);
    }
    return value;
  }
}

export class CookieValidationResponse {
  private status: CookieValidationStatus;
  private tokenResponse?: TokenResponse | null;

  constructor(
    status: CookieValidationStatus,
    tokenResponse: TokenResponse | null = null,
  ) {
    this.status = status;
    this.tokenResponse = tokenResponse;
  }

  get refreshToken(): string | null {
    return this.tokenResponse?.refreshToken || null;
  }

  isTokenResponseEmpty(): boolean {
    return this.tokenResponse === null;
  }

  isValid(): boolean {
    return this.status === CookieValidationStatus.VALID;
  }

  isEmpty(): boolean {
    return this.status === CookieValidationStatus.EMPTY;
  }

  isExpired(): boolean {
    return this.status === CookieValidationStatus.EXPIRED;
  }

  refreshAccessToken(refreshTokenResponse: RefreshTokenResponse) {
    this.tokenResponse!.accessToken = refreshTokenResponse.accessToken;
    this.tokenResponse!.expiredAt = refreshTokenResponse.expiredAt;
  }

  toCookie(): string | undefined {
    return JSON.stringify({
      accessToken: this.tokenResponse?.accessToken,
      tokenType: this.tokenResponse?.tokenType,
      refreshToken: this.tokenResponse?.refreshToken,
      idToken: this.tokenResponse?.idToken,
      expiredAt: this.tokenResponse?.expiredAt.format(),
      scope: this.tokenResponse?.scope,
      refreshTokenExpiredAt: this.tokenResponse?.refreshTokenExpiredAt.format(),
    });
  }
}

export const cookieValidator = new CookieValidator();
