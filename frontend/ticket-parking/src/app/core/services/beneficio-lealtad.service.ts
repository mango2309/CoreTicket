import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BeneficioLealtad {
  idBeneficio: number;
  nombre: string;
  descripcion: string;
  puntosRequeridos: number;
  activo: boolean;
  fechaCreacion: Date;
  idLealtad?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BeneficioLealtadService {
  private apiUrl = 'http://localhost:5062/api/BeneficioLealtad';

  constructor(private http: HttpClient) {}

  getBeneficios(): Observable<BeneficioLealtad[]> {
    return this.http.get<BeneficioLealtad[]>(this.apiUrl);
  }

  getBeneficiosDisponibles(puntos: number): Observable<BeneficioLealtad[]> {
    return this.http.get<BeneficioLealtad[]>(`${this.apiUrl}/disponibles/${puntos}`);
  }

  getBeneficio(id: number): Observable<BeneficioLealtad> {
    return this.http.get<BeneficioLealtad>(`${this.apiUrl}/${id}`);
  }

  canjearBeneficio(idBeneficio: number, usuarioId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/canjear`, {
      idBeneficio,
      usuarioId
    });
  }
}