import { UserDto } from "./user.dto"

export interface ReviewDto {
    id: number
    title: string
    reviewContent: string
    rating: number
    author: UserDto
    recipeId: number
}