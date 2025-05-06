import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Pessoa {
  id?: number;
  nome: string;
  idade: number;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/pessoas';

  constructor(private http: HttpClient) {}

  salvar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(`${this.apiUrl}${this.endpoint}`, pessoa);
  }

  listar(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${this.apiUrl}${this.endpoint}`);
  }

  editar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}${this.endpoint}/${pessoa.id}`, pessoa);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.endpoint}/${id}`);
  }
}
