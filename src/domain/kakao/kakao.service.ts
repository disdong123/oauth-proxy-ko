export class KakaoService {
  private kakaoAuth: KakaoAuth;
  constructor(kakaoAuth: KakaoAuth) {
    console.log('kakaoService', JSON.stringify(kakaoAuth));
    this.kakaoAuth = kakaoAuth;
    this.kakaoAuth.get();
  }

  get() {
    console.log('get');
  }
}

export class KakaoAuth {
  get() {
    console.log('get2');
  }
}
