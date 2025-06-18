# monto-code-test

TypeScript & Fetch API Code Test for Monto.

## Instructions

1. searchCrexiProperties function should be implemented in `src/crexi.ts`. The data should be fetched from the Crexi API using the provided `placeId` and page number.<br><br> 
2. CrexiProperty type should be defined in `src/crexi.ts`. It should match the structure of the data returned by the Crexi API.<br><br>
3. mapMontoProperty function should be implemented in `src/monto.ts`. The Crexi data format should be mapped to the Monto format.<br><br>
4. scrape method should be implemented in `src/scraper.ts`. It should use the `searchCrexiProperties` and `mapMontoProperty` functions to scrape the first 1500 results (API Crexi Limit) properties from Crexi and return them in the Monto format.<br><br>
5. Remember to handle errors and edge cases, such as API rate limits or empty responses.<br><br>
