import { HttpClient } from "@angular/common/http";
import { inject, Injectable, OnInit, signal } from "@angular/core";
import { RecipeDto } from "../models/dtos/recipe.dto";
import { tap } from "rxjs";
import { PageResponse } from "../models/responses/page.response";
import { CreateRecipeDto } from "../models/dtos/create-recipe.dto";

@Injectable({
    providedIn: 'root'
})
export class RecipeService{
    http = inject(HttpClient)

    pageData = signal<PageResponse<RecipeDto> | null>(null)

    private baseUrl = 'http://localhost:8080/api/recipe'

    loadRecipes(sortBy: string, sortDirection: string, page: number) {
        return this.http.get<PageResponse<RecipeDto>>(`${this.baseUrl}?sortBy=${sortBy}&sortDirection=${sortDirection}&limit=6&pageNumber=${page}`).pipe(
            tap(response => {
                this.pageData.set(response)
            })
        )
    }

    addRecipe(formData: FormData) {
        return this.http.post<RecipeDto>(`${this.baseUrl}`, formData).pipe(
            tap(response => {
                
            })
        )
    }

    deleteRecipe(recipeId: number) {
        return this.http.delete(`${this.baseUrl}/${recipeId}`).pipe(
            tap(response => {
                
            })
        )
    }
}