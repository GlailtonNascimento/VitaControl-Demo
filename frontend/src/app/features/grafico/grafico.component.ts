import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MedicaoService } from '../../core/services/medicao.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div style="max-width: 900px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', sans-serif;">
      <h2 style="text-align: center;">📈 Gráficos de Pressão Arterial</h2>

      <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0; flex-wrap: wrap;">
        <button (click)="periodo = 'semanal'; carregarGrafico()" 
                [style.background]="periodo === 'semanal' ? '#007bff' : '#e9ecef'"
                [style.color]="periodo === 'semanal' ? 'white' : '#333'"
                style="padding: 10px 20px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
          📅 Semanal
        </button>
        <button (click)="periodo = 'mensal'; carregarGrafico()"
                [style.background]="periodo === 'mensal' ? '#007bff' : '#e9ecef'"
                [style.color]="periodo === 'mensal' ? 'white' : '#333'"
                style="padding: 10px 20px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
          📅 Mensal
        </button>
        <button (click)="periodo = 'anual'; carregarGrafico()"
                [style.background]="periodo === 'anual' ? '#007bff' : '#e9ecef'"
                [style.color]="periodo === 'anual' ? 'white' : '#333'"
                style="padding: 10px 20px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
          📅 Anual
        </button>
      </div>

      <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <canvas #chartCanvas></canvas>
      </div>

      <div style="margin-top: 20px; text-align: center;">
        <a routerLink="/dashboard" style="display: inline-block; padding: 10px 20px; background: #6c757d; color: white; text-decoration: none; border-radius: 6px;">
          ← Voltar ao Dashboard
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class GraficoComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart: Chart | null = null;
  periodo: string = 'semanal';

  constructor(private medicaoService: MedicaoService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.carregarGrafico();
  }

  carregarGrafico() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Faça login para visualizar os gráficos.');
      return;
    }

    let endpoint = '';
    if (this.periodo === 'semanal') endpoint = '/medicoes/grafico/semanal';
    else if (this.periodo === 'mensal') endpoint = '/medicoes/grafico/mensal';
    else endpoint = '/medicoes/grafico/anual';

    fetch(`http://localhost:8080/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then((data: any) => {
      if (data.labels && data.sistolica && data.diastolica) {
        this.criarGrafico(data.labels, data.sistolica, data.diastolica);
      } else {
        console.error('Dados inválidos:', data);
      }
    })
    .catch(err => {
      console.error('Erro ao carregar gráfico:', err);
    });
  }

  criarGrafico(labels: string[], sistolica: number[], diastolica: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Sistólica',
            data: sistolica,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.2,
            fill: true
          },
          {
            label: 'Diastólica',
            data: diastolica,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            tension: 0.2,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `Evolução da Pressão - ${this.periodo.charAt(0).toUpperCase() + this.periodo.slice(1)}`
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'mmHg'
            }
          }
        }
      }
    });
  }
}
