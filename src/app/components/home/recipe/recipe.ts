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

  showRecipeReviews(){
    alert("To do recipe detail page")
  }

  onShowDetails() {
    this.showDetails.emit(this.recipe().id)
  }
  
}
