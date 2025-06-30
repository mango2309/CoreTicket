import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TicketQueryComponent } from './components/ticket-query/ticket-query.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Rutas públicas
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Área de Usuario (requiere autenticación)
  {
    path: 'user',
    canActivate: [authGuard],
    loadChildren: () => import('./areas/user/user.module').then(m => m.UserModule)
  },
  
  // Área de Administrador (requiere autenticación y rol admin)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./areas/admin/admin.module').then(m => m.AdminModule)
  },
  
  // Rutas legacy (redirigir a user)
  { path: 'ticket-query', redirectTo: 'user/ticket-query' },
  
  // Ruta por defecto
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
