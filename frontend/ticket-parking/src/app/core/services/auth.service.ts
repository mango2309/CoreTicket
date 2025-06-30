import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_ID_KEY = 'userId';
  private readonly USER_ROLE_KEY = 'userRole';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getUsuarioId(): number | null {
    if (!this.isBrowser) return null;
    const userId = localStorage.getItem(this.USER_ID_KEY);
    return userId ? parseInt(userId, 10) : null;
  }

  setUsuarioId(userId: number): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.USER_ID_KEY, userId.toString());
  }

  clearUsuarioId(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.USER_ID_KEY);
  }

  getUserRole(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.USER_ROLE_KEY);
  }

  setUserRole(role: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.USER_ROLE_KEY, role);
  }

  clearUserRole(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.USER_ROLE_KEY);
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;
    return this.getUsuarioId() !== null;
  }

  isAdmin(): boolean {
    if (!this.isBrowser) return false;
    return this.getUserRole() === 'admin';
  }

  logout(): void {
    if (!this.isBrowser) return;
    this.clearUsuarioId();
    this.clearUserRole();
  }

  getCurrentUser(): { userId: number, userRole: string | null } | null {
    if (!this.isBrowser) return null;
    const userId = this.getUsuarioId();
    const userRole = this.getUserRole();
    if (userId !== null) {
      return { userId, userRole };
    }
    return null;
  }
}