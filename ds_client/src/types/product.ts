
export interface Product {
    id: number;
    name: string;
    category : string,
    formatted_price: string;
    price: string;
    image: string | null;
    rating: number;
    stock: number;
    isWishListed: boolean;
    avg_rating : number;
    review_count : number;
}