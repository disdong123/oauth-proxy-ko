import Fastify from 'fastify';
import { routes } from './route';
import cookie from '@fastify/cookie';
import dotenv from 'dotenv';
import { cookieValidationMiddleware } from './cookie/middleware/cookie-validation.middleware';
import { loggingOptionFactory } from './logging/logging-option.factory';
dotenv.config();

const fastify = Fastify({
  logger: loggingOptionFactory.options(),
});

fastify.register(cookie);
fastify.register(routes);

fastify.addHook('preHandler', cookieValidationMiddleware);

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port: port });
  } catch (e) {
    fastify.log.error(e);
    process.exit(1);
  }
};

start();
