import { CrexiScraper } from './src/scraper';

(async () => {
    /**
     * Example Place ID for Seattle, WA;
     * https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
     */
    const placeId = "ChIJVTPokywQkFQRmtVEaUZlJRA"
    
    const scraper = new CrexiScraper();
    const properties = await scraper.scrape(placeId);
    console.log(properties);

    return properties;
})().catch(error => {
    console.error(error);
});
