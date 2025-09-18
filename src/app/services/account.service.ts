import { Injectable, signal } from "@angular/core";
import { LoginRequest } from "../models/requests/login.request";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { LoginResponse } from "../models/responses/login.response";
import { Router, RouterOutlet } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    currentUser = signal<LoginResponse | null>(null)
    isRefreshingToken = signal<boolean>(false)
    private refreshTokenTimeout: any

    constructor(
        private http: HttpClient,
        private router: Router
    ){}

    private baseUrl = 'http://localhost:8080/api/auth'

    login(payload: LoginRequest) {
        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(
      map((response: LoginResponse) => {
        console.log('Login successful, response:', response);
        const user = this.setUserData(response);
        this.startRefreshTokenTimer();
        this.currentUser.set(user); 
        
        console.log(user)
      })
    );
    }

    private setUserData(response: LoginResponse | any): any {
    const user = {
      userId: response.userId,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      tokenExpiration: new Date(response.tokenExpiration),
      refreshTokenExpiration: new Date(response.refreshTokenExpiration)
    };
    console.log('Setting user data:', user);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  refreshToken() : Observable<void> {
    this.isRefreshingToken.set(true);

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      console.log('No refresh token available')
      return throwError(() => new Error('No refresh token available'))
    }
  
    const payload = { refreshToken };
    return this.http.post<LoginResponse>(`${this.baseUrl}/refresh-token`, payload).pipe(
      map((response: LoginResponse) => {
        console.log('Token refreshed successfully');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = this.setUserData({
          ...user,
          ...response
        });
        this.currentUser.set(updatedUser); // Make sure to update the current user
        this.startRefreshTokenTimer();
        this.isRefreshingToken.set(false);
      }),
      catchError(error => {
        console.log('error: ' + error.error.message)
        this.logout()
        return throwError(() => error)
      })
    );
  }

  private startRefreshTokenTimer() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    
    const user = JSON.parse(userString);
    const expirationDate = new Date(user.tokenExpiration);
    
    const timeout = expirationDate.getTime() - Date.now() - (5 * 60 * 1000);
    console.log(`Token refresh scheduled in ${Math.round(timeout/1000)} seconds`);
    
    if (timeout > 0) {
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }
}

  getToken(): string | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.accessToken || null;
  }

  private getRefreshToken(): string | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.refreshToken || null;
  }

  logout() {
    // Clear user data
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.stopRefreshTokenTimer();
    this.router.navigateByUrl('/login');
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}