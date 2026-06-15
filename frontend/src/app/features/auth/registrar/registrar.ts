import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrar.html'
})
export class RegistrarComponent {
  user = { username: '', password: '' };
  loading = false;
  errorMessage = '';
  hidePassword = true;

  constructor(private authService: AuthService, private router: Router) {}

  cadastrar() {
    this.loading = true;
    this.errorMessage = '';
    this.authService.cadastrar(this.user).subscribe({
      next: () => {
        alert('Cadastro realizado! Faça login.');
        this.router.navigate(['/auth/login']);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Erro ao cadastrar';
        this.loading = false;
      }
    });
  }
}
