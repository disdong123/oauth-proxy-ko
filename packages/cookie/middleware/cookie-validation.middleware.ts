import { pathChecker } from '../util/path.checker';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { cookieValidator } from './cookie.validator';
import { providerClientFactory } from '../util/provider-client.factory';
import { KakaoCallbackResponse } from '../../kakao/dto/kakao-callback.response';
import { TOKEN_RESPONSE } from './cookie.constant';
import { TokenResponse } from '../../kakao/dto/token.response';

export const cookieValidationMiddleware = async (
  req: FastifyRequest,
  rep: FastifyReply,
) => {
  try {
    if (req.cookies !== undefined) {
      console.log(req.unsignCookie(req.cookies[TOKEN_RESPONSE] || ''));
    }

    if (pathChecker.isExcluded(req.url)) {
      req.log.info('path forwarding...');
      return;
    }

    const providerClient = providerClientFactory.getClient();
    const validationResponse = cookieValidator.validate(
      req.cookies,
      req.unsignCookie,
    );

    if (validationResponse.isEmpty()) {
      const oauthRedirectUri = new URL(providerClient.getRedirectUri());
      req.log.info(
        `routerPath: ${req.routerPath}, pathname: ${oauthRedirectUri.pathname}`,
      );

      if (isOauthRedirectUrl(req.routerPath, oauthRedirectUri.pathname)) {
        // 로그인 후 리다이렉트 된 경우
        req.log.info(`callback after login`);
        const tokenResponse: TokenResponse =
          await providerClient.getTokenByAuthorizationCode(
            (req.query as KakaoCallbackResponse).code,
          );

        // TODO 암호화?
        rep.setCookie(TOKEN_RESPONSE, tokenResponse.toCookie(), {
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
    if (validationResponse.isExpired()) {
      req.log.info('refresh access token');
      // refresh token 으로 access token 을 재발행합니다.
      if (validationResponse.isTokenResponseEmpty()) {
        throw new Error('refresh token should not be empty');
      }

      const refreshTokenResponse = await providerClient.refreshAccessToken(
        validationResponse.refreshToken!,
      );

      validationResponse.refreshAccessToken(refreshTokenResponse);

      rep.setCookie(TOKEN_RESPONSE, validationResponse.toCookie()!, {
        signed: true,
      });

      return;
    }

    if (validationResponse.isValid()) {
      req.log.info('valid forwarding...');
      return;
    }

    req.log.info('what???');
  } catch (e) {
    req.log.error(e);
  }
};

const isOauthRedirectUrl = (
  requestUrl: string,
  oauthRedirectUrl: string,
): boolean => {
  return requestUrl === oauthRedirectUrl;
};
