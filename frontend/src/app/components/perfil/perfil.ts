import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private apiUrl = 'http://192.0.0.4:8080/api/usuarios/perfil';

  perfil = {
    emailSecundario: '',
    celular: ''
  };

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarPerfil();
  }

  carregarPerfil() {
    this.http.get(this.apiUrl).subscribe({
      next: (data: any) => {
        if (data) {
          this.perfil.emailSecundario = data.emailSecundario || '';
          this.perfil.celular = data.celular || '';
        }
      },
      error: (err) => console.error('Erro ao carregar perfil:', err)
    });
  }

  salvarPerfil() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.put(this.apiUrl, this.perfil).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Dados do perfil updated com sucesso!';
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao salvar perfil:', err);
        this.errorMessage = 'Não foi possível atualizar o perfil. Tente novamente.';
      }
    });
  }
}

