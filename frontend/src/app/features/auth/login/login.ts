import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  mensagemErro: string = '';
  carregando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializa o formulário com regras de validação
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Método executado quando o usuário clica no botão de entrar
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.mensagemErro = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        // Login sucesso -> Interceptor cuidará do token e jogamos para o dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.carregando = false;
        if (err.status === 401) {
          this.mensagemErro = 'E-mail ou senha incorretos.';
        } else {
          this.mensagemErro = 'Erro ao conectar com o servidor. Tente novamente.';
        }
      }
    });
  }
}

