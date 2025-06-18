# Node.js & RESTful APIs

## Objective

Create a web server using **Node.js**, **TypeScript**, and the **Fastify**
framework. The server should expose a main GET endpoint `/properties` to fetch
Monto properties, supporting pagination, filtering, and in-memory caching.
---

## Requirements

### 1. Project Structure
- Use **TypeScript** for all source code.
- Use **Fastify** as the web framework.
- Use **MongoDB** as database.
- Organize your code for clarity and maintainability.
- `index.ts` should be the application entrypoint (main server file)
- `src/` folder should contain all other code organization:
  - Type definitions
  - Constants
  - Utilities and helper functions
  - Any other modules
  
### 2. Property Type Definition

Define the following type in your code:
```ts
export type MontoProperty = {
  id: string;
  name: string;
  price: number;
  types: string[];
  location: string;
  stateCode: string;
  status: string;
  imageUrl: string;
  createdAt: Date;
};
```

### 3. Endpoint: GET `/properties`

Fetch properties:
- **Route:** `/properties`
- **Method:** GET
- **Query Parameters:**
  - **Pagination:**
    - `count` (number): Number of results to return (default: 10)
    - `offset` (number): Number of results to skip (default: 0)
  - **Filtering (eq, neq, gt, gte, lt, lte):**
    - `stateCode` (string, optional): Filter by property state code
    - `price` (number, optional): Filter by price
    - `createdAt` (date, optional): Filter by created at
  - **Sorting:**
    - `sortBy` (string, one of: 'createdAt', 'price'): Field to sort by
    - `sortOrder` (string, 'asc' or 'desc', default: 'asc'): Sort direction
    - Example: `/properties?sortBy=price&sortOrder=desc`
- **Response:**
  - An array of `MontoProperty` objects matching the filters and pagination
  - Total count of matching properties (for pagination)

### 4. Endpoint: POST `/properties`

Create a new property:
- **Route:** `/properties`
- **Method:** POST
- **Request Body:** `MontoProperty` object (without `id` and `createdAt` - these
  should be generated)
- **Response:** The created `MontoProperty` object with generated `id` and
  `createdAt`
- **Status Codes:**
  - `201` - Property created successfully
  - `400` - Invalid request body/validation errors

### 5. Endpoint: PUT `/properties/:id`

Update an existing property:
- **Route:** `/properties/:id`
- **Method:** PUT
- **Path Parameters:** `id` (string) - Property ID to update
- **Request Body:** Partial `MontoProperty` object (fields to update)
- **Response:** The updated `MontoProperty` object
- **Status Codes:**
  - `200` - Property updated successfully
  - `404` - Property not found
  - `400` - Invalid request body/validation errors

### 6. Endpoint: DELETE `/properties/:id`

Delete a property:
- **Route:** `/properties/:id`
- **Method:** DELETE
- **Path Parameters:** `id` (string) - Property ID to delete
- **Response:** Success message
- **Status Codes:**
  - `200` - Property deleted successfully
  - `404` - Property not found

### 7. Caching

- Cache the results of each unique search (combination of query parameters) **in
  memory** for **5 minutes**.
- If the same search is requested again within 5 minutes, return the cached
  result instead of recomputing.

### 8. Database Storage

- Store `MontoProperty` data in **MongoDB**.
- Use a MongoDB driver to interact with the database.
- Create a collection called `properties` to store the property documents.

### 9. Misc

- Add validation for query parameters (e.g., using Fastify's schema validation).
- Add TypeScript types for request and response.
- Add a README with instructions to run the project.
---

## Setup Instructions

### Prerequisites
- Node.js (v22 or higher)
- Docker (for MongoDB)

### MongoDB Setup with Docker

```bash
docker run --name mongodb -d -p 27017:27017 mongo:latest
```
## Deliverables

- Source code in a public or shared repository.

## References

- [What is a REST API? (RESTful API Tutorial)](https://restfulapi.net/)
- [HTTP Status Codes - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/en/docs)
- [Environment Variables in Node.js](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Fastify with TypeScript Guide](https://fastify.dev/docs/latest/Reference/TypeScript/#typescript)
- [Fastify Schema Validation](https://www.fastify.io/docs/latest/Validation-and-Serialization/)
- [Fastify Error Handling](https://www.fastify.io/docs/latest/Error-Handling/)
- [JSON Schema Specification](https://json-schema.org/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/current/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Hub - MongoDB](https://hub.docker.com/_/mongo)