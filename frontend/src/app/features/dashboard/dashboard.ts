import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MedicaoService } from '../../core/services/medicao';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  dadosDashboard: any = null;
  mensagemErro: string = '';
  carregando: boolean = true;

  constructor(
    private medicaoService: MedicaoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  // Busca os dados estatísticos e o diagnóstico consolidado do Backend
  carregarDados(): void {
    this.carregando = true;
    this.medicaoService.buscarDashboard().subscribe({
      next: (dados) => {
        this.dadosDashboard = dados;
        this.carregando = false;
      },
      error: (err) => {
        this.carregando = false;
        if (err.status === 403 || err.status === 401) {
          this.mensagemErro = 'Sessão expirada. Por favor, faça login novamente.';
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        } else {
          this.mensagemErro = 'Erro ao carregar os dados do painel de saúde.';
        }
      }
    });
  }

  // Função para deslogar do sistema de forma segura
  fazerLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

