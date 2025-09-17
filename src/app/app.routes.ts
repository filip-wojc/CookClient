import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { authGuard } from './auth.guard';
import { Autologin } from './components/autologin/autologin';

export const routes: Routes = [
    {path: '', component: Autologin},
    {path: 'login', component: Login},
    {path: 'home', component: Home, canActivate: [authGuard]}
];
