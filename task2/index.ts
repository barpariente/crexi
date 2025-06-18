import Fastify from 'fastify';
import fastifyMongoDb, { ObjectId } from '@fastify/mongodb';
import { DEFAULT_PORT, MONGO_URL } from './src/constants.ts';
import { filterQuery, sortQuery } from './src/utils.ts';
import type { MontoProperty, MontoQuery } from './src/types.ts';
import type { WithId } from 'mongodb';

const fastify = Fastify({
    logger: true
});

console.log("Loaded MONGO_URL:", process.env.MONGO_URL);

fastify.register(fastifyMongoDb, {
    url: "mongodb://localhost:27017/monto-code-test" 
});

fastify.get('/', async (request, reply) => {
    return { data: "Hello World" };
});

//get properties with filters and sorting
// optional : get<{
//   Querystring: MontoQuery
// }>
fastify.get('/properties', async (request, reply) => {
    if (!fastify.mongo.db) {
        return reply.code(500).send();
    }
    const { count = '10' } = request.query as { count: string };
    const { offset = '0' } = request.query as { offset: string };

    //define the query type
    const query: MontoQuery = request.query as MontoQuery;
    
    //get properties from the database
    const properties: WithId<MontoProperty>[] = await fastify.mongo.db
        .collection<MontoProperty>('properties')
        .find(filterQuery(query))
        .skip(Number(offset))
        .limit(Number(count))
        .sort(sortQuery(query))
        .toArray();

   
    return {
        data: properties,
        total: properties.length
    };
});

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

fastify.put('/properties/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const property : MontoProperty = request.body as MontoProperty;
    if (!property) {
        return reply.code(404).send({
            message: "Property not found"
        })
    }
    try {
        const result = await fastify.mongo.db
        .collection<MontoProperty>('properties')
        .updateOne({ id: id }, { $set: property });
        if (result.acknowledged) {
            return reply.code(200).send({
                message: "Property updated successfully"
            })
        }
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

