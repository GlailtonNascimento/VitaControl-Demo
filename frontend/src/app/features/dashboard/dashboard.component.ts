import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="text-align: center; padding: 50px;">
      <h1>🚀 Bem-vindo ao Dashboard!</h1>
      <p>Seu login foi realizado com sucesso.</p>
      <p style="color: #6c757d; font-size: 14px;">VitaControl - Acompanhamento de Pressão Arterial</p>
    </div>
  `,
  styles: []
})
export class DashboardComponent {}
