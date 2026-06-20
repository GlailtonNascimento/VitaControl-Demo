import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-senha.html',
  styleUrls: ['./recuperar-senha.css']
})
export class RecuperarSenha {
  email: string = '';
  loading: boolean = false;
  message: string = '';

  enviarLink() {
    this.loading = true;
    // Lógica futura de envio
    setTimeout(() => {
      this.loading = false;
      this.message = 'Link enviado com sucesso!';
    }, 1500);
  }
}
