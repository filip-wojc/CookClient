import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../../../services/review.service';
import { CreateReviewDto } from '../../../../../models/dtos/create-review.dto';
import { ReviewDto } from '../../../../../models/dtos/review.dto';

@Component({
  selector: 'app-add-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-review.html',
  styleUrl: './add-review.css'
})
export class AddReview {
  selectedRating = signal(0);
  reviewTitle = signal('');
  reviewContent = signal('');
  isFormValid = signal(false);

  recipeId = input<number>(0)

  cancelReview = output<void>()
  onNewReview = output<ReviewDto>()

  reviewService = inject(ReviewService)

  constructor() {
    effect(() => {
      this.reviewTitle();
      this.reviewContent();
      this.selectedRating();
      this.validateForm();
    });
  }
  
  setRating(rating: number) {
    this.selectedRating.set(rating);
    this.validateForm();
  }
  
  validateForm() {
    const isValid = 
      this.selectedRating() > 0 &&
      this.reviewTitle().trim().length >= 1 &&
      this.reviewContent().trim().length >= 1;
    
    this.isFormValid.set(isValid);
  }

  onCancelReview() {
    this.cancelReview.emit()
  }

  onSubmitReview() {
    const createDto: CreateReviewDto = {
      title: this.reviewTitle(),
      reviewContent: this.reviewContent(),
      rating: this.selectedRating()
    }
    this.reviewService.addReview(this.recipeId(), createDto).subscribe({
      next: (response: ReviewDto) => {
        this.onNewReview.emit(response)
      }
    })
  }
}
