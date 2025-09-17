import { Component, input } from '@angular/core';
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

}
