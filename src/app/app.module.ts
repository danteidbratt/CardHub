import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DealerComponent } from './dealer/dealer.component';
import { CardService } from './card.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    DealerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [CardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
