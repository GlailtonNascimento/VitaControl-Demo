import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registrar.html',
  styleUrls: ['./registrar.css']
})
export class RegistrarComponent {
  registrarForm: FormGroup;
  mensagemErro: string = '';
  mensagemSucesso: string = '';
  carregando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializa o formulário com regras rígidas de validação
    this.registrarForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validator: this.checarSenhas }); // Aplica o validador de senhas iguais
  }

  // Validador customizado para comparar a senha com a confirmação
  checarSenhas(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    return senha === confirmarSenha ? null : { naoCoincide: true };
  }

  // Método executado ao enviar o cadastro
  onSubmit(): void {
    if (this.registrarForm.invalid) {
      this.mensagemErro = 'Por favor, corrija os erros no formulário antes de prosseguir.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    // Monta o objeto removendo o campo extra de confirmação antes de mandar pro Spring Boot
    const { nome, email, senha } = this.registrarForm.value;
    const dadosUsuario = { nome, email, senha };

    this.authService.registrar(dadosUsuario).subscribe({
      next: (res) => {
        this.mensagemSucesso = 'Cadastro realizado com sucesso! Redirecionando...';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000); // Aguarda 2 segundos para o usuário ler a mensagem e joga pro Login
      },
      error: (err) => {
        this.carregando = false;
        if (err.status === 400) {
          this.mensagemErro = 'Este e-mail já está cadastrado no sistema.';
        } else {
          this.mensagemErro = 'Erro ao processar cadastro. Tente novamente mais tarde.';
        }
      }
    });
  }
}

