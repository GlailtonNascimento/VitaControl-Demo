import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MedicaoService } from '../../core/services/medicao.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', sans-serif;">
      <!-- Toggle de tema escuro -->
      <div style="display: flex; justify-content: flex-end; padding: 10px 0;">
        <button (click)="toggleTheme()" class="btn" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: 0.3s;">
          {{ isDark ? '🌞 Modo Claro' : '🌙 Modo Escuro' }}
        </button>
      </div>

      <h1 style="text-align: center;">🚀 Bem-vindo ao Dashboard</h1>
      <p style="text-align: center; color: var(--text-muted, #555);">Acompanhamento de Pressão Arterial</p>

      <!-- Card de status -->
      <div *ngIf="dashboard" class="card" style="margin: 30px 0; padding: 25px; border-radius: 16px; text-align: center; box-shadow: 0 4px 16px var(--shadow-color, rgba(0,0,0,0.1));"
           [style.background]="getCorFundo()" [style.color]="getCorTexto()">
        <div style="font-size: 48px; margin-bottom: 8px;">{{ getIcone() }}</div>
        <h2 style="margin: 0; font-size: 28px; font-weight: 700;">{{ dashboard.statusGeral }}</h2>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">{{ getMensagem() }}</p>
        <div style="display: flex; justify-content: center; gap: 30px; margin-top: 20px; flex-wrap: wrap;">
          <div><strong>📊 Média Sistólica</strong><br>{{ dashboard.mediaSistolica }} mmHg</div>
          <div><strong>📊 Média Diastólica</strong><br>{{ dashboard.mediaDiastolica }} mmHg</div>
          <div><strong>💓 Média Pulsação</strong><br>{{ dashboard.mediaPulsacao }} bpm</div>
          <div><strong>📋 Total</strong><br>{{ dashboard.totalMedicoes }} medições</div>
        </div>
      </div>

      <!-- Botões de navegação -->
      <div style="display: flex; justify-content: center; gap: 30px; margin-top: 20px; flex-wrap: wrap;">
        <a routerLink="/medicoes" class="btn btn-primary" style="display: inline-block; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; transition: 0.3s;">
          ➕ Ir para Minhas Medições
        </a>
        <a routerLink="/grafico" class="btn btn-success" style="display: inline-block; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; transition: 0.3s;">
          📈 Ver Gráficos
        </a>
        <a routerLink="/medicamentos" class="btn btn-warning" style="display: inline-block; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; transition: 0.3s;">
          💊 Medicamentos
        </a>
        <a routerLink="/relatorio" class="btn" style="display: inline-block; padding: 12px 24px; background: #17a2b8; color: white; border-radius: 8px; font-weight: 600; text-decoration: none; transition: 0.3s;">
          📄 Relatórios
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  dashboard: any = null;
  isDark: boolean = false;

  constructor(
    private medicaoService: MedicaoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Carrega a preferência do tema do localStorage (se houver)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDark = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    this.carregarDashboard();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    const theme = this.isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); // Salva a preferência
  }

  carregarDashboard() {
    this.medicaoService.dashboard().subscribe({
      next: (data: any) => {
        this.dashboard = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao carregar dashboard:', err);
      }
    });
  }

  getCorFundo(): string {
    if (!this.dashboard) return '#f0f0f0';
    const status = this.dashboard.statusGeral;
    if (status === 'Normal') return '#d4edda';
    if (status === 'Pré-hipertensão') return '#fff3cd';
    if (status === 'Hipertensão') return '#f8d7da';
    return '#f0f0f0';
  }

  getCorTexto(): string {
    if (!this.dashboard) return '#333';
    const status = this.dashboard.statusGeral;
    if (status === 'Normal') return '#155724';
    if (status === 'Pré-hipertensão') return '#856404';
    if (status === 'Hipertensão') return '#721c24';
    return '#333';
  }

  getIcone(): string {
    if (!this.dashboard) return '📋';
    const status = this.dashboard.statusGeral;
    if (status === 'Normal') return '✅';
    if (status === 'Pré-hipertensão') return '⚠️';
    if (status === 'Hipertensão') return '🚨';
    return '📋';
  }

  getMensagem(): string {
    if (!this.dashboard) return 'Carregando...';
    const status = this.dashboard.statusGeral;
    if (status === 'Normal') return 'Sua pressão está normal. Continue com hábitos saudáveis! 💚';
    if (status === 'Pré-hipertensão') return 'Atenção: sua pressão está elevada. Adote mudanças no estilo de vida (menos sal, exercícios, perda de peso). 🟡';
    if (status === 'Hipertensão') return 'Sua pressão está alta. Consulte um médico o mais breve possível. 🔴';
    return 'Status desconhecido.';
  }
}
