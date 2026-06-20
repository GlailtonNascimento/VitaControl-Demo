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
  loading: boolean = false;

  sistolicaError: string = '';
  diastolicaError: string = '';
  pulsacaoError: string = '';

  private apiUrl = 'http://192.0.0.4:8080/api'; 

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.medicaoForm = this.fb.group({
      sistolica: ['', [Validators.required, Validators.min(50), Validators.max(250)]],
      diastolica: ['', [Validators.required, Validators.min(30), Validators.max(150)]],
      pulsacao: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      contexto: ['Em repouso', Validators.required]
    });

    this.carregarHistorico();
  }

  private obterHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  carregarHistorico(): void {
    this.http.get<any[]>(`${this.apiUrl}/medicoes`, { headers: this.obterHeaders() })
      .subscribe({
        next: (dados) => {
          this.historicoMedicoes = dados;
        },
        error: (err) => {
          console.error('Erro ao carregar histórico:', err);
          this.mensagemErro = 'Não foi possível conectar ao servidor para carregar o histórico.';
        }
      });
  }

  submeterMedicao(): void {
    this.sistolicaError = '';
    this.diastolicaError = '';
    this.pulsacaoError = '';
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    let temErro = false;

    const sistolicaControl = this.medicaoForm.get('sistolica');
    if (sistolicaControl?.hasError('required') || !sistolicaControl?.value) {
      this.sistolicaError = 'A pressão sistólica (máxima) é obrigatória.';
      temErro = true;
    } else if (sistolicaControl?.hasError('min') || sistolicaControl?.hasError('max')) {
      this.sistolicaError = 'Insira um valor de sistólica válido entre 50 e 250 mmHg.';
      temErro = true;
    }

    const diastolicaControl = this.medicaoForm.get('diastolica');
    if (diastolicaControl?.hasError('required') || !diastolicaControl?.value) {
      this.diastolicaError = 'A pressão diastólica (mínima) é obrigatória.';
      temErro = true;
    } else if (diastolicaControl?.hasError('min') || diastolicaControl?.hasError('max')) {
      this.diastolicaError = 'Insira um valor de diastólica válido entre 30 e 150 mmHg.';
      temErro = true;
    }

    const pulsacaoControl = this.medicaoForm.get('pulsacao');
    if (pulsacaoControl?.hasError('required') || !pulsacaoControl?.value) {
      this.pulsacaoError = 'A pulsação/frequência cardíaca é obrigatória.';
      temErro = true;
    } else if (pulsacaoControl?.hasError('min') || pulsacaoControl?.hasError('max')) {
      this.pulsacaoError = 'A pulsação deve estar entre 30 e 200 BPM.';
      temErro = true;
    }

    if (temErro) {
      this.mensagemErro = 'Por favor, corrija as inconsistências do formulário antes de enviar.';
      return;
    }

    this.loading = true;

    this.http.post(`${this.apiUrl}/medicoes`, this.medicaoForm.value, { headers: this.obterHeaders() })
      .subscribe({
        next: () => {
          this.loading = false;
          this.mensagemSucesso = 'Medição biológica registrada e salva com sucesso!';
          this.medicaoForm.reset({ contexto: 'Em repouso' });
          this.carregarHistorico();
        },
        error: (err) => {
          this.loading = false;
          console.error('Erro ao salvar medição:', err);
          this.mensagemErro = 'Erro ao salvar a medição. Verifique sua conexão ou autenticação.';
        }
      });
  }

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
