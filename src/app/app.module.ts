import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReteDiagramModule } from './rete-diagram/rete-diagram.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, ReteDiagramModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
