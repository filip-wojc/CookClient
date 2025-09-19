import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ReviewDto } from '../../../../models/dtos/review.dto';
import { ReviewService } from '../../../../services/review.service';
import { AccountService } from '../../../../services/account.service';
import { RecipeService } from '../../../../services/recipe.service';

@Component({
  selector: 'app-recipe-reviews',
  imports: [],
  templateUrl: './recipe-reviews.html',
  styleUrl: './recipe-reviews.css'
})
export class RecipeReviews implements OnInit{
  ngOnInit(): void {
    this.currentReviews.set(this.reviews())
    this.checkIfAddingReviewIsPossible()
  }

  close = output<void>()
  reviews = input<ReviewDto[]>([])
  currentReviews = signal<ReviewDto[]>([])

  reviewService = inject(ReviewService)
  accountService = inject(AccountService)
  recipeService = inject(RecipeService)

  canAddReview = signal<boolean>(false)


  onCancel() {
    this.close.emit()
  }

  onAddReview() {
    alert("add review in progress")
  }

  checkIfAddingReviewIsPossible() {
    const loggedUserId = this.accountService.currentUser()?.userId
    const result = !this.reviews().some(r => r.author.id === loggedUserId)
    result ? this.canAddReview.set(true) : this.canAddReview.set(false)
  }

  onDeleteReview() {
    const loggedUserId = this.accountService.currentUser()?.userId
    const reviewToDelete = this.reviews().find(r => r.author.id === loggedUserId)
    this.reviewService.deleteReview(reviewToDelete!.id).subscribe({
      next: () => {
        this.currentReviews.set(this.currentReviews().filter(r => r.id !== reviewToDelete!.id))
        this.recipeService.loadRecipes("NAME", "ASC", 0).subscribe()
        this.canAddReview.set(true)
      }
    })
  }

  getRatingStars(rating: number): boolean[] {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    
    for (let i = 0; i < 5; i++) {
      stars.push(i < fullStars);
    }
    
    return stars;
  }

  getAverageRating(): string {
    if (this.reviews().length === 0) return '0.0';
    
    const sum = this.reviews().reduce((acc, review) => acc + review.rating, 0);
    const avg = sum / this.reviews().length;
    return avg.toFixed(1);
  }

  getMostCommonRating(): string {
    if (this.reviews().length === 0) return '-';
    
    const ratingCounts: { [key: number]: number } = {};
    this.reviews().forEach(review => {
      const starRating = Math.floor(review.rating / 2);
      ratingCounts[starRating] = (ratingCounts[starRating] || 0) + 1;
    });
    
    const mostCommon = Object.entries(ratingCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    const stars = '★'.repeat(parseInt(mostCommon[0])) + '☆'.repeat(5 - parseInt(mostCommon[0]));
    return stars;
  }
}
