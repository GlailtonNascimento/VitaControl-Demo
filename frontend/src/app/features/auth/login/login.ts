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
  loading = false;
  errorMessage = '';
  hidePassword = true;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.usuario.username || !this.usuario.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

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
        console.error('Erro no login:', err);
        
        // Trata o erro amigavelmente para o usuário
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'E-mail ou senha incorretos. Verifique suas credenciais.';
        } else {
          this.errorMessage = 'Não foi possível conectar ao servidor. Tente novamente.';
        }
      }
    });
  }
}

