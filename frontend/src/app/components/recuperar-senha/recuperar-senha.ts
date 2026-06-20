import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-senha.html',
  styleUrls: ['./recuperar-senha.css']
})
export class RecuperarSenhaComponent {
  email = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  // Trava local de borda (0 segundos)
  emailError = '';

  constructor(private authService: AuthService) {}

  enviarLink() {
    // Limpa estados de erro anteriores
    this.emailError = '';
    this.errorMessage = '';
    this.successMessage = '';

    // Validação estrita na borda do cliente (0s)
    if (!this.email || !this.email.trim()) {
      this.emailError = 'O preenchimento do e-mail é obrigatório para recuperação.';
      return;
    } else if (!this.email.includes('@')) {
      this.emailError = 'Por favor, insira um endereço de e-mail válido.';
      return;
    }

    this.loading = true;

    this.authService.recuperarSenha(this.email.trim()).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMessage = 'Um link de recuperação foi enviado para o seu e-mail com sucesso!';
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Erro na recuperação:', err);

        if (err.status === 404) {
          this.errorMessage = 'Este e-mail não foi encontrado na nossa base de dados.';
        } else if (err.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        } else {
          this.errorMessage = 'Ocorreu um erro ao processar a solicitação. Tente novamente mais tarde.';
        }
      }
    });
  }
}
