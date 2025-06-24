import Fastify from 'fastify';
import fastifyMongoDb from '@fastify/mongodb';
import { handlerGet, schemaGet, handlerPut, schemaPut, schemaPost, handlerPost, handlerDelete, schemaDelete, schemaGetResponse } from './src/controller.ts';
import { DEFAULT_PORT } from './src/constants.ts';
import dotenv from 'dotenv';
dotenv.config();


const fastify = Fastify({
    logger: true
});

fastify.register(fastifyMongoDb, {
    url: "mongodb://localhost:27017/monto-code-test" 
}); 

//console.log("Loaded MONGO_URL:", process.env.MONGO_URL);

fastify.get('/', async (request, reply) => {
    return { data: "Hello World" };
});

fastify.get('/properties', {
    schema: {
        querystring: schemaGet.querystring,
        response: {
          200: schemaGetResponse[200]
        }
      },
    handler: handlerGet
});

fastify.put('/properties/:id', {
    handler: handlerPut,
    schema: schemaPut
});

fastify.post('/properties', {
    handler: handlerPost,
    schema: schemaPost
});

fastify.delete('/properties/:id', {
    handler: handlerDelete,
    schema: schemaDelete
});

fastify.listen({ port: DEFAULT_PORT, host: 'localhost' }).then(() => {
    fastify.log.info(`Server is running on http://localhost:${DEFAULT_PORT}`);
});