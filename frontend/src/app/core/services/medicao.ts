import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicaoService {
  // URL base apontando para a camada de recursos da API Spring Boot
  private apiUrl = 'http://localhost:8080/api/medicao';

  constructor(private http: HttpClient) {}

  // Envia uma nova medição biológica para o servidor
  // (Lembrando que este endpoint possui a blindagem de Rate Limiting de 10 req/min)
  salvarMedicao(medicao: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, medicao);
  }

  // Busca o histórico completo de medições do usuário logado
  listarHistorico(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Busca os dados consolidados do Dashboard (médias aritméticas e diagnósticos automatizados)
  buscarDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }
}

