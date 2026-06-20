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
  usuario = { nome: '', email: '', senha: '' };
  mensagemErro: string = '';
  carregando: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  cadastrar() {
    this.carregando = true;
    this.mensagemErro = '';

    const service: any = this.authService;
    const metodoCadastro = service.registrar ? service.registrar.bind(service) : service.register.bind(service);

    metodoCadastro(this.usuario).subscribe({
      next: (res: any) => {
        this.carregando = false;
        alert('Conta criada com sucesso!');
      },
      error: (err: any) => {
        this.carregando = false;
        if (err.error && typeof err.error === 'string') {
          this.mensagemErro = err.error;
        } else if (err.error && err.error.message) {
          this.mensagemErro = err.error.message;
        } else {
          this.mensagemErro = `Erro técnico (${err.status}): Sem comunicação com o servidor local.`;
        }
      }
    });
  }
}
