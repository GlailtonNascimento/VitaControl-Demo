import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  usuario = { username: '', password: '' };
  errorMessage: string = '';
  loading: boolean = false;
  hidePassword = true;
  debugInfo: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.loading = true;
    this.errorMessage = '';
    this.debugInfo = 'Enviando requisição...';

    this.authService.login(this.usuario).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.debugInfo = 'Resposta recebida: ' + JSON.stringify(res);
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          alert('✅ Token salvo com sucesso!'); // ← ALERTA VISUAL
          this.debugInfo = 'Token salvo! Redirecionando...';
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Resposta inválida do servidor.';
          this.debugInfo = 'Erro: token não encontrado na resposta.';
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.debugInfo = 'Erro: ' + (err.status || 'sem status');
        this.errorMessage = 'Usuário ou senha incorretos.';
      }
    });
  }
}
