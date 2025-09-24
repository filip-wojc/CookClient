import { Component, inject, input, output, signal } from '@angular/core';
import { RecipeDto } from '../../../../models/dtos/recipe.dto';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../../services/account.service';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../../../../services/recipe.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recipe-details',
  imports: [CommonModule],
  templateUrl: './recipe-details.html',
  styleUrl: './recipe-details.css'
})
export class RecipeDetails {
  close = output<void>()
  recipeDeleted = output<number>()
  onModifyRecipe = output<RecipeDto>()

  recipe = input<RecipeDto | null>(null)

  accountService = inject(AccountService)
  http = inject(HttpClient)
  recipeService = inject(RecipeService)
  toastr = inject(ToastrService)

  isDeleting = signal<boolean>(false)

  onCancel() {
    this.close.emit()
  }
  onImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/recipe_placeholder.jpg';
 }

 isUserAuthor(){
  const currUserId = this.accountService.currentUser()?.userId
  if (currUserId) {
    return currUserId === this.recipe()?.author.id
  }
  return false
 }

 deleteRecipe(){
  this.isDeleting.set(true)
  const recipeId = this.recipe()!.id
  this.recipeService.deleteRecipe(recipeId).subscribe({
    next: () => {
      this.isDeleting.set(false)
      this.close.emit()
      this.recipeDeleted.emit(recipeId)
      this.toastr.success("Recipe deleted!")
    },
    error: (error) => {
      this.isDeleting.set(false)
      this.toastr.error(`Error while deleting recipe: ${error.error.message}`)
    }
  })
 }

 modifyRecipe() {
  this.onModifyRecipe.emit(this.recipe()!)
 }
}
