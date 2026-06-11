import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MedicaoService } from '../../core/services/medicao';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-medicoes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './medicoes.html',
  styleUrls: ['./medicoes.css']
})
export class MedicoesComponent {
  medicaoForm: FormGroup;
  mensagemErro: string = '';
  mensagemSucesso: string = '';
  carregando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private medicaoService: MedicaoService,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializa o formulário validando os limites numéricos aceitáveis
    this.medicaoForm = this.fb.group({
      pressaoSistolica: ['', [Validators.required, Validators.min(50), Validators.max(250)]],
      pressaoDiastolica: ['', [Validators.required, Validators.min(30), Validators.max(150)]],
      frequenciaCardiaca: ['', [Validators.required, Validators.min(30), Validators.max(220)]],
      peso: ['', [Validators.required, Validators.min(2), Validators.max(300)]]
    });
  }

  // Envia a medição para a API protegida
  onSubmit(): void {
    if (this.medicaoForm.invalid) {
      this.mensagemErro = 'Por favor, insira valores válidos em todos os campos.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    this.medicaoService.salvarMedicao(this.medicaoForm.value).subscribe({
      next: (res) => {
        this.carregando = false;
        this.mensagemSucesso = 'Medição registrada com sucesso!';
        this.medicaoForm.reset(); // Limpa a tela para o próximo registro
      },
      error: (err) => {
        this.carregando = false;
        // Trata o bloqueio do Rate Limiting (429 Too Many Requests) configurado no backend
        if (err.status === 429) {
          this.mensagemErro = 'Muitas requisições! Limite de 10 registros por minuto atingido.';
        } else if (err.status === 401 || err.status === 403) {
          this.mensagemErro = 'Sessão expirada. Faça login novamente.';
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        } else {
          this.mensagemErro = 'Erro ao salvar a medição. Tente novamente.';
        }
      }
    });
  }

  // Faz o logout seguro
  fazerLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

