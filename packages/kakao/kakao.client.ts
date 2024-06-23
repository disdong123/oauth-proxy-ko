import { IProviderClient } from '../cookie/util/IProviderClient';

class KakaoClient implements IProviderClient {
  private static BASE_URL = 'https://kauth.kakao.com';

  getLoginRedirectUrl(): string {
    return KakaoClient.BASE_URL + '';
  }
}

export const kakaoClient = new KakaoClient();
