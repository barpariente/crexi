export type CrexiProperty = {
    // @TODO missing implementation
    activatedOn: string;
    askingPrice: number;
    brokerTeamLogoUrl: string;
    brokerageName: string;
    description: string;
    hasFlyer: boolean;
    hasOM: boolean;
    hasVideo: boolean;
    hasVirtualTour: boolean;
    id: number;
    isInOpportunityZone: boolean;
    locations: {
        address: string;
        city: string;
        county: string;
        fullAddress: string;
        latitude: number;
        longitude: number;
        state: {
            code: string;
            name: string;
        };
        zip: string;
    }[];
    name: string;
    numberOfGalleryItems: number;
    numberOfImages: number;
    recommId: string;
    showCountdownAsDate: boolean;
    squareFootage: number;
    status: string;
    thumbnailUrl: string;
    types: string[];
    updatedOn: string;
    urlSlug: string;
    userIsAssetOwner: boolean;
}

export type MontoProperty = {
    id: string;
    name: string;
    price: number;
    types: string[];
    location: string;
    status: string;
    imageUrl: string;
}

