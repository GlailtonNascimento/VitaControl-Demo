import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-senha.html',
  styleUrl: './recuperar-senha.css',
})
export class RecuperarSenha {
  email = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService) {}

  enviarEmail() {
    if (!this.email) {
      this.errorMessage = 'Por favor, insira o seu e-mail.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.recuperarSenha(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'E-mail enviado para recuperação. Verifique sua caixa de entrada.';
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Erro na recuperação:', err);
        if (err.status === 404) {
          this.errorMessage = 'E-mail não encontrado no sistema.';
        } else {
          this.errorMessage = 'Erro ao processar a solicitação. Tente novamente mais tarde.';
        }
      }
    });
  }
}

