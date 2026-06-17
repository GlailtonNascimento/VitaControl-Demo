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
  successMessage = ''; // Nova variável para feedbacks de sucesso
  hidePassword = true;

  constructor(private authService: AuthService, private router: Router) {}

  cadastrar() {
    // Validação visual rápida antes de enviar para o servidor
    if (!this.user.email || !this.user.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      username: this.user.email,
      password: this.user.password
    };

    this.authService.cadastrar(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Cadastro realizado com sucesso! Redirecionando para o login...';
        // Aguarda 2,5 segundos para o usuário ler a mensagem antes de mudar de tela
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Erro retornado do backend:', err);

        // Captura o status HTTP ou o texto da resposta do Spring Boot
        const erroMensagem = err.error?.message || err.error || '';
        
        if (err.status === 409 || err.status === 400 && (erroMensagem.includes('existe') || erroMensagem.includes('cadastrado'))) {
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

