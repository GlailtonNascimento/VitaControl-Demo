import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // URL do seu Backend Java

  constructor(private http: HttpClient) {}

  // 1. Método de Login (Mantendo a compatibilidade com o que você já tinha)
  login(dadosLogin: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, dadosLogin);
  }

  // 2. Método de Recuperação de Senha (O que acabamos de criar)
  recuperarSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar-senha`, { email });
  }
}

