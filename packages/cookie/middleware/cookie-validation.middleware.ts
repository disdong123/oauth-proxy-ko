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
  TOKEN_RESPONSE,
} from './cookie.constant';
import { TokenResponse } from '../../kakao/dto/token.response';

export const cookieValidationMiddleware = async (
  req: FastifyRequest,
  rep: FastifyReply,
) => {
  try {
    if (pathChecker.isExcluded(req.url)) {
      req.log.info('path forwarding...');
      return;
    }

    const providerClient = providerClientFactory.getClient();
    const status = cookieValidator.validate(req.cookies);

    if (status === ValidationStatus.EMPTY) {
      const oauthRedirectUri = new URL(providerClient.getRedirectUri());
      req.log.info(
        `routerPath: ${req.routerPath}, pathname: ${oauthRedirectUri.pathname}`,
      );

      if (isOauthRedirectUrl(req.routerPath, oauthRedirectUri.pathname)) {
        // 로그인 후 리다이렉트 된 경우
        // 여기서 하는게 맞나?
        req.log.info(`callback after login`);
        const response: TokenResponse =
          await providerClient.getTokenByAuthorizationCode(
            (req.query as KakaoCallbackResponse).code,
          );

        // TODO 암호화?
        rep.setCookie(TOKEN_RESPONSE, JSON.stringify(response), {
          signed: true,
        });

        return;
      } else {
        req.log.info('redirect to kakao login page');
        rep.redirect(providerClient.getLoginRedirectUri());
      }
    }

    // 아래에서는 쿠키와 함께 온 경우를 처리합니다.
    // 아무런 예외에 걸리지 않으면 upstream 으로 요청을 포워딩합니다. (proxy 에서 정의된 endpoint 에 걸리지 않는 경우)
    // 탈취된 토큰에 대해서는 어떻게 처리할 지?
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
