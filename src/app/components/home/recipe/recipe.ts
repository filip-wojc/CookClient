import { Component, input, output, signal } from '@angular/core';
import { RecipeDto } from '../../../models/dtos/recipe.dto';
import { NgClass, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-recipe',
  imports: [NgClass, TitleCasePipe],
  templateUrl: './recipe.html',
  styleUrl: './recipe.css'
})
export class Recipe {
    recipe = input.required<RecipeDto>()

    showDetails = output<number>()
    showReviews = output<number>()
    

    getDifficultyClass(): string {
    const difficulty = this.recipe().difficulty.toLowerCase();
    return `difficulty-${difficulty}`;
  }

  getDifficultyIcon(): string {
    const difficulty = this.recipe().difficulty.toLowerCase();
    switch (difficulty) {
      case 'easy':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'hard':
        return '🔴';
      default:
        return '⚪';
    }
  }

  getRatingStars() {
  const rating = this.recipe().rating;
  const stars = [];
  const fullStars = Math.floor(rating / 2); 
  const hasHalfStar = (rating % 2) >= 1;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push({ icon: '★', class: 'filled' });
  }
  
  if (hasHalfStar) {
    stars.push({ icon: '★', class: 'half' });
  }
  
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push({ icon: '★', class: 'empty' });
  }
  
  return stars;
}

  showRecipeReviews(){
    this.showReviews.emit(this.recipe().id)
  }

  onShowDetails() {
    this.showDetails.emit(this.recipe().id)
  }
  
}
