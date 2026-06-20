import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Voltando para o seu backend local do Termux que está ligado
  private apiUrl = 'http://192.0.0.4:8080/api';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  cadastrar(user: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/cadastrar`, user);
  }

  recuperarSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/recuperar-senha`, { email });
  }
}
