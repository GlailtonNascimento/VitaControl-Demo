import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl  : './login.html',
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #f4f6f9;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 20px;
    }
    .login-card {
      background: #ffffff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
      box-sizing: border-box;
    }
    .login-card h2 {
      margin-bottom: 24px;
      color: #333333;
      text-align: center;
      font-weight: 600;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #666666;
      font-size: 14px;
    }
    .form-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #cccccc;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 16px;
    }
    .form-group input:focus {
      border-color: #007bff;
      outline: none;
    }
    .btn-login {
      width: 100%;
      padding: 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.2s;
    }
    .btn-login:hover {
      background-color: #0056b3;
    }
    .error-msg {
      color: #dc3545;
      background-color: #f8d7da;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
      text-align: center;
    }
    .register-link {
      margin-top: 20px;
      text-align: center;
      font-size: 14px;
      color: #666666;
    }
    .register-link a {
      color: #007bff;
      text-decoration: none;
    }
  `]
})
export class Login {
  usuario = { email: '', senha: '' };
  erro: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  executarLogin() {
    this.erro = '';
    this.authService.login(this.usuario).subscribe({
      next: (res) => {
        // Login com sucesso! Redireciona para o painel principal
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Tratamento de erro caso a senha ou e-mail estejam incorretos
        this.erro = 'E-mail ou senha inválidos. Tente novamente.';
      }
    });
  }
}

