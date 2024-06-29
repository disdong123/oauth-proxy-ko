import { FastifyInstance } from 'fastify';
import HealthRoute from './health/route';

export const routes = async (fastify: FastifyInstance) => {
  await fastify.register(HealthRoute, { prefix: '/health' });
  await fastify.register(RedirectRoute, { prefix: '/callback' });
};

const RedirectRoute = async (fastify: FastifyInstance) => {
  fastify.get('/', (req, res) => {
    res.status(201).send(`completed login`);
  });
};
