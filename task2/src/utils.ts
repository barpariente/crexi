import type { MontoQuery, MontoProperty } from "./types.ts";
import type { SortDirection } from 'mongodb';

export function filterQuery(query: MontoQuery){
    
    // const {stateCode} = query;
    const filter: any = {};
    
    if (query.stateCode) {
        filter.stateCode = query.stateCode;
    } 

    // const {price} = query as MontoQuery;
    if (query.price) {
        filter.price = query.price;
    }

    // const {createdAt} = query as MontoQuery;   
    if (query.createdAt) {
        filter.createdAt = query.createdAt;
    }

    /*
    console.log(`query: ${query}`);
    console.log(`filter.price: ${filter.price.gt}`);
    console.log(`filter.createdAt: ${filter.createdAt}`);
    console.log(`filter.stateCode: ${filter.stateCode}`);
    */
    return filter;
}

export function sortQuery(query: MontoQuery): { [key: string]: SortDirection } {
    if (!query.sortBy) {
      return {};
    } 
    const sortOrder: SortDirection = query.sortOrder === 'desc' ? -1 : 1;
    return { [query.sortBy]: sortOrder };
  }


  //test the filterQuery function
console.log("test the filterQuery function");
  filterQuery({
    stateCode: 'NY',
    price: { gt: 1000, lte: 5000 },
    createdAt: { gte: '2023-01-01', lt: '2023-06-01' }
  });
  