import { pathChecker } from '../util/path.checker';
import { upstreamClient } from '../../upstream/upstream.client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { cookieValidator } from './cookie.validator';
import { providerClientFactory } from '../util/provider-client.factory';
import { ValidationStatus } from './validation-status.enum';

export const CookieValidationMiddleware = (
  req: FastifyRequest,
  rep: FastifyReply,
  done: (err?: Error) => void,
) => {
  if (!pathChecker.isExcluded(req.url)) {
    req.log.info('forwarding...');
    upstreamClient.forward();
  }

  const providerClient = providerClientFactory.getClient();

  const status = cookieValidator.validate(req.cookies);

  req.log.info('qqqweqweqwe');
  req.log.info(`status: ${status}`);
  if (status === ValidationStatus.EMPTY) {
    req.log.info('redirect to kakao login page');
    rep.redirect(providerClient.getLoginRedirectUrl());
  }

  if (status === ValidationStatus.EXPIRED) {
    req.log.info('refresh access token');
  }

  if (status === ValidationStatus.VALID) {
    req.log.info('forwarding...');
    // TODO
    upstreamClient.forward();
  }

  done();
};
