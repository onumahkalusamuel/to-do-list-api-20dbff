import Fastify from 'fastify'
import cors from '@fastify/cors';
import routes from "./routes.js";
import * as fastifyJwt from '@fastify/jwt';

const fastify = Fastify({logger: true});
await fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})

fastify.register(fastifyJwt, {secret: 's3cr3t'})

// JWT verification middleware
fastify.decorate("authenticate", async function (request, reply) {
    try {
        // Automatically verifies and decodes the JWT and attaches it to request.user
        console.log(request.headers.authorization);
        await request.jwtVerify();
    } catch (err) {
        reply.code(401).send({error: 'Unauthorized'});
    }
});
// articles route
fastify.register(routes);

// Run the server!
fastify.listen({port: 3000}, function (err) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})