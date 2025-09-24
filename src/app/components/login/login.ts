import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { LoginRequest } from '../../models/requests/login.request';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../models/requests/register.request';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  accountService = inject(AccountService)
  router = inject(Router)
  toastr = inject(ToastrService)

  passwordVisible = signal<boolean>(false)
  passwordVisibleText = signal<string>('🙈')

  username = signal<string>('')
  password = signal<string>('')
  error = signal<string>('')

  newUsername = signal<string>('')
  newFullname = signal<string>('')
  newPassword = signal<string>('')
  newPasswordConfirm = signal<string>('')

  isRegistering = signal<boolean>(false)

  onUsernameChange(event: Event) {
    const value = (event.target as HTMLInputElement).value
    if (this.isRegistering()) {
      this.newUsername.set(value)
    } else {
      this.username.set(value)
    }
    
  }

  onPasswordChange(event: Event) {
    const value = (event.target as HTMLInputElement).value
    if (this.isRegistering()) {
      this.newPassword.set(value)
    } else {
      this.password.set(value)
    }  
  }

  onConfirmPasswordChange(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.newPasswordConfirm.set(value)
  }

  onFullnameChange(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.newFullname.set(value)
  }

  onSubmit() {
    if (this.isRegistering()) {
      this.register()
    } else {
      this.login()
    }
  }

  private register() {
    const registerRequest: RegisterRequest = {
        username: this.newUsername(),
        password: this.newPassword(),
        fullname: this.newFullname()
      }

      this.accountService.register(registerRequest).subscribe({
      next: () => {
        this.toastr.success('New account created!')
        this.newUsername.set('')
        this.newPassword.set('')
        this.newPasswordConfirm.set('')
        this.newFullname.set('')
        this.isRegistering.set(false)
      },
      error: (error) => {
        this.error.set(error.error.message)
        console.log('error ' + error.error.message)
      }
    })
  }

  private login() {
    const loginRequest: LoginRequest = {
      username: this.username(),
      password: this.password()
    }
    this.accountService.login(loginRequest).subscribe({
      next: () => {
        this.username.set('')
        this.password.set('')
        this.router.navigateByUrl('/home')
      },
      error: (error) => {
        this.error.set(error.error.message)
        console.log('error ' + error.error.message)
      }
    })
  }

  arePasswordsEqual(){
    if (this.isRegistering()){
      return this.newPassword() !== this.newPasswordConfirm()
    }
    return false
  }

  closeError() {
    this.error.set('')
  }

  togglePassword() {
    const passwordInput = document.getElementById('password-input')
    const newPasswordInput = document.getElementById('new-password-input')
    this.passwordVisible.set(!this.passwordVisible())
    if (this.passwordVisible()) {
      this.passwordVisibleText.set('👁️')
      passwordInput?.setAttribute('type', 'text')
      newPasswordInput?.setAttribute('type', 'text')
    } else {
      this.passwordVisibleText.set('🙈')
      passwordInput?.setAttribute('type', 'password')
      newPasswordInput?.setAttribute('type', 'password')
    }
  }

  changeToRegisterForm(){
    this.isRegistering.set(true)
    this.passwordVisibleText.set('🙈')
  }

  changeToLoginForm(){
    this.isRegistering.set(false)
    this.passwordVisibleText.set('🙈')
  }
  
}
