
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