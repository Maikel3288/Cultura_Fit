import authenticate from './authenticate.js'

fastify.addHook('preHandler', async (request, reply) => {
  if (request.raw.url.startsWith('/api')) {
    await authenticate(request, reply);
  }
});