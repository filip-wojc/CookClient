import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateProductDto } from '../../../models/dtos/create-product.dto';
import { CreateRecipeDto } from '../../../models/dtos/create-recipe.dto';
import { RecipeService } from '../../../services/recipe.service';
import { ToastrService } from 'ngx-toastr';
import { RecipeDto } from '../../../models/dtos/recipe.dto';

@Component({
  selector: 'app-add-recipe',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-recipe.html',
  styleUrl: './add-recipe.css'
})
export class AddRecipe {
  isAdding = input<boolean>()
  recipeToModify = input<RecipeDto | null>()

  close = output<void>()
  recipeAdded = output<void>()

  recipeName = signal<string>('')
  recipeDescription = signal<string>('')
  recipeDifficulty = signal<string>('')
  recipeCalories = signal<number>(0)
  products = signal<CreateProductDto[]>([])
  selectedImage = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  imageFileName = signal<string>('');
  isSubmitting = signal<boolean>(false)

  recipeService = inject(RecipeService)
  toastr = inject(ToastrService)

  constructor(){
    effect(() => {
       const recipe = this.recipeToModify();
      
      if (recipe) {
        this.recipeName.set(recipe.name || '');
        this.recipeDescription.set(recipe.description || '');
        this.recipeDifficulty.set(recipe.difficulty || '');
        this.recipeCalories.set(recipe.calories || 0);
        
        if (recipe.products && recipe.products.length > 0) {
          this.products.set(recipe.products.map(p => ({ name: p.name || '' })));
        } else {
          this.products.set([{ name: '' }]);
        }
        
        if (recipe.imageUrl) {
          this.imagePreview.set(recipe.imageUrl);
          this.imageFileName.set('Current image');
        }
      } else {
        this.resetForm();
      }
    });
  }

  resetForm() {
    this.recipeName.set('');
    this.recipeDescription.set('');
    this.recipeDifficulty.set('');
    this.recipeCalories.set(0);
    this.products.set([{ name: '' }]);
    this.clearImage();
  }

  onClose() {
    this.close.emit()
  }

  addProduct() {
  this.products.update(products => [...products, { name: '' }]);
}

removeProduct(index: number) {
  if (this.products().length <= 1) {
    return;
  }
  
  this.products.update(products => 
    products.filter((_, i) => i !== index)
  );
}

isFormValid(): boolean {
  const hasName = this.recipeName().trim().length > 0;
  const hasDescription = this.recipeDescription().trim().length > 0;
  const hasDifficulty = this.recipeDifficulty().length > 0;
  const hasCalories = this.recipeCalories() !== null && this.recipeCalories()! > 0;
  
  const hasValidProducts = this.products().length > 0 && 
                           this.products().every(p => p.name.trim().length > 0);
  
  return hasName && hasDescription && hasDifficulty && hasCalories && hasValidProducts;
  
 }

  onCaloriesChange(event: Event){
  const input = event.target as HTMLInputElement;
  let value = input.value;
  
  value = value.replace(/\D/g, '');
  
  value = value.replace(/^0+/, '');
  
  if (value.length > 6) {
    value = value.slice(0, 6);
  }
  
  input.value = value;
  this.recipeCalories.set(parseInt(value));
  }

  onSubmit() {
    const createRecipeDto: CreateRecipeDto = {
      name: this.recipeName(),
      description: this.recipeDescription(),
      calories: this.recipeCalories(),
      difficulty: this.recipeDifficulty(),
      products: this.products()
    }

    const jsonName = this.isAdding() ? 'createRecipeDto' : 'updateRecipeDto' 

    const formData = new FormData()
    formData.append(jsonName, new Blob([JSON.stringify(createRecipeDto)], {
    type: 'application/json'
    }));
  
    if (this.selectedImage()) {
    formData.append('image', this.selectedImage()!);
    }
    
    this.isSubmitting.set(true)
    if (this.isAdding()) {
        this.recipeService.addRecipe(formData).subscribe({
      next: (response) => {
        this.isSubmitting.set(false)
        this.recipeAdded.emit()
        this.toastr.success(`recipe added! ${response.name}`)
        this.onClose()
      },
      error: (error) => {
        this.isSubmitting.set(false)
        this.toastr.error(`error: ${error.error.message}`)
      }
    })
  } else {
    this.recipeService.modifyRecipe(formData, this.recipeToModify()!.id).subscribe({
      next: (response) => {
        this.isSubmitting.set(false)
        this.recipeAdded.emit()
        this.toastr.success(`recipe modified! ${response.name}`)
        this.onClose()
      },
      error: (error) => {
        this.isSubmitting.set(false)
        this.toastr.error(`error: ${error.error.message}`)
      }
    })
  }  
}


  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) {
      this.clearImage();
      return;
    }

    if (!file.type.startsWith('image/')) {
      console.error('Selected file is not an image');
      this.clearImage();
      return;
    }

    const maxSizeInMB = 10;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      console.error(`File too large. Max size: ${maxSizeInMB}MB`);
      this.clearImage();
      return;
    }

    this.selectedImage.set(file);
    this.imageFileName.set(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview.set(e.target?.result as string);
    };
    reader.onerror = () => {
      console.error('Failed to read file');
      this.clearImage();
    };
    reader.readAsDataURL(file);
  }

  clearImage() {
    this.selectedImage.set(null);
    this.imagePreview.set(null);
    this.imageFileName.set('');
    
    const input = document.getElementById('recipe-image') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
}
