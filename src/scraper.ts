import { CrexiProperty, MontoProperty } from "./types";
import { PORTAL_NAME, ROOT_URL } from './constants';
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
        let properties = [];

        properties = await searchCrexiProperties(this.#rootUrl, placeId);
        

        console.info(`${this.#name} scraper ended.`);
        return properties.map(property => mapMontoProperty(property));
    }
}
