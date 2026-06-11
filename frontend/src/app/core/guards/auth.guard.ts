import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se o usuário estiver autenticado (com token), permite o acesso à rota
  if (authService.isAutenticado()) {
    return true;
  }

  // Caso contrário, barra o acesso e redireciona para a tela de login
  router.navigate(['/auth/login']);
  return false;
};

