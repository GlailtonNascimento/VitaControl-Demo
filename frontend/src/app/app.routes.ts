import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'registrar',
    loadComponent: () => import('./components/registrar/registrar').then(m => m.RegistrarComponent)
  },
  {
    path: 'recuperar-senha',
    loadComponent: () => import('./components/recuperar-senha/recuperar-senha').then(m => m.RecuperarSenhaComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
