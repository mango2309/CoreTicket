import { Routes } from '@angular/router';
import { AdminAreaComponent } from './areas/admin/admin-area.component';

export const routes: Routes = [
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminAreaComponent
  },
  { path: '**', redirectTo: '/admin' }
];
