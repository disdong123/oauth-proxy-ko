import { IProviderClient } from '../cookie/util/IProviderClient';
import axios from 'axios';
import { RawTokenResponse, TokenResponse } from './dto/token.response';
import { TokenRequest } from './dto/token.request';

class KakaoClient implements IProviderClient {
  private KAUTH_BASE_URL = 'https://kauth.kakao.com/oauth';
  private KAPI_BASE_URL = 'https://kapi.kakao.com/v1';
  private REDIRECT_URI = process.env.REDIRECT_URI || '';
  private CLIENT_ID = process.env.CLIENT_ID || '';
  private kauthClient = axios.create({
    baseURL: this.KAUTH_BASE_URL,
  });
  private kapiClient = axios.create({
    baseURL: this.KAPI_BASE_URL,
  });

  getRedirectUri(): string {
    return this.REDIRECT_URI;
  }

  getLoginRedirectUri(): string {
    // TODO openid default?
    return `${this.KAUTH_BASE_URL}/authorize?client_id=${this.CLIENT_ID}&redirect_uri=${this.REDIRECT_URI}&response_type=code&scope=openid`;
  }

  async getTokenByAuthorizationCode(code: string): Promise<TokenResponse> {
    const response = await this.kauthClient.post(
      '/token',
      new TokenRequest(this.CLIENT_ID, this.REDIRECT_URI, code),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );

    if (response.status !== 200) {
      throw new Error('exception');
    }

    return new TokenResponse(response.data);
  }
}

export const kakaoClient = new KakaoClient();
