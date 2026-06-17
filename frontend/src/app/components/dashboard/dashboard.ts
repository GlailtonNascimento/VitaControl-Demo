import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  medicaoForm!: FormGroup;
  historicoMedicoes: any[] = [];
  mensagemSucesso: string = '';
  mensagemErro: string = '';
  private apiUrl = 'http://localhost:8080/api';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // Inicialização dos campos reativos do formulário clínico
    this.medicaoForm = this.fb.group({
      sistolica: ['', [Validators.required, Validators.min(50), Validators.max(250)]],
      diastolica: ['', [Validators.required, Validators.min(30), Validators.max(150)]],
      pulsacao: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      contexto: ['Em repouso', Validators.required]
    });

    this.carregarHistorico();
  }

  // Prepara os cabeçalhos HTTP injetando o Bearer Token obtido do LocalStorage
  private obterHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Consome dinamicamente o histórico de medições do endpoint protegido do backend
  carregarHistorico(): void {
    this.http.get<any[]>(`${this.apiUrl}/medicoes`, { headers: this.obterHeaders() })
      .subscribe({
        next: (dados) => {
          this.historicoMedicoes = dados;
        },
        error: (err) => {
          this.mensagemErro = 'Não foi possível carregar o histórico de medições.';
        }
      });
  }

  // Submete o payload clínico para o endpoint protegido POST /api/medicao
  submeterMedicao(): void {
    if (this.medicaoForm.invalid) {
      this.mensagemErro = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.http.post(`${this.apiUrl}/medicao`, this.medicaoForm.value, { headers: this.obterHeaders() })
      .subscribe({
        next: () => {
          this.mensagemSucesso = 'Medição registrada com sucesso!';
          this.mensagemErro = '';
          this.medicaoForm.reset({ contexto: 'Em repouso' });
          this.carregarHistorico(); // Atualiza a tabela local em tempo real
        },
        error: (err) => {
          this.mensagemErro = 'Erro ao salvar a medição. Verifique sua autenticação.';
          this.mensagemSucesso = '';
        }
      });
  }

  // Realiza a classificação dinâmica de alertas com base nas faixas médicas normativas
  getClassificacao(sistolica: number, diastolica: number): { texto: string; classe: string } {
    if (sistolica < 120 && diastolica < 80) {
      return { texto: 'Normal', classe: 'status-normal' };
    } else if ((sistolica >= 120 && sistolica <= 129) && diastolica < 80) {
      return { texto: 'Elevada', classe: 'status-elevada' };
    } else if ((sistolica >= 130 && sistolica <= 139) || (diastolica >= 80 && diastolica <= 89)) {
      return { texto: 'Hipertensão Estágio 1', classe: 'status-alerta' };
    } else {
      return { texto: 'Hipertensão Estágio 2', classe: 'status-critico' };
    }
  }
}

