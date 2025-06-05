import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TicketQueryComponent } from './components/ticket-query/ticket-query.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { BeneficiosLealtadComponent } from './components/beneficios-lealtad/beneficios-lealtad.component';
import { TicketControlComponent } from './components/ticket-control/ticket-control.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'ticket-query', 
    component: TicketQueryComponent,
    canActivate: [authGuard]
  },
  {
    path: 'beneficios-lealtad',
    component: BeneficiosLealtadComponent
  },
  {
    path: 'ticket-control',
    component: TicketControlComponent
  },
  { path: '**', redirectTo: '/login' }
];
