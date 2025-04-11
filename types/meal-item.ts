import { Product } from "./product";

export interface MealItem {
    id: string;
    meal_id: string;
    product_id: string;
    amount: number;
    created_at: string;
    // Optional for join queries
    product?: Product;
}