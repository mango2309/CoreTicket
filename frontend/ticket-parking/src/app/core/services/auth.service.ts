import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak = inject(KeycloakService);

  async isAuthenticated(): Promise<boolean> {
    return await this.keycloak.isLoggedIn();
  }

  async getUserProfile(): Promise<KeycloakProfile | null> {
    try {
      return await this.keycloak.loadUserProfile();
    } catch (error) {
      return null;
    }
  }

  getUserRoles(): string[] {
    return this.keycloak.getUserRoles();
  }

  hasRole(role: string): boolean {
    return this.keycloak.isUserInRole(role);
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isOperator(): boolean {
    return this.hasRole('operator');
  }

  isViewer(): boolean {
    return this.hasRole('viewer');
  }

  async getUsername(): Promise<string> {
    const profile = await this.getUserProfile();
    return profile?.username || profile?.firstName || 'Usuario';
  }

  async getEmail(): Promise<string | undefined> {
    const profile = await this.getUserProfile();
    return profile?.email;
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout(window.location.origin);
  }

  getToken(): Promise<string> {
    return this.keycloak.getToken();
  }

  async getCurrentUser(): Promise<{ username: string; email?: string; roles: string[] } | null> {
    const isLoggedIn = await this.isAuthenticated();
    if (!isLoggedIn) return null;

    const profile = await this.getUserProfile();
    const roles = this.getUserRoles();

    return {
      username: profile?.username || profile?.firstName || 'Usuario',
      email: profile?.email,
      roles
    };
  }
}