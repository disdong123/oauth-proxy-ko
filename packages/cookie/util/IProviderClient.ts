import {
  RefreshTokenResponse,
  TokenResponse,
} from '../../kakao/dto/token.response';

export interface IProviderClient {
  getRedirectUri(): string;
  getLoginRedirectUri(): string;
  getTokenByAuthorizationCode(code: string): Promise<TokenResponse>;
  refreshAccessToken(token: string): Promise<RefreshTokenResponse>;
}
