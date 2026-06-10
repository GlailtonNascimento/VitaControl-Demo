import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Aponta para a API Java rodando localmente
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(dados: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, dados).pipe(
      tap(resposta => {
        if (resposta && resposta.token) {
          // Guarda o Token JWT com segurança para usar nas próximas chamadas
          localStorage.setItem('token', resposta.token);
        }
      })
    );
  }

  registrar(dados: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, dados);
  }

  obterToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}

