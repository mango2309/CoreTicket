import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { UbicacionFormComponent } from './components/ubicacion-form/ubicacion-form.component';
import { UsuarioRegisterComponent } from './components/usuario-register/usuario-register.component';
import { UsuarioLoginComponent } from './components/usuario-login/usuario-login.component';
import { TicketQueryComponent } from './components/ticket-query/ticket-query.component';
import { TicketResultadoComponent } from './components/ticket-resultado/ticket-resultado.component';
import { LealtadPuntosComponent } from './components/lealtad-puntos/lealtad-puntos.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    UbicacionFormComponent,
    UsuarioLoginComponent,
    TicketQueryComponent,
    TicketResultadoComponent,
    LealtadPuntosComponent,
    NavbarComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    UsuarioRegisterComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
