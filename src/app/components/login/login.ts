import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { LoginRequest } from '../../models/requests/login.request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  accountService = inject(AccountService)
  router = inject(Router)

  passwordVisible = signal<boolean>(false)
  passwordVisibleText = signal<string>('🙈')

  username = signal<string>('')
  password = signal<string>('')
  
  error = signal<string>('')

  onUsernameChange(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.username.set(value)
  }

  onPasswordChange(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.password.set(value)
  }

  onSubmitLogin() {
    const loginRequest: LoginRequest = {
      username: this.username(),
      password: this.password()
    }
    this.accountService.login(loginRequest).subscribe({
      next: () => {
        this.username.set('')
        this.password.set('')
        console.log('succesfful login')
        this.router.navigateByUrl('/home')
      },
      error: (error) => {
        this.error.set(error.error.message)
        console.log('error ' + error.error.message)
      }
    })
  }

  closeError() {
    this.error.set('')
  }

  togglePassword() {
    const passwordInput = document.getElementById('password-input')
    this.passwordVisible.set(!this.passwordVisible())
    if (this.passwordVisible()) {
      this.passwordVisibleText.set('👁️')
      passwordInput?.setAttribute('type', 'text')
    } else {
      this.passwordVisibleText.set('🙈')
      passwordInput?.setAttribute('type', 'password')
    }
  }

  changeToRegisterForm(){

  }
  
}
