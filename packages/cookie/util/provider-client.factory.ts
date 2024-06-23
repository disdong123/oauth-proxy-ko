import { kakaoClient } from '../../kakao/kakao.client';
import { IProviderClient } from './IProviderClient';

class ProviderClientFactory {
  private static PROVIDER_NAME = process.env.PROVIDER_NAME;
  private client: IProviderClient;

  constructor() {
    switch (ProviderClientFactory.PROVIDER_NAME) {
      case 'kakao':
        this.client = kakaoClient;
        break;
      default:
        this.client = kakaoClient;
    }
  }

  getClient(): IProviderClient {
    return this.client;
  }
}

export const providerClientFactory = new ProviderClientFactory();
