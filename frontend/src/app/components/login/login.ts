import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  usuario = { username: '', password: '' };
  loading = false;
  errorMessage = '';
  hidePassword = true;

  emailError = '';
  passwordError = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.emailError = '';
    this.passwordError = '';
    this.errorMessage = '';

    let temErro = false;

    if (!this.usuario.username || !this.usuario.username.trim()) {
      this.emailError = 'O preenchimento do usuário ou e-mail é obrigatório.';
      temErro = true;
    }

    if (!this.usuario.password || !this.usuario.password.trim()) {
      this.passwordError = 'A senha é obrigatória para acessar o sistema.';
      temErro = true;
    }

    if (temErro) return;

    this.loading = true;

    this.authService.login(this.usuario).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Resposta inválida do servidor.';
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Erro de login retornado:', err);

        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Usuário ou senha incorretos! Verifique suas credenciais.';
        } else if (err.status === 0) {
          // Aqui tratamos o erro do print: ajustamos a instrução visual
          this.errorMessage = 'Não foi possível conectar ao servidor Spring Boot. Verifique se o backend está rodando no IP correto.';
        } else {
          this.errorMessage = 'Falha interna ao tentar realizar o login. Tente novamente.';
        }
      }
    });
  }
}
