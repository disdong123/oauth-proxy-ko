import { FastifyRequest } from 'fastify';

class LoggingOptionFactory {
  private static APP_ENV = process.env.APP_ENV || 'dev';

  options() {
    switch (LoggingOptionFactory.APP_ENV) {
      case 'prod':
        return {};
      case 'local':
      case 'dev':
      default:
        return this.dev();
    }
  }

  private dev() {
    return {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
      level: 'info',
      // serializers: {
      //   req(request: FastifyRequest) {
      //     return {
      //       method: request.method,
      //       url: request.url,
      //       params: request.params,
      //       headers: request.headers,
      //     };
      //   },
      // },
    };
  }
}

export const loggingOptionFactory = new LoggingOptionFactory();
