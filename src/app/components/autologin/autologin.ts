import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-autologin',
  imports: [],
  templateUrl: './autologin.html',
  styleUrl: './autologin.css'
})
export class Autologin implements OnInit {
constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    if (this.accountService.currentUser()) {
      this.router.navigateByUrl('/home');
      return;
    }

    this.accountService.refreshToken().pipe(
      catchError(error => {
        console.error('Auto login failed', error);
        this.router.navigateByUrl('/home');
        return of(null);
      })
    ).subscribe({
      next: () => {
        this.router.navigateByUrl('/home');
      }
    });
  }
}
