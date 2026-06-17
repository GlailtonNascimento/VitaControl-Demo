import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service'; // Importado o serviço real

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-senha.html',
  styleUrls: ['./recuperar-senha.css']
})
export class RecuperarSenhaComponent {
  email = '';
  loading = false;
  successMessage = ''; // Mensagem verde de sucesso
  errorMessage = '';   // Mensagem vermelha de erro

  constructor(private authService: AuthService) {} // Injetando o AuthService

  enviarLink() {
    // Validação preventiva: impede o clique com campo vazio
    if (!this.email || !this.email.trim()) {
      this.errorMessage = 'Por favor, insira um e-mail válido.';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Chamando a rota real do Spring Boot que configuramos no auth.service
    this.authService.recuperarSenha(this.email.trim()).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMessage = 'Um link de recuperação foi enviado para o seu e-mail com sucesso!';
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Erro na recuperação:', err);
        
        if (err.status === 404) {
          this.errorMessage = 'Este e-mail não foi encontrado na nossa base de dados.';
        } else {
          this.errorMessage = 'Ocorreu um erro ao processar a solicitação. Tente novamente mais tarde.';
        }
      }
    });
  }
}

