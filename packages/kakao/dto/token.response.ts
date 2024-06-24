export type RawTokenResponse = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
};

export class TokenResponse {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
  scope: string;
  refreshTokenExpiresIn: number;

  constructor(response: RawTokenResponse) {
    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token;
    this.tokenType = response.token_type;
    this.idToken = response.id_token;
    // TODO 만료 날짜를 넣어야 함
    this.expiresIn = response.expires_in;
    this.scope = response.scope;
    // TODO 만료 날짜를 넣어야 함
    this.refreshTokenExpiresIn = response.refresh_token_expires_in;
  }

  decodeIdToken(): IdToken {
    return JSON.parse(Buffer.from(this.idToken, 'base64').toString('utf8'));
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
