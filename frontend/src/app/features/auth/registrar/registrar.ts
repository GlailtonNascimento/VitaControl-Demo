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
    if (!this.user.username || !this.user.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.cadastrar(this.user).subscribe({
      next: () => {
        this.loading = false;
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/auth/login']);
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Erro no cadastro:', err);

        // Se o e-mail já existir (geralmente status 409 ou 400 com mensagem de duplicado)
        if (err.status === 409 || (err.error && err.error.message && err.error.message.includes('já cadastrado'))) {
          this.errorMessage = 'Usuário já cadastrado, faça o login.';
        } else if (err.status === 400) {
          this.errorMessage = 'Dados inválidos. Verifique as informações inseridas.';
        } else {
          this.errorMessage = 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
        }
      }
    });
  }
}

