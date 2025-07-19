import authenticate from './authenticate.js'

// const publicRoutes = ['/register'];

// // fastify.addHook('preHandler', async (req, reply) => {
// //   const url = request.routerPath || request.raw.url;
// //   console.log('Ruta detectada:', url);

// //   if (publicRoutes.some(r => url.startsWith(r))) return;

// //   const result = await authenticate(req, reply);
      
// //   if (!result) {
// //       return reply.code(401).send({ message: 'Error en la autenticación'});
// //   }

// //   req.user = result; 
  
// // });