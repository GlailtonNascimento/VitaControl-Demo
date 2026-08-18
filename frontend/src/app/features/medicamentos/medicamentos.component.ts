import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MedicamentoService } from '../../core/services/medicamento.service';

@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', sans-serif;">
      <h2>💊 Meus Medicamentos</h2>

      <!-- Formulário -->
      <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3>Novo Medicamento</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <input type="text" [(ngModel)]="novo.nome" placeholder="Nome" style="flex:2; padding:10px; border:1px solid #ddd; border-radius:8px;">
          <input type="text" [(ngModel)]="novo.dosagem" placeholder="Dosagem" style="flex:1; padding:10px; border:1px solid #ddd; border-radius:8px;">
          <input type="time" [(ngModel)]="novo.horario" style="flex:1; padding:10px; border:1px solid #ddd; border-radius:8px;">
          <input type="number" [(ngModel)]="novo.frequenciaDias" placeholder="Dias (ex: 1)" style="flex:1; padding:10px; border:1px solid #ddd; border-radius:8px;">
        </div>
        <button (click)="salvar()" [disabled]="carregando" style="margin-top:12px; padding:12px 24px; background:#007bff; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">
          {{ carregando ? 'Salvando...' : 'Adicionar Medicamento' }}
        </button>
        <div *ngIf="mensagem" style="margin-top:12px; padding:12px; border-radius:8px;"
             [style.background]="mensagemErro ? '#ffebee' : '#e8f5e9'"
             [style.color]="mensagemErro ? '#c62828' : '#2e7d32'">
          {{ mensagem }}
        </div>
      </div>

      <!-- Listagem -->
      <h3>📋 Meus Medicamentos</h3>
      <div *ngIf="medicamentos.length === 0" style="text-align:center; color:#888; padding:30px 0;">
        Nenhum medicamento cadastrado.
      </div>
      <div *ngFor="let m of medicamentos" style="background: white; border:1px solid #e0e0e0; border-radius:12px; padding:16px; margin-bottom:12px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>{{ m.nome }}</strong> {{ m.dosagem }}<br>
          <span style="font-size: 14px; color: #555;">⏰ {{ m.horario }} | Frequência: {{ m.frequenciaDias }} dia(s)</span>
        </div>
        <button (click)="deletar(m.id)" style="background: #dc3545; color: white; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer;">Excluir</button>
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
export class MedicamentosComponent implements OnInit {
  medicamentos: any[] = [];
  novo: any = { nome: '', dosagem: '', horario: '', frequenciaDias: 1 };
  carregando = false;
  mensagem = '';
  mensagemErro = false;

  constructor(private medicamentoService: MedicamentoService) {}

  ngOnInit() {
    this.listar();
  }

  salvar() {
    if (!this.novo.nome || !this.novo.horario) {
      this.mensagem = 'Preencha nome e horário.';
      this.mensagemErro = true;
      return;
    }
    this.carregando = true;
    this.mensagem = '';
    this.mensagemErro = false;

    this.medicamentoService.salvar(this.novo).subscribe({
      next: () => {
        this.mensagem = 'Medicamento salvo com sucesso!';
        this.mensagemErro = false;
        this.novo = { nome: '', dosagem: '', horario: '', frequenciaDias: 1 };
        this.listar();
        this.carregando = false;
      },
      error: (err) => {
        this.mensagem = 'Erro ao salvar. Tente novamente.';
        this.mensagemErro = true;
        this.carregando = false;
        console.error(err);
      }
    });
  }

  listar() {
    this.medicamentoService.listar().subscribe({
      next: (data) => { this.medicamentos = data; },
      error: (err) => { console.error('Erro ao listar:', err); }
    });
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja excluir este medicamento?')) {
      this.medicamentoService.deletar(id).subscribe({
        next: () => { this.listar(); },
        error: (err) => { console.error('Erro ao deletar:', err); }
      });
    }
  }
}
