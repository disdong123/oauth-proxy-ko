import { pathChecker } from '../util/path.checker';
import { upstreamClient } from '../../upstream/upstream.client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { cookieValidator } from './cookie.validator';
import { providerClientFactory } from '../util/provider-client.factory';
import { ValidationStatus } from './validation-status.enum';
import { KakaoCallbackResponse } from '../../kakao/dto/kakao-callback.response';
import {
  ACCESS_TOKEN_KEY,
  ID_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from './cookie.constant';
import { TokenResponse } from '../../kakao/dto/token.response';

export const cookieValidationMiddleware = async (
  req: FastifyRequest,
  rep: FastifyReply,
) => {
  try {
    if (!pathChecker.isExcluded(req.url)) {
      req.log.info('path forwarding...');
      upstreamClient.forward();
    }

    const providerClient = providerClientFactory.getClient();
    const status = cookieValidator.validate(req.cookies);

    if (status === ValidationStatus.EMPTY) {
      const oauthRedirectUri = new URL(providerClient.getRedirectUri());
      // 로그인 한 경우
      if (isOauthRedirectUrl(req.routerPath, oauthRedirectUri.pathname)) {
        const response: TokenResponse =
          await providerClient.getTokenByAuthorizationCode(
            (req.query as KakaoCallbackResponse).code,
          );

        rep.setCookie(ACCESS_TOKEN_KEY, response.accessToken);
        rep.setCookie(REFRESH_TOKEN_KEY, response.refreshToken);
        rep.setCookie(ID_TOKEN_KEY, response.idToken);
        rep.status(200).send('ok');
      }

      req.log.info('redirect to kakao login page');
      rep.redirect(providerClient.getLoginRedirectUri());
    }

    if (status === ValidationStatus.EXPIRED) {
      req.log.info('refresh access token');
    }

    if (status === ValidationStatus.VALID) {
      req.log.info('valid forwarding...');
      // TODO
      upstreamClient.forward();
    }
  } catch (e) {}
};

const isOauthRedirectUrl = (
  requestUrl: string,
  oauthRedirectUrl: string,
): boolean => {
  return requestUrl === oauthRedirectUrl;
};
