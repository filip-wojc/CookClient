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

    pageData = signal<PageResponse<RecipeDto> | null>(null)

    private baseUrl = 'http://localhost:8080/api/recipe'

    loadRecipes(sortBy: string, sortDirection: string, page: number) {
        return this.http.get<PageResponse<RecipeDto>>(`${this.baseUrl}?sortBy=${sortBy}&sortDirection=${sortDirection}&limit=6&pageNumber=${page}`).pipe(
            tap(response => {
                this.pageData.set(response)
            })
        )
    }
}