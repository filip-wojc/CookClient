import { HttpClient } from "@angular/common/http";
import { inject, Injectable, OnInit, signal } from "@angular/core";
import { RecipeDto } from "../models/dtos/recipe.dto";
import { tap } from "rxjs";
import { PageResponse } from "../models/responses/page.response";

@Injectable({
    providedIn: 'root'
})
export class RecipeService{
    http = inject(HttpClient)

    recipes = signal<RecipeDto[] | null>(null)

    private baseUrl = 'http://localhost:8080/api/recipe'

    loadRecipes() {
        return this.http.get<PageResponse<RecipeDto>>(`${this.baseUrl}?sortBy=CALORIES&sortDirection=DESC&limit=10&pageNumber=0`).pipe(
            tap(response => {
                this.recipes.set(response.content)
            })
        )
    }
}