import { CreateProductDto } from "./create-product.dto";

export interface CreateRecipeDto {
    name: string,
    description: string,
    difficulty: string,
    calories: number,
    products: CreateProductDto[]
}