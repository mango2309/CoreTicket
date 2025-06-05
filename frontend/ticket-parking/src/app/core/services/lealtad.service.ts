import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lealtad {
  usuarioId: number;
  puntosAcumulados: number;
  horasAcumuladas: number;
  ultimaActualizacion: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LealtadService {
  private apiUrl = 'https://localhost:7251/api/Lealtad';

  constructor(private http: HttpClient) {}

  // Método para compatibilidad con componentes existentes
  getLoyaltyByUserId(userId: number): Observable<Lealtad> {
    return this.http.get<Lealtad>(`${this.apiUrl}/${userId}`);
  }

  // Nuevo método con nombre más descriptivo
  getLealtadUsuario(usuarioId: number): Observable<Lealtad> {
    return this.http.get<Lealtad>(`${this.apiUrl}/${usuarioId}`);
  }

  actualizarPuntos(usuarioId: number, puntos: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/puntos`, {
      usuarioId,
      puntosAcumulados: puntos
    });
  }

  getAllLoyaltyRecords(): Observable<Lealtad[]> {
    return this.http.get<Lealtad[]>(`${this.apiUrl}/todos`);
  }
}
