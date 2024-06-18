import fastify, { FastifyInstance } from 'fastify';
import HealthRoute from './health/route';

const routes = async (fastify: FastifyInstance) => {
  await fastify.register(HealthRoute, { prefix: '/health' });
};

export default routes;
