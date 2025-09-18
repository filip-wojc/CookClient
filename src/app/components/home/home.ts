import { Component, inject, OnInit, signal } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { RecipeDto } from '../../models/dtos/recipe.dto';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from './recipe/recipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [Recipe, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{
   ngOnInit(): void {
     this.recipeService.loadRecipes(this.sortBy(), this.sortDirection(), 0).subscribe()
   }

   sortBy = signal<string>('NAME');
   sortDirection = signal<string>('ASC');
   newPage = signal<number>(0)

   recipeService = inject(RecipeService)

   onAddRecipe() {
    
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
    
    // Sprawdź czy nowa strona jest poprawna
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
        // Scroll to top po zmianie strony
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
}
