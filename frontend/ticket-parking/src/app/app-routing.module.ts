import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioRegisterComponent } from './components/usuario-register/usuario-register.component';
import { UsuarioLoginComponent } from './components/usuario-login/usuario-login.component';
import { TicketQueryComponent } from './components/ticket-query/ticket-query.component';
import { TicketResultadoComponent } from './components/ticket-resultado/ticket-resultado.component';
import { LealtadPuntosComponent } from './components/lealtad-puntos/lealtad-puntos.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: UsuarioRegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: UsuarioLoginComponent },
  { path: 'consultar-ticket', component: TicketQueryComponent },
  { path: 'resultado-ticket', component: TicketResultadoComponent },
  { path: 'puntos-lealtad', component: LealtadPuntosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
