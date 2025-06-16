import { CrexiScraper } from './src/scraper';

(async () => {
    /**
     * Example Place ID for Seattle, WA;
     * https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
     */
    const placeId = "ChIJ7Q6VhpPFkIgR2OLfAOKKnO8"
    
    const scraper = new CrexiScraper();
    const properties = await scraper.scrape(placeId);
    
    console.log(properties);
    console.log(`properties.length: ${properties.length}`);

    return properties;
})().catch(error => {
    console.error(error);
});
