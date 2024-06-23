import { kakaoClient } from '../../kakao/kakao.client';
import { IProviderClient } from './IProviderClient';

class ProviderClientFactory {
  private readonly PROVIDER_NAME = process.env.PROVIDER_NAME;
  private readonly client: IProviderClient;

  constructor(kakaoClient: IProviderClient) {
    switch (this.PROVIDER_NAME) {
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

export const providerClientFactory = new ProviderClientFactory(kakaoClient);
