import { Routes } from '@angular/router';
import { RegistrarComponent } from './features/auth/registrar/registrar.component';
import { LoginComponent } from './features/auth/login/login';
import { RecuperarSenha } from './features/auth/recuperar-senha/recuperar-senha';
import { DashboardComponent } from './features/dashboard/dashboard.component'; // ← ADICIONADO

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'esqueci-senha', component: RecuperarSenha },
  { path: 'dashboard', component: DashboardComponent }, // ← ROTA ADICIONADA
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
