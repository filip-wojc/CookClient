import { Component, input, output } from '@angular/core';
import { RecipeDto } from '../../../../models/dtos/recipe.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-details',
  imports: [CommonModule],
  templateUrl: './recipe-details.html',
  styleUrl: './recipe-details.css'
})
export class RecipeDetails {
  close = output<void>()
  recipe = input<RecipeDto | null>(null)

  onCancel() {
    this.close.emit()
  }
  onImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/recipe_placeholder.jpg';
 }
}
