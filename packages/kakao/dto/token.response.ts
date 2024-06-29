import dayjs, { Dayjs, ManipulateType, UnitTypeLong } from 'dayjs';

export type RawTokenResponse = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
};

/**
 * TODO class 가 아닌 type, util 로 해보자..
 */
export class TokenResponse {
  accessToken: string;
  readonly tokenType: string;
  readonly refreshToken: string;
  readonly idToken: string;
  expiredAt: dayjs.Dayjs;
  readonly scope: string;
  readonly refreshTokenExpiredAt: dayjs.Dayjs;

  constructor(response: RawTokenResponse) {
    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token;
    this.tokenType = response.token_type;
    this.idToken = response.id_token;
    this.expiredAt = dayjs().add(response.expires_in, 'second');
    this.scope = response.scope;
    this.refreshTokenExpiredAt = dayjs().add(
      response.refresh_token_expires_in,
      'second',
    );
  }

  toCookie(): string {
    return JSON.stringify({
      accessToken: this.accessToken,
      tokenType: this.tokenType,
      refreshToken: this.refreshToken,
      idToken: this.idToken,
      expiredAt: this.expiredAt.format(),
      scope: this.scope,
      refreshTokenExpiredAt: this.refreshTokenExpiredAt.format(),
    });
  }

  refreshAccessToken(accessToken: string, expiredAt: dayjs.Dayjs) {
    this.accessToken = accessToken;
    this.expiredAt = expiredAt;
  }
  decodeIdToken(): IdToken {
    return JSON.parse(Buffer.from(this.idToken, 'base64').toString('utf8'));
  }
}

export type RawRefreshTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export class RefreshTokenResponse {
  accessToken: string;
  tokenType: string;
  expiredAt: dayjs.Dayjs;

  constructor(response: RawRefreshTokenResponse) {
    this.accessToken = response.access_token;
    this.tokenType = response.token_type;
    this.expiredAt = dayjs().add(response.expires_in, 'second');
  }
}

export type IdToken = {
  iss: string;
  aud: string;
  sub: string;
  iat: number;
  exp: number;
  auth_time: number;
  nickname: string;
};
