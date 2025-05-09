import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lealtad } from '../models/lealtad.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LealtadService {
  private apiUrl = 'https://localhost:7251/api/lealtad';

  constructor(private http: HttpClient) {}

  getLealtades(): Observable<Lealtad[]> {
    return this.http.get<Lealtad[]>(this.apiUrl);
  }

  getLealtadPorUsuario(usuarioId: number): Observable<Lealtad> {
    return this.http.get<Lealtad>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  crearLealtad(lealtad: Lealtad): Observable<Lealtad> {
    return this.http.post<Lealtad>(this.apiUrl, lealtad);
  }

  actualizarLealtad(id: number, lealtad: Lealtad): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, lealtad);
  }

  getPuntosLealtad(usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/puntos/${usuarioId}`);
  }

  canjearPuntos(usuarioId: number, puntos: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/canjear`, { usuarioId, puntos });
  }
}
