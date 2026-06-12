import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Ajustado com o IP real do Termux e a rota oficial do Spring Boot
  private apiUrl = 'http://127.0.0.1:8080/api/auth';

  constructor(private http: HttpClient) {}

  // Envia as credenciais e salva o token JWT caso o login seja bem-sucedido
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  // Registra um novo usuário no sistema mapeado no backend
  registrar(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, usuario);
  }

  // Remove o token do navegador, deslogando o usuário
  logout(): void {
    localStorage.removeItem('token');
  }

  // Verifica se o usuário está autenticado baseado na presença do token
  isAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }
}
	

