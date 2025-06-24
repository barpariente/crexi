import Fastify from 'fastify';
import type { FastifyReply, FastifyRequest } from 'fastify';
import fastifyMongoDb, { ObjectId } from '@fastify/mongodb';
import type { MontoProperty, MontoQuery} from './types.ts';
import { montoPropertySchema } from './types.ts';
import { filterQuery, sortQuery } from './utils.ts';
import type { WithId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const fastify = Fastify({
    logger: true
});

fastify.register(fastifyMongoDb, {
    url: process.env.MONGO_URL 
});

export const handlerGet = async (
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
    
    return {
        data: properties,
        total: properties.length
    };
};

export const handlerPut = async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<MontoProperty>;
    }>,
    reply: FastifyReply
  ) => {
    //check if the database is connected
    if (!fastify.mongo.db) {
        return reply.code(500).send();
    }
    const { id } = request.params;
    const property = request.body;
    try {
        const result = await fastify.mongo.db
        .collection<MontoProperty>('properties')
        .updateOne({ _id: new ObjectId(id) }, 
        { $set: property });
        
        if (result.matchedCount === 0) return reply.code(404).send({ message: "Property not found" });
        
        const updatedProperty = await fastify.mongo.db.collection<MontoProperty>('properties')
        .findOne({ _id: new ObjectId(id) });

        return reply.code(200).send(updatedProperty);

    } catch(error){
        reply.code(400).send({
            message: "Invalid request body/validation errors"
        })
    }
};

export const handlerPost = async (
    request: FastifyRequest<{
      Body: MontoProperty;
    }>,
    reply: FastifyReply
  ) => {
    
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

};

export const handlerDelete = async (
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;

  if (!fastify.mongo.db) {
    return reply.code(500).send({
      error: "Server Error",
      message: "Database not connected",
      statusCode: 500
    });
  }

  try {
    const result = await fastify.mongo.db
      .collection<MontoProperty>('properties')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return reply.code(404).send({
        error: "Not Found",
        message: `Property with ID ${id} not found`,
        statusCode: 404
      });
    }

    return reply.code(200).send({
      message: "Property deleted successfully"
    });
  } catch (error) {
    return reply.code(400).send({
      error: "Bad Request",
      message: "Invalid property ID",
      statusCode: 400
    });
  }
};

export const schemaGet = {
    querystring: {
        type: "object",
        properties: montoPropertySchema.properties,
        additionalProperties: false
    }
};

export const schemaGetResponse = {
    200: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    price: { type: "number" },
                    types: { type: "array", items: { type: "string" } },
                    location: { type: "string" },
                    stateCode: { type: "string" },
                    status: { type: "string" },
                    imageUrl: { type: "string" },
                    createdAt: { type: "string", format: "date-time" }
                },
                required: ["id", "name", "createdAt"]
            }
          },
          total: { type: "integer" }
        },
        required: ["data", "total"]
      }
};

export const schemaPut = {
    params: {
        type: "object",
        properties: {
          id: { type: "string" }
        },
        required: ["id"]
      },
    
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          price: { type: "number" },
          types: { type: "array", items: { type: "string" } },
          location: { type: "string" },
          stateCode: { type: "string" },
          status: { type: "string" },
          imageUrl: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        },
        additionalProperties: false
      },
    
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            price: { type: "number" },
            types: { type: "array", items: { type: "string" } },
            location: { type: "string" },
            stateCode: { type: "string" },
            status: { type: "string" },
            imageUrl: { type: "string" },
            createdAt: { type: "string", format: "date-time" }
          },
          required: [
            "id",
            "name",
            "price",
            "types",
            "location",
            "stateCode",
            "status",
            "imageUrl",
            "createdAt"
          ]
        },
    
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
            statusCode: { type: "integer" }
          },
          required: ["error", "message", "statusCode"]
        },
    
        404: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
            statusCode: { type: "integer" }
          },
          required: ["error", "message", "statusCode"]
        }
      }
};

export const schemaPost = {
    body: montoPropertySchema,
    required: ["name", "types", "location", "stateCode", "status", "imageUrl"],
    additionalProperties: false,
    response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string" }, 
            name: { type: "string" },
            price: { type: "number" },
            types: { type: "array", items: { type: "string" } },
            location: { type: "string" },
            stateCode: { type: "string" },
            status: { type: "string" },
            imageUrl: { type: "string" },
            createdAt: { type: "string", format: "date-time" } 
          },
          required: [
            "id",
            "name",
            "price",
            "types",
            "location",
            "stateCode",
            "status",
            "imageUrl",
            "createdAt"
          ]
        },
    
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
            statusCode: { type: "integer" }
          },
          required: ["error", "message", "statusCode"]
        }
      }
    };

export const schemaDelete = {
    params: {
        type: "object",
        properties: {
          id: { type: "string" }
        },
        required: ["id"]
      },
    
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" }
          },
          required: ["message"]
        },
    
        404: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
            statusCode: { type: "integer" }
          },
          required: ["error", "message", "statusCode"]
        }
      }
    };
