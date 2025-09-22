import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { PageResponse } from "../models/responses/page.response";
import { ReviewDto } from "../models/dtos/review.dto";
import { tap } from "rxjs";
import { CreateReviewDto } from "../models/dtos/create-review.dto";

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    http = inject(HttpClient)

    pageData = signal<PageResponse<ReviewDto> | null>(null)

    private baseUrl = 'http://localhost:8080/api/review'

    loadReviews(recipeId:number, sortDirection: string, page: number) {
            return this.http.get<PageResponse<ReviewDto>>(`${this.baseUrl}/recipe/${recipeId}?sortDirection=${sortDirection}&limit=10&pageNumber=${page}`).pipe(
                tap(response => {
                    this.pageData.set(response)
                })
            )
        }

    
    addReview(recipeId: number, dto: CreateReviewDto) {
        return this.http.post<ReviewDto>(`${this.baseUrl}/recipe/${recipeId}`, dto).pipe(
            tap(Response => {
                
            })
        )
    }

    deleteReview(reviewId: number) {
        return this.http.delete<PageResponse<ReviewDto>>(`${this.baseUrl}/${reviewId}`).pipe(
                tap(response => {
                    
                })
            )
    }

}