import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { ReviewDto } from '../../../../models/dtos/review.dto';
import { ReviewService } from '../../../../services/review.service';
import { AccountService } from '../../../../services/account.service';
import { AddReview } from './add-review/add-review';
import { RecipeDto } from '../../../../models/dtos/recipe.dto';

@Component({
  selector: 'app-recipe-reviews',
  imports: [AddReview],
  templateUrl: './recipe-reviews.html',
  styleUrl: './recipe-reviews.css'
})
export class RecipeReviews implements OnInit{
  reviews = input<ReviewDto[]>([]);
  recipe = input<RecipeDto | null>(null);

  close = output<void>();
  handleReviewChange = output<void>();

  reviewService = inject(ReviewService);
  accountService = inject(AccountService);

  currentReviews = signal<ReviewDto[]>([]);
  isAddingReview = signal<boolean>(false);

  currentUserId = computed(() => 
    this.accountService.currentUser()?.userId ?? null
  );

  canAddReview = computed(() => {
    const userId = this.currentUserId();
    if (userId === null) {
      console.log('Can add review: false (no user)');
      return false;
    }
    const result = !this.currentReviews().some(r => r.author.id === userId);
    return result;
  });

  isUserAuthor = computed(() => {
    const userId = this.currentUserId();
    const recipeAuthorId = this.recipe()?.author.id;

    if (userId === null) {
      console.log('Is user author: false (no user)');
      return false;
    }

    const result = recipeAuthorId === userId;
    return result;
  });

  ngOnInit(): void {
    this.currentReviews.set(this.reviews());
  }

  onCancel() {
    this.close.emit();
  }

  onAddReview() {
    this.isAddingReview.set(true);
  }

  onCancelReview() {
    this.isAddingReview.set(false);
  }

  onDeleteReview() {
    const reviewToDelete = this.reviews().find(r => r.author.id === this.currentUserId());
    if (!reviewToDelete) return;

    this.reviewService.deleteReview(reviewToDelete.id).subscribe({
      next: () => {
        this.handleReviewChange.emit();
        this.currentReviews.set(this.currentReviews().filter(r => r.id !== reviewToDelete.id))
      }
    });
  }

  handleNewReview(event: ReviewDto) {
    this.handleReviewChange.emit();
    this.isAddingReview.set(false);
    this.currentReviews.set([...this.currentReviews(), event])
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