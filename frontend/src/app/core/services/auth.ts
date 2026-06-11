import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base apontando para a porta padrão do seu backend Spring Boot
  private apiUrl = 'http://localhost:8080/auth';

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

  // Registra um novo usuário no sistema
  registrar(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, usuario);
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

