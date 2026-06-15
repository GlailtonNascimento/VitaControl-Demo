import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrar.html',
  styleUrls: ['./registrar.css']
})
export class RegistrarComponent {
  user = { username: '', email: '', password: '' };
  loading = false;
  errorMessage = '';
  hidePassword = true;

  constructor(private authService: AuthService, private router: Router) {}

  cadastrar() {
    this.loading = true;
    this.errorMessage = '';
    
    const payload = {
      username: this.user.email,
      password: this.user.password
    };
    
    this.authService.cadastrar(payload).subscribe({
      next: () => {
        alert('Cadastro realizado! Faça login.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        if (err.status === 400 && err.error?.includes('Usuário já existe')) {
          this.errorMessage = 'E-mail já cadastrado.';
        } else {
          this.errorMessage = 'Erro ao cadastrar. Tente novamente.';
        }
        this.loading = false;
      }
    });
  }
}
