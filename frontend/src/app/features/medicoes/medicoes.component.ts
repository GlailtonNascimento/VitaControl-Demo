import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MedicaoService } from '../../core/services/medicao.service';
import { MedicamentoService } from '../../core/services/medicamento.service';

@Component({
  selector: 'app-medicoes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', sans-serif;">
      <h2>📊 Minhas Medições</h2>

      <!-- Formulário -->
      <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3>Nova Medição</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <input type="number" [(ngModel)]="nova.sistolica" placeholder="Sistólica" style="flex:1; padding:10px; border:1px solid #ddd; border-radius:8px;">
          <input type="number" [(ngModel)]="nova.diastolica" placeholder="Diastólica" style="flex:1; padding:10px; border:1px solid #ddd; border-radius:8px;">
          <input type="number" [(ngModel)]="nova.pulsacao" placeholder="Pulsação" style="flex:1; padding:10px; border:1px solid #ddd; border-radius:8px;">
          <input type="text" [(ngModel)]="nova.contexto" placeholder="Contexto (opcional)" style="flex:2; padding:10px; border:1px solid #ddd; border-radius:8px;">
        </div>
        <button (click)="salvar()" [disabled]="carregando" style="margin-top:12px; padding:12px 24px; background:#007bff; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">
          {{ carregando ? 'Salvando...' : 'Salvar Medição' }}
        </button>
        <div *ngIf="mensagem" style="margin-top:12px; padding:12px; border-radius:8px; white-space: pre-line;"
             [style.background]="mensagemErro ? '#ffebee' : '#e8f5e9'"
             [style.color]="mensagemErro ? '#c62828' : '#2e7d32'">
          {{ mensagem }}
        </div>
      </div>

      <!-- Histórico -->
      <h3>📋 Histórico</h3>
      <div *ngIf="medicoes.length === 0" style="text-align:center; color:#888; padding:30px 0;">
        Nenhuma medição registrada.
      </div>
      <div *ngFor="let m of medicoes" style="background: white; border:1px solid #e0e0e0; border-radius:12px; padding:16px; margin-bottom:12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
          <div>
            <strong>{{ m.dataHora | date:'dd/MM/yyyy HH:mm' }}</strong>
            <span style="margin-left: 12px; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block;"
                  [style.background]="getCorStatus(m)" [style.color]="getCorTextoStatus(m)">
              {{ getStatus(m) }}
            </span>
          </div>
        </div>
        <div style="margin-top: 6px;">
          Sistólica: {{ m.sistolica }} mmHg | Diastólica: {{ m.diastolica }} mmHg | Pulsação: {{ m.pulsacao }} bpm
        </div>
        <div *ngIf="m.contexto" style="font-size: 14px; color: #666; margin-top: 4px;">
          📝 {{ m.contexto }}
        </div>
      </div>

      <!-- Botão Voltar -->
      <div style="text-align: center; margin-top: 30px;">
        <a routerLink="/dashboard" style="display: inline-block; padding: 10px 20px; background: #6c757d; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
          ← Voltar ao Dashboard
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class MedicoesComponent implements OnInit {
  medicoes: any[] = [];
  nova: any = { sistolica: null, diastolica: null, pulsacao: null, contexto: '' };
  carregando = false;
  mensagem = '';
  mensagemErro = false;

  constructor(
    private medicaoService: MedicaoService,
    private medicamentoService: MedicamentoService
  ) {}

  ngOnInit() {
    this.listar();
  }

  salvar() {
    if (!this.nova.sistolica || !this.nova.diastolica || !this.nova.pulsacao) {
      this.mensagem = 'Preencha todos os campos obrigatórios (sistólica, diastólica, pulsação).';
      this.mensagemErro = true;
      return;
    }
    this.carregando = true;
    this.mensagem = '';
    this.mensagemErro = false;

    this.medicaoService.salvar(this.nova).subscribe({
      next: () => {
        let msg = '✅ Medição salva com sucesso!';

        // Dica pós-medição
        const dica = this.obterDica(this.nova.sistolica, this.nova.diastolica);
        msg += ' ' + dica;

        // Verifica medicamento próximo
        this.medicamentoService.listar().subscribe({
          next: (medicamentos: any[]) => {
            const agora = new Date();
            const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

            const medicamentoProximo = medicamentos.find(m => {
              const [hMed, mMed] = m.horario.split(':').map(Number);
              const minutosMed = hMed * 60 + mMed;
              const diff = minutosMed - minutosAgora;
              return diff >= 0 && diff <= 60;
            });

            if (medicamentoProximo) {
              msg += ` ⏰ Alerta: Está próximo do horário do seu medicamento (${medicamentoProximo.nome}) às ${medicamentoProximo.horario}.`;
            }

            this.mensagem = msg;
            this.mensagemErro = false;
            this.nova = { sistolica: null, diastolica: null, pulsacao: null, contexto: '' };
            this.listar();
            this.carregando = false;
          },
          error: () => {
            // Se falhar ao buscar medicamentos, exibe só a dica
            this.mensagem = msg;
            this.mensagemErro = false;
            this.nova = { sistolica: null, diastolica: null, pulsacao: null, contexto: '' };
            this.listar();
            this.carregando = false;
          }
        });
      },
      error: (err) => {
        this.mensagem = 'Erro ao salvar medição. Tente novamente.';
        this.mensagemErro = true;
        this.carregando = false;
        console.error(err);
      }
    });
  }

  listar() {
    this.medicaoService.listar().subscribe({
      next: (data) => { this.medicoes = data; },
      error: (err) => { console.error('Erro ao listar:', err); }
    });
  }

  // ========== Dica pós-medição ==========
  obterDica(sistolica: number, diastolica: number): string {
    if (sistolica >= 140 || diastolica >= 90) {
      return '🚨 Pressão alta! Descanse, eleve as pernas e beba água. Evite esforços. Consulte um médico.';
    } else if (sistolica >= 120 || diastolica >= 80) {
      return '⚠️ Pressão elevada. Reduza o sal, pratique exercícios e mantenha o peso.';
    } else {
      return '✅ Pressão normal. Continue com hábitos saudáveis!';
    }
  }

  // ========== Funções de classificação individual ==========
  getStatus(medicao: any): string {
    const s = medicao.sistolica;
    const d = medicao.diastolica;
    if (s >= 140 || d >= 90) return 'Hipertensão';
    if (s >= 120 || d >= 80) return 'Pré-hipertensão';
    return 'Normal';
  }

  getCorStatus(medicao: any): string {
    const status = this.getStatus(medicao);
    if (status === 'Normal') return '#d4edda';
    if (status === 'Pré-hipertensão') return '#fff3cd';
    if (status === 'Hipertensão') return '#f8d7da';
    return '#e9ecef';
  }

  getCorTextoStatus(medicao: any): string {
    const status = this.getStatus(medicao);
    if (status === 'Normal') return '#155724';
    if (status === 'Pré-hipertensão') return '#856404';
    if (status === 'Hipertensão') return '#721c24';
    return '#333';
  }
}
