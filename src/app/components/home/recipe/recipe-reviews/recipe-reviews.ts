import { Component, input, output } from '@angular/core';
import { ReviewDto } from '../../../../models/dtos/review.dto';

@Component({
  selector: 'app-recipe-reviews',
  imports: [],
  templateUrl: './recipe-reviews.html',
  styleUrl: './recipe-reviews.css'
})
export class RecipeReviews {
   close = output<void>()
  reviews = input<ReviewDto[]>([])

  onCancel() {
    this.close.emit()
  }

  onAddReview() {
    alert("add review in progress")
  }

  getRatingStars(rating: number): boolean[] {
    const stars = [];
    const fullStars = Math.floor(rating / 2); // Konwersja z 10 na 5 gwiazdek
    
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
