import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicaoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  salvar(medicao: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/medicoes`, medicao, { headers: this.getHeaders() });
  }

  listar(): Observable<any> {
    return this.http.get(`${this.apiUrl}/medicoes`, { headers: this.getHeaders() });
  }

  dashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/medicoes/dashboard`, { headers: this.getHeaders() });
  }
}
