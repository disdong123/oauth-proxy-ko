import Fastify from 'fastify';
import routes from './route';
import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix';
import { container } from './core/container';

const fastify = Fastify({ logger: true });

fastify.register(routes);
fastify.register(fastifyAwilixPlugin, {
  disposeOnClose: true,
  disposeOnResponse: true,
  strictBooleanEnforced: true,
});

const start = async () => {
  try {
    await fastify.listen({ port: 8080 });
    container.cradle.kakaoService.get();
    console.log('start');
  } catch (e) {
    fastify.log.error(e);
    process.exit(1);
  }
};

start();
