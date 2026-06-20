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
  successMessage = '';
  hidePassword = true;

  // Variáveis para as travas locais de borda (0 segundos)
  emailError = '';
  passwordError = '';

  constructor(private authService: AuthService, private router: Router) {}

  cadastrar() {
    // Limpa os estados de erro anteriores antes de validar
    this.emailError = '';
    this.passwordError = '';
    this.errorMessage = '';
    this.successMessage = '';

    let temErro = false;

    // 1. Validação estrita do E-mail/Usuário
    if (!this.user.email || !this.user.email.trim()) {
      this.emailError = 'O e-mail é obrigatório para realizar o cadastro.';
      temErro = true;
    } else if (!this.user.email.includes('@')) {
      this.emailError = 'Por favor, insira um e-mail válido.';
      temErro = true;
    }

    // 2. Validação estrita da Senha
    if (!this.user.password || !this.user.password.trim()) {
      this.passwordError = 'A senha é obrigatória para realizar o cadastro.';
      temErro = true;
    } else if (this.user.password.length < 6) {
      this.passwordError = 'A senha deve conter no mínimo 6 caracteres.';
      temErro = true;
    }

    // Aborta se alguma trava local for acionada (Segurança de Borda - 0s)
    if (temErro) {
      return;
    }

    this.loading = true;

    const payload = {
      username: this.user.email.trim(),
      password: this.user.password
    };

    this.authService.cadastrar(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Cadastro realizado com sucesso! Redirecionando para o login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Erro retornado do backend:', err);

        const erroMensagem = err.error?.message || err.error || '';

        if (err.status === 409 || (err.status === 400 && (erroMensagem.includes('existe') || erroMensagem.includes('cadastrado')))) {
          this.errorMessage = 'Este e-mail já está cadastrado! Volte para a tela de login ou recupere sua senha.';
        } else if (err.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        } else {
          this.errorMessage = 'Erro ao cadastrar. Verifique os dados ou tente novamente.';
        }
      }
    });
  }
}
