import { RSS3Asset } from 'rss3-next/types/rss3';

export interface DetailedNFT {
    chain: string;
    token_id: string;
    name: string;
    description: string | null;
    image_url: string;
    image_preview_url: string;
    image_thumbnail_url: string;
    animation_url: string | null;
    animation_original_url: string | null;
    asset_contract: {
        address: string;
        created_date: string;
        symbol: string;
    };
    collection: {
        name: string;
        description: string;
        image_url: string;
    };
    traits: {
        trait_type: string;
        value: string;
        display_type: string | null;
        max_value: string | null;
        trait_count: number;
        order: string | null;
    }[];
}

export interface RSS3AssetShow extends RSS3Asset {
    image_url: string;
    order: number;
}
