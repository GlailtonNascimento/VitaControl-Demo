import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrar.html',
  styleUrls: ['./registrar.css']
})
export class RegistrarComponent {
  usuario = { username: '', password: '' };  // ← ajustado
  mensagemErro: string = '';
  mensagemSucesso: string = '';
  carregando: boolean = false;
  hidePassword = true;

  constructor(private authService: AuthService, private router: Router) {}

  cadastrar() {
    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    this.authService.cadastrar(this.usuario).subscribe({
      next: (res: any) => {
        this.carregando = false;
        this.mensagemSucesso = 'Cadastro realizado com sucesso!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.carregando = false;
        if (err.status === 409) {
          this.mensagemErro = 'Este e-mail já está cadastrado no sistema.';
        } else if (err.status === 400) {
          this.mensagemErro = 'Dados inválidos. Verifique os campos.';
        } else if (err.error && typeof err.error === 'string') {
          this.mensagemErro = err.error;
        } else {
          this.mensagemErro = 'Erro ao cadastrar. Tente novamente.';
        }
      }
    });
  }
}
