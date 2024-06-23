import { IProviderClient } from '../cookie/util/IProviderClient';
import axios from 'axios';

class KakaoClient implements IProviderClient {
  private static KAUTH_BASE_URL = 'https://kauth.kakao.com';
  private static KAPI_BASE_URL = 'https://kapi.kakao.com/v1';
  private static REDIRECT_URI = process.env.REDIRECT_URI;
  private static CLIENT_ID = process.env.CLIENT_ID;
  private kauthClient = axios.create({
    baseURL: KakaoClient.KAUTH_BASE_URL,
  });
  private kapiClient = axios.create({
    baseURL: KakaoClient.KAPI_BASE_URL,
  });

  getLoginRedirectUrl(): string {
    // const url = new URL(KakaoClient.KAUTH_BASE_URL + '/authorize');
    // url.searchParams.append('client_id', KakaoClient.CLIENT_ID);
    // url.searchParams.append('redirect_uri', KakaoClient.REDIRECT_URI);
    // url.searchParams.append('response_type', 'code');
    // url.searchParams.append('scope', 'openid'); // TODO default?
    return `${KakaoClient.KAUTH_BASE_URL}/authorize/client_id=${KakaoClient.CLIENT_ID}&redirect_uri=${KakaoClient.REDIRECT_URI}&response_type=code&scope=openid`;
  }

  getToken() {}
}

export const kakaoClient = new KakaoClient();
