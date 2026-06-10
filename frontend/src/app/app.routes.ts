import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registrar } from './components/registrar/registrar';
import { Dashboard } from './components/dashboard/dashboard';
import { MedicaoForm } from './components/medicao-form/medicao-form';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'registrar', component: Registrar },
  { path: 'dashboard', component: Dashboard },
  { path: 'medicao', component: MedicaoForm }
];

