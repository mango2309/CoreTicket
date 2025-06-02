import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lealtad } from '../models/lealtad.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LealtadService {
  private apiUrl = 'https://localhost:7251/api/lealtad';

  constructor(private http: HttpClient) { }

  getLoyaltyByUserId(userId: number): Observable<Lealtad> {
    return this.http.get<Lealtad>(`${this.apiUrl}/usuario/${userId}`);
  }

  getAllLoyaltyRecords(): Observable<Lealtad[]> {
    return this.http.get<Lealtad[]>(`${this.apiUrl}/todos`);
  }

  addPoints(loyalty: Partial<Lealtad>): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregar-puntos`, loyalty);
  }
}
