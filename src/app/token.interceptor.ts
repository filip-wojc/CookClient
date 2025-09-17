import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { take } from 'rxjs';
import { AccountService } from './services/account.service';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const accountService = inject(AccountService);
  
  // Skip adding auth header for login/register
  if (request.url.includes('api/auth/login') || request.url.includes('api/auth/register')) {
    return next(request);
  }

  const currentUser = accountService.currentUser();
  
  if (currentUser && currentUser.accessToken) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.accessToken}`
      }
    });
  }
  
  return next(request);
};