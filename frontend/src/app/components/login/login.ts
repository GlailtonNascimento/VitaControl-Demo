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
  emailError = '';
  passwordError = '';
  hidePassword = true;

  constructor(private authService: AuthService, private router: Router) {}

  validarEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase().trim());
  }

  login() {
    this.errorMessage = '';
    this.emailError = '';
    this.passwordError = '';

    let temErro = false;

    if (!this.usuario.username || !this.usuario.username.trim()) {
      this.emailError = 'Por favor, digite seu e-mail.';
      temErro = true;
    } else if (!this.validarEmail(this.usuario.username)) {
      this.emailError = 'Por favor, insira um e-mail válido.';
      temErro = true;
    }

    if (!this.usuario.password || !this.usuario.password.trim()) {
      this.passwordError = 'A senha é obrigatória para entrar.';
      temErro = true;
    }

    // TRAVA ABSOLUTA LOCAL
    if (temErro) {
      return;
    }

    this.loading = true;

    this.authService.login(this.usuario).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res && res.token) {
          localStorage.setItem('token', res.token);
        }
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Erro detectado no login:', err);

        const msgOriginal = err?.message || String(err);
        
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'E-mail ou senha incorretos. Verifique seus dados.';
        } else if (err.status === 0 || msgOriginal.toLowerCase().includes('fetch')) {
          this.errorMessage = 'Não foi possível conectar ao aplicativo. Verifique sua conexão com a internet.';
        } else {
          this.errorMessage = 'Instabilidade no sistema. Por favor, tente novamente em alguns instantes.';
        }
      }
    });
  }
}
