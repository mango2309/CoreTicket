import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pais } from '../models/pais.model';
import { Provincia } from '../models/provincia.model';
import { Ciudad } from '../models/ciudad.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UbicacionService {
  private baseUrl = 'https://localhost:7251/api/Ubicacion';

  constructor(private http: HttpClient) {}

  getPaises(): Observable<Pais[]> {
    return this.http.get<Pais[]>(`${this.baseUrl}/paises`);
  }

  getProvincias(paisId: number): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.baseUrl}/provincias/${paisId}`);
  }

  getCiudades(provinciaId: number): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(`${this.baseUrl}/ciudades/${provinciaId}`);
  }
}
