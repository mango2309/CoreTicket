import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_ID_KEY = 'userId';

  constructor() { }

  getUsuarioId(): number | null {
    const userId = localStorage.getItem(this.USER_ID_KEY);
    return userId ? parseInt(userId, 10) : null;
  }

  setUsuarioId(userId: number): void {
    localStorage.setItem(this.USER_ID_KEY, userId.toString());
  }

  clearUsuarioId(): void {
    localStorage.removeItem(this.USER_ID_KEY);
  }

  isAuthenticated(): boolean {
    return this.getUsuarioId() !== null;
  }
} 