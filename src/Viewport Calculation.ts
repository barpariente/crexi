// Types for viewport calculation
interface LatLng {
    lat: number;
    lng: number;
}

interface Viewport {
    northeast: LatLng;
    southwest: LatLng;
}

export function calculateViewport(lat: number, lng: number, sizeKm: number = 10): Viewport {
    // Half the size to get radius from center
    const radiusKm = sizeKm / 2;

    // Convert kilometers to degrees
    // 1 degree latitude ≈ 111 km (constant)
    const latOffset = radiusKm / 111;

    // 1 degree longitude varies by latitude: 111 * cos(latitude)
    const lngOffset = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

    return {
        northeast: {
            lat: lat + latOffset,
            lng: lng + lngOffset
        },
        southwest: {
            lat: lat - latOffset,
            lng: lng - lngOffset
        }
    };
}
