import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { RecipeDto } from '../../models/dtos/recipe.dto';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from './recipe/recipe';
import { FormsModule } from '@angular/forms';
import { RecipeDetails } from './recipe/recipe-details/recipe-details';
import { RecipeReviews } from './recipe/recipe-reviews/recipe-reviews';
import { ReviewDto } from '../../models/dtos/review.dto';
import { ReviewService } from '../../services/review.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddRecipe } from './add-recipe/add-recipe';

@Component({
  selector: 'app-home',
  imports: [Recipe, FormsModule, RecipeDetails, RecipeReviews, AddRecipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{
   ngOnInit(): void {
    
    var token = this.accountService.getToken()
    console.log(token)
    if (token) {
      this.accountService.refreshToken().subscribe()
    }
    this.recipeService.loadRecipes(this.sortBy(), this.sortDirection(), 0).subscribe()
   }

   sortBy = signal<string>('NAME');
   sortDirection = signal<string>('ASC');
   newPage = signal<number>(0)

   recipeToShowDetails = signal<RecipeDto | null>(null)
   reviewsToShow = signal<ReviewDto[]>([])

   recipeService = inject(RecipeService)
   reviewService = inject(ReviewService)
   accountService = inject(AccountService)
   router = inject(Router)
   toastr = inject(ToastrService)

   isShowingDetails = signal<boolean>(false)
   isShowingReviews = signal<boolean>(false)
   isAddingRecipe = signal<boolean>(false)
   recipeForReviews = signal<RecipeDto | null>(null)

   


   refreshRecipeRating() {
    this.recipeService.loadRecipes(this.sortBy(), this.sortDirection(), this.newPage()).subscribe()
    this.reviewService.loadReviews(this.recipeForReviews()!.id, 'ASC', 0).subscribe()
   }

   onSortChange() {
    console.log('Sort changed:', {
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection()
    });
    
    this.recipeService.loadRecipes(this.sortBy(), this.sortDirection(), this.newPage()).subscribe()
  }

  onPageChange(newPage: number) {
    console.log('Changing to page:', newPage);
    
    const pageData = this.recipeService.pageData();
    if (!pageData) return;
    
    if (newPage < 0 || newPage >= pageData.totalPages) {
      console.warn('Invalid page number:', newPage);
      return;
    }

    this.newPage.set(newPage)
    
    this.recipeService.loadRecipes(
      this.sortBy(),
      this.sortDirection(),
      this.newPage()
    ).subscribe({
      next: (response) => {
        console.log('Page changed successfully:', response);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.error('Failed to change page:', error);
      }
    });
  }
  
  getVisiblePages(): number[] {
    const pageData = this.recipeService.pageData();
    if (!pageData) return [];
    
    const currentPage = pageData.page;
    const totalPages = pageData.totalPages;
    const visiblePageCount = 5;
    
    let startPage = Math.max(0, currentPage - Math.floor(visiblePageCount / 2));
    let endPage = Math.min(totalPages - 1, startPage + visiblePageCount - 1);
    

    if (endPage - startPage + 1 < visiblePageCount) {
      startPage = Math.max(0, endPage - visiblePageCount + 1);
    }
    
    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  goToFirstPage() {
    this.onPageChange(0);
  }
  
  goToLastPage() {
    const pageData = this.recipeService.pageData();
    if (pageData) {
      this.onPageChange(pageData.totalPages - 1);
    }
  }
  
  goToPreviousPage() {
    const pageData = this.recipeService.pageData();
    if (pageData && pageData.page > 0) {
      this.onPageChange(pageData.page - 1);
    }
  }
  
  goToNextPage() {
    const pageData = this.recipeService.pageData();
    if (pageData && pageData.hasNext) {
      this.onPageChange(pageData.page + 1);
    }
  }

  onShowDetails(event: number){
    this.isShowingDetails.set(true)
    this.recipeToShowDetails.set(this.recipeService.pageData()?.content.find(r => r.id === event)!)
  }

  onCloseDetails() {
    this.isShowingDetails.set(false)
  }

  onShowReviews(event: RecipeDto) {
    this.reviewService.loadReviews(event.id, 'ASC', 0).subscribe({
        next: () => {
            this.reviewsToShow.set(this.reviewService.pageData()?.content || [])
            this.isShowingReviews.set(true)
            this.recipeForReviews.set(event)
        },
        error: (error) => {
            console.error('Error loading reviews:', error)
        }
    })
}

  onCloseReviews() {
    this.isShowingReviews.set(false)
  }

  onAddRecipe() {
    this.isAddingRecipe.set(true)
  }

  onCloseAddingRecipe() {
    this.isAddingRecipe.set(false)
  }
}
