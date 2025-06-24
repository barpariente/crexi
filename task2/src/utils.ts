import type { MontoQuery} from "./types.ts";
import type { SortDirection } from 'mongodb';

export function filterQuery(query: MontoQuery){
    
    // const {stateCode} = query;
    const filter: MontoQuery = {};
    
    if (query.stateCode) {
        filter.stateCode = query.stateCode;
    } 

    // const {price} = query as MontoQuery;
    if (query['price.gt']) filter['price.gt'] = query['price.gt'];
    if (query['price.lt']) filter['price.lt'] = query['price.lt'];
    if (query['price.gte']) filter['price.gte'] = query['price.gte'];
    if (query['price.lte']) filter['price.lte'] = query['price.lte'];


    // const {createdAt} = query as MontoQuery;   
    if (query['createdAt.gt']) filter['createdAt.gt'] = query['createdAt.gt'];
    if (query['createdAt.lt']) filter['createdAt.lt'] = query['createdAt.lt'];
    if (query['createdAt.gte']) filter['createdAt.gte'] = query['createdAt.gte'];
    if (query['createdAt.lte']) filter['createdAt.lte'] = query['createdAt.lte'];

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
    'price.gt': "1000",
    'createdAt.gt': '2023-01-01'
  });
  