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

export type MontoFilter = {
    stateCode?: string, 
    price?: {
      gt?: number, 
      lte?: number, 
      gte?: number, 
      lt?: number}, 
    createdAt?: {
      gt?: string, 
      lte?: string, 
      gte?: string, 
      lt?: string}
  };

export type MontoSort = {
  sortBy?: string;
  sortOrder?: string; 
}

export type MontoQuery = {
  stateCode?: string, 
    price?: {
      gt?: number, 
      lte?: number, 
      gte?: number, 
      lt?: number}, 
    createdAt?: {
      gt?: string, 
      lte?: string, 
      gte?: string, 
      lt?: string},
    sortBy?: string,
    sortOrder?: string
}