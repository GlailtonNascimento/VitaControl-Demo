import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rotas Públicas (Autenticação)
  { 
    path: 'auth/login', 
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) 
  },
  { 
    path: 'auth/registrar', 
    loadComponent: () => import('./features/auth/registrar/registrar').then(m => m.RegistrarComponent) 
  },

  // Rotas Protegidas (Exigem autenticação via Token JWT)
  { 
    path: 'medicoes', 
    loadComponent: () => import('./features/medicoes/medicoes').then(m => m.MedicoesComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard] 
  },

  // Redirecionamento Padrão para rotas vazias ou desconhecidas
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];

