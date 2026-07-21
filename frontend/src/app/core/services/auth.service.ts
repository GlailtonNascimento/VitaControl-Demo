import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Login com e-mail e senha
  login(credentials: { email: string; senha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  // Cadastro com nome, e-mail e senha
  cadastrar(user: { nome: string; email: string; senha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registrar`, user);
  }

  // Solicitar recuperação de senha
  recuperarSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/recuperar-senha`, { email });
  }

  // Redefinir senha com token
  redefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/redefinir-senha`, { token, novaSenha });
  }
}
