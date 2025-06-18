import { off } from "process";
import { CrexiProperty, MontoProperty } from "./types";
import {ENTRIES_PER_PAGE} from "./constants";
import { STATES_DATABASE } from "./States Database";
import { calculateViewport } from "./Viewport Calculation";

/**
 * Search Crexi properties by Google Place ID.
 */
export async function searchCrexiProperties(
    rootUrl: string,
    placeId: string,
    page: number = 1
  ): Promise<CrexiProperty[]> {
    
    const offset = 0 + (page - 1) * ENTRIES_PER_PAGE; 
    
    const metadata = STATES_DATABASE.find(state => state.placeId === placeId);

    if (!metadata) {
      throw new Error(`State metadata not found for placeId: ${placeId}`);
    }
    
    // Body of the request
    const body = {
      "locations": [
            {
              "placeId": metadata.placeId,
              "type": "city",
              "stateCode": metadata.code,
              "location": {
                "latitude": metadata.lat,
                "longitude": metadata.lng
                },
              "viewport": calculateViewport(metadata.lat, metadata.lng),
              "polygons": metadata.polygons
            }
        ],
      count: ENTRIES_PER_PAGE, // maximun return of the API 
      mlScenario: "Recombee-Recommendations",
      offset: offset,
      userId:
          "$device:19740755a0217f4-01588cb71d07f28-18525636-1fa400-19740755a0217f5",
      sortDirection: "Descending",
      sortOrder: "rank",
      includeUnpriced: true,
      };

  // @TODO implementation.
  
  const response = await fetch(`${rootUrl}/assets/search`, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "client-timezone-offset": "3",
      "content-type": "application/json",
      "mixpanel-distinct-id":
        "$device:19740755a0217f4-01588cb71d07f28-18525636-1fa400-19740755a0217f5",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: "https://www.crexi.com/", // maybe need to be changed
      "Referrer-Policy": "origin-when-cross-origin",
    },
    body: JSON.stringify(body),
    method: "POST",
  });
  
  if (!response.ok) throw new Error(`HTTP Error status ${response.status}`);   

  const properties = await response.json().then(json => json.data); 
  // const data = jsonData.data;
  
  //properties print test 
  //console.log(properties);
  //console.log(properties[0].locations);

  return properties;
}

/**
 * Map a raw property.
 */
export function mapMontoProperty(crexiProperty: CrexiProperty): MontoProperty {

  const montoProperty: MontoProperty = {
        id: crexiProperty.id.toString(),
        name: crexiProperty.name,
        price: crexiProperty.askingPrice,
        types: crexiProperty.types,
        location: crexiProperty.locations?.[0]?.fullAddress,
        status: crexiProperty.status,
        imageUrl: crexiProperty.thumbnailUrl,
    }
    
    return montoProperty;
}
