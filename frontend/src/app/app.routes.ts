import { Routes } from '@angular/router';
import { RegistrarComponent } from './features/auth/registrar/registrar.component';
import { LoginComponent } from './features/auth/login/login';
import { RecuperarSenha } from './features/auth/recuperar-senha/recuperar-senha';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'esqueci-senha', component: RecuperarSenha },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
