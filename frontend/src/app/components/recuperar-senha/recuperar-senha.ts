import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  mensagem = '';

  enviarLink() {
    this.loading = true;
    setTimeout(() => {
      this.mensagem = `Link enviado para ${this.email}`;
      this.loading = false;
    }, 1000);
  }
}
