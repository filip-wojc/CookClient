import { Component, inject, OnInit, signal } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { RecipeDto } from '../../models/dtos/recipe.dto';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from './recipe/recipe';

@Component({
  selector: 'app-home',
  imports: [Recipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{
   ngOnInit(): void {
     this.recipeService.loadRecipes().subscribe()
   }
   recipeService = inject(RecipeService)
}
