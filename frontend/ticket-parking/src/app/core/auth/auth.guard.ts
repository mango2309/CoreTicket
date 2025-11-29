import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

export const authGuard: CanActivateFn = async (route, state) => {
    const keycloak = inject(KeycloakService);
    const router = inject(Router);

    const isLoggedIn = await keycloak.isLoggedIn();

    if (!isLoggedIn) {
        await keycloak.login({
            redirectUri: window.location.origin + state.url
        });
        return false;
    }

    // Verificar roles si se especifican en la ruta
    const requiredRoles = route.data['roles'] as Array<string>;
    if (requiredRoles && requiredRoles.length > 0) {
        const hasRole = requiredRoles.some(role => keycloak.isUserInRole(role));
        if (!hasRole) {
            router.navigate(['/unauthorized']);
            return false;
        }
    }

    return true;
};
