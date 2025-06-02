import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TicketQueryComponent } from './components/ticket-query/ticket-query.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
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
  { path: '**', redirectTo: '/register' }
];
