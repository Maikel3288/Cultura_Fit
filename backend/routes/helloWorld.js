async function helloWorld (fastify, options) {
    fastify.get('/', async (request, reply) => {
    return { hello: 'hola world' };
    });
}
export default helloWorld;