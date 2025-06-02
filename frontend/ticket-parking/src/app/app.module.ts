import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TicketQueryComponent } from './components/ticket-query/ticket-query.component';
import { TicketResultadoComponent } from './components/ticket-resultado/ticket-resultado.component';
import { LealtadPuntosComponent } from './components/lealtad-puntos/lealtad-puntos.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    // Importar componentes standalone
    AppComponent,
    TicketQueryComponent,
    TicketResultadoComponent,
    LealtadPuntosComponent,
    NavbarComponent,
    HomeComponent
  ],
  providers: []
})
export class AppModule { }
