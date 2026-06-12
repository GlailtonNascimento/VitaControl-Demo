import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    // Monta o payload garantindo os mapeamentos corretos da tela para o Spring
    const payload = {
      username: userData.email || userData.nomeCompleto || userData.username,
      password: userData.senha || userData.password
    };

    return this.http.post(
      `${this.apiUrl}/register`, 
      payload, 
      { responseType: 'text' }
    );
  }

  login(credentials: any): Observable<any> {
    const payload = {
      username: credentials.email || credentials.username,
      password: credentials.senha || credentials.password
    };
    return this.http.post(`${this.apiUrl}/login`, payload);
  }
}
	

