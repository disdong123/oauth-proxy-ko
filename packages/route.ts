import { FastifyInstance } from 'fastify';
import HealthRoute from './health/route';

export const routes = async (fastify: FastifyInstance) => {
  await fastify.register(HealthRoute, { prefix: '/health' });
  await fastify.register(HealthRoute, { prefix: '/login-complete' });
  await fastify.register(HealthRoute, { prefix: '/callback' });
};
