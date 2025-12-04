import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { CallbackComponent } from './components/callback/callback.component';
import { PaymentsDashboardComponent } from './components/payments-dashboard/payments-dashboard.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'callback', component: CallbackComponent },
    {
        path: 'payments',
        component: PaymentsDashboardComponent
    },
    { path: '**', redirectTo: '' }
];
