import fastify, { FastifyInstance } from 'fastify';

export const route = async (fastify: FastifyInstance) => {
  fastify.get('/oauth', () => {});
};
