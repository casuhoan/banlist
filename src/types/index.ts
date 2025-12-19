export interface Format {
    id: string;
    name: string;
    description: string;
    rules: string;
    bannedCards: string[];
    unbannedCards?: string[];
}

export interface ScryfallCard {
    id: string;
    name: string;
    image_uris?: {
        small: string;
        normal: string;
        large: string;
        png: string;
        art_crop: string;
        border_crop: string;
    };
    mana_cost?: string;
    type_line?: string;
    oracle_text?: string;
}
