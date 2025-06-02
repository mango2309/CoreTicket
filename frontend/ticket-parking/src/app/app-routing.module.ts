import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TicketQueryComponent } from './components/ticket-query/ticket-query.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ticket-query', component: TicketQueryComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
