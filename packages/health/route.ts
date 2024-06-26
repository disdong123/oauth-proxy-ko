import { FastifyInstance } from 'fastify';

const route = async (fastify: FastifyInstance) => {
  fastify.get('/', (req, res) => {
    // TODO
    //  콜백이 정상적으로 수행되면 upstream 으로 포워딩하는게 아니라 클라이언트에게 응답을 주는게 맞는것같다.
    return 'ok';
  });
};

export default route;
