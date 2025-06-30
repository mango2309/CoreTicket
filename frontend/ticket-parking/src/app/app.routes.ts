import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserAreaComponent } from './areas/user/user-area.component';
import { AdminAreaComponent } from './areas/admin/admin-area.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'user', 
    component: UserAreaComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'admin', 
    component: AdminAreaComponent,
    canActivate: [authGuard, adminGuard]
  },
  { path: '**', redirectTo: '' }
];
