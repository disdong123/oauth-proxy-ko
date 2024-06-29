import Fastify from 'fastify';
import { routes } from './route';
import cookie, { FastifyCookieOptions } from '@fastify/cookie';
import dotenv from 'dotenv';
import { cookieValidationMiddleware } from './cookie/middleware/cookie-validation.middleware';
import { loggingOptionFactory } from './logging/logging-option.factory';
import fastifyHttpProxy from '@fastify/http-proxy';
import dayjs, { Dayjs, ManipulateType, UnitTypeLong } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import ko from 'dayjs/locale/ko';

dayjs.locale(ko);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

console.log(dayjs().format());

dotenv.config();

const fastify = Fastify({
  logger: loggingOptionFactory.options(),
});

// localhost:PROXY_PORT/api will be proxied to UPSTREAM_URL_PREFIX
fastify.register(fastifyHttpProxy, {
  // prefix: process.env.UPSTREAM_URL_PREFIX,
  upstream: process.env.UPSTREAM_URL!,
  http2: false,
});

fastify.register(cookie, {
  secret: 'oauth-secret',
} as FastifyCookieOptions);
fastify.register(routes);

fastify.addHook('preHandler', cookieValidationMiddleware);

const start = async () => {
  try {
    const port = Number(process.env.PROXY_PORT) || 3000;
    await fastify.listen({ port: port });
  } catch (e) {
    fastify.log.error(e);
    process.exit(1);
  }
};

start();
