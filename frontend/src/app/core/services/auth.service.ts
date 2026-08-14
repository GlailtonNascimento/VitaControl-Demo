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

  // Login
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  // Cadastro
  cadastrar(user: { nome: string; username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  // Solicitar recuperação de senha (envia o código por e-mail)
  recuperarSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/recuperar-senha`, { email });
  }

  // Validar o código digitado pelo usuário
  validarCodigo(email: string, codigo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/validar-codigo`, { email, codigo });
  }

  // Redefinir a senha com o código validado
  redefinirSenha(email: string, codigo: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/redefinir-senha`, { email, codigo, novaSenha });
  }
}
