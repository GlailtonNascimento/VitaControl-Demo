import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  salvar(medicamento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/medicamentos`, medicamento, { headers: this.getHeaders() });
  }

  listar(): Observable<any> {
    return this.http.get(`${this.apiUrl}/medicamentos`, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/medicamentos/${id}`, { headers: this.getHeaders() });
  }
}



