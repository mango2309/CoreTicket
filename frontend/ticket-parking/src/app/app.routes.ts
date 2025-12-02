import { Routes } from '@angular/router';
import { AdminAreaComponent } from './areas/admin/admin-area.component';
import { CallbackComponent } from './components/callback/callback.component';
import { LandingComponent } from './components/landing/landing.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'callback', component: CallbackComponent },
  {
    path: 'admin',
    component: AdminAreaComponent
  },
  { path: '**', redirectTo: '' }
];
