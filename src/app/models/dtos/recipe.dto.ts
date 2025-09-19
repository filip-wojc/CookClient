import { ProductDto } from "./product.dto"
import { UserDto } from "./user.dto"

export interface RecipeDto {
    id: number
    name: string
    description: string
    difficulty: string
    calories: number
    rating: number
    imageUrl: string
    author: UserDto
    products: ProductDto[]
}