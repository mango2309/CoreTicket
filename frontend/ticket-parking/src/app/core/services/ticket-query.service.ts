import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TicketQuery } from '../models/ticket-query.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketQueryService {
  private apiUrl = 'https://localhost:7027/api/TicketQuery';

  constructor(private http: HttpClient) {}

  getTicketQueries(): Observable<TicketQuery[]> {
    return this.http.get<TicketQuery[]>(this.apiUrl);
  }

  crearTicketQuery(ticket: TicketQuery): Observable<TicketQuery> {
    return this.http.post<TicketQuery>(this.apiUrl, ticket);
  }
}
