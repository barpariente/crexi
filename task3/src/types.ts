
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

export type MontoSort = {
sortBy?: string;
sortOrder?: string; 
}

export type MontoQuery = {
stateCode?: string;
'price.gt'?: string;
'price.gte'?: string;
'price.lt'?: string;
'price.lte'?: string;
'createdAt.gt'?: string;
'createdAt.gte'?: string;
'createdAt.lt'?: string;
'createdAt.lte'?: string;
sortBy?: string;
sortOrder?: string;
count?: string;
offset?: string;
}

export const montoPropertySchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    price: { type: 'number' },
    types: { type: 'array', items: { type: 'string' } },
    location: { type: 'string' },
    stateCode: { type: 'string' },
    status: { type: 'string' },
    imageUrl: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'name', 'price', 'types', 'location', 'stateCode', 'status', 'imageUrl', 'createdAt'],
  additionalProperties: false
};
