import { asClass, createContainer, InjectionMode, Lifetime } from 'awilix';
import { KakaoAuth, KakaoService } from '../../kakao/kakao.service';

interface ICradle {
  kakaoService: KakaoService;
  kakaoAuth: KakaoAuth;
}

export const container = createContainer<ICradle>({
  injectionMode: InjectionMode.CLASSIC,
  strict: true,
});

container.register({
  kakaoAuth: asClass(KakaoAuth, {
    lifetime: Lifetime.SINGLETON,
  }),
  kakaoService: asClass(KakaoService, {
    lifetime: Lifetime.SINGLETON,
  }),
});
