import { CrexiProperty, MontoProperty } from "./types";
import { PORTAL_NAME, ROOT_URL, ENTRIES_PER_PAGE, TIME_BETWEEN_REQUESTS } from './task1/constants';
import { mapMontoProperty, searchCrexiProperties } from './utils';

/** Class representing a Crexi scraper. */
export class CrexiScraper {
    readonly #name: string;
    readonly #rootUrl: string;

    constructor() {
        this.#name = PORTAL_NAME;
        this.#rootUrl = ROOT_URL;
    }

    async scrape(placeId: string): Promise<MontoProperty[]> {
        console.info(`${this.#name} scraper started.`);
        const properties = [];
        
        let sumPages = 0;
        let page = 1;

        while (sumPages < 1500) {
            const properties_page = await searchCrexiProperties(this.#rootUrl, placeId, page);
            
            //push properties_page to properties
            properties.push(...properties_page);
            //log the number of properties fetched
            console.log(`Fetched page ${page} with ${properties_page.length} items`);
            sumPages += properties_page.length;
            
            if (sumPages >= 1500) {
              console.log("Reached 1500 properties, stopping.");
              break;
            }
            
            /** asking Ibrahim !! 
             if (properties.length < ENTRIES_PER_PAGE) {
               console.log("Reached last page, stopping.");
               break;
             }
             if (properties.length === 0) {
               console.log("No more properties found, stopping.");
               break;
             }
             * 
             */
            page++;
            await new Promise(resolve => setTimeout(resolve, TIME_BETWEEN_REQUESTS));
        }

        //const properties = await searchCrexiProperties(this.#rootUrl, placeId);
        
        console.info(`${this.#name} scraper ended.`);
        return properties.map(property => mapMontoProperty(property));
    }
}
