import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicaoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/medicoes';

  salvar(medicao: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, medicao);
  }
}

