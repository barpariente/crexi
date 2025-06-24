import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyMongoDb, { ObjectId } from '@fastify/mongodb';
import { DEFAULT_PORT, MONGO_URL } from './src/constants.ts';
import type { MontoProperty, MontoQuery } from './src/types.ts';
import { handlerGet, schemaGet } from '../task3/src/controller.ts';
import { WithId } from 'mongodb';
import { filterQuery, sortQuery } from './src/utils.ts';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 });

const fastify = Fastify({
    logger: true
});

console.log("Loaded MONGO_URL:", process.env.MONGO_URL);

fastify.register(fastifyMongoDb, {
    url: "mongodb://localhost:27017/monto-code-test" 
});

fastify.get('/', async (
    request: FastifyRequest<{
      Querystring: { count?: string }; 
    }>,
    reply: FastifyReply
  ) => {
    if (!fastify.mongo.db) {
        return reply.code(500).send();
    }
    const { count } = request.query as { count: string };
    const {offset} = request.query as {offset: string};
    
    const query: MontoQuery = request.query as MontoQuery;
    const cacheKey = JSON.stringify(query);
    const cachedData : WithId<MontoProperty>[] = cache.get(cacheKey);
    if (cachedData) {
        return reply.code(200).send({data: cachedData, total: cachedData.length});
    }
    //get properties from the database
    const rawProperties: WithId<MontoProperty>[] = await fastify.mongo.db
        .collection<MontoProperty>('properties')
        .find(filterQuery(query))
        .skip(Number(offset))
        .limit(Number(count))
        .sort(sortQuery(query))
        .toArray();

    const properties = rawProperties.map((doc) => ({
        ...doc,
        id: doc._id.toString(),
        _id: undefined,
    }));    
    cache.set(cacheKey, properties, 300);
    return reply.code(200).send({data: properties, total: properties.length});
});

//create a new property
fastify.post('/properties', async (request, reply) => {
    
    if (!fastify.mongo.db) {
        return reply.code(500).send();
    }
    
    const property: MontoProperty = request.body as MontoProperty;
    property.createdAt = new Date();
    try {
        const result = await fastify.mongo.db
        .collection<MontoProperty>('properties')
        .insertOne(property);
        if (result.acknowledged) {
        return reply.code(201).send({
        data: property,
        message: "Property created successfully"
        }); 
        }
       
    } catch (error) {
        reply.code(400).send({
            message: "Invalid request body/validation errors"
        })
    }

});

fastify.put<{
    Params: { id: string },
    Body: Partial<MontoProperty>,
    Reply: { message: string }
    }>('/properties/:id', async (request, reply) => {
    //check if the database is connected
    if (!fastify.mongo.db) {
        return reply.code(500).send();
    }
    const { id } = request.params;
    const property = request.body;
    try {
        const result = await fastify.mongo.db
        .collection<MontoProperty>('properties')
        .updateOne({ _id: new ObjectId(id) }, { $set: property });
        
        if (result.matchedCount === 0) return reply.code(404).send({ message: "Property not found" });
        return reply.code(200).send({ message: "Property updated successfully" });
    } catch(error){
        reply.code(400).send({
            message: "Invalid request body/validation errors"
        })
    }
});

fastify.delete<{ Params: { id: string } }>('/properties/:id', async (request, reply) => {
    const id = request.params.id;
    
    fastify.mongo.db
    .collection<MontoProperty>('properties')
    .deleteOne({ _id: new ObjectId(id) })
    .then(result => {
        return reply.code(200).send({
            message: "Property deleted successfully"
        })
    })
    .catch(error => {
        return reply.code(404).send({
            message: "Property not found"
        })
    });

});

fastify.listen({ port: DEFAULT_PORT, host: 'localhost' }).then(() => {
    fastify.log.info(`Server is running on http://localhost:${DEFAULT_PORT}`);
});

