import { FastifyInstance } from 'fastify';

const route = async (fastify: FastifyInstance) => {
  fastify.get('/', (req, res) => {
    return 'ok';
  });
};

export default route;
