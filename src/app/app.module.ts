import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MaterialModule } from './material.module';
import { SidebarModule } from './shared/components/sidebar/sidebar.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule} from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Interceptor } from '@app/shared/interceptors/admin-interceptor';
import { RefreshTokenInterceptor } from './shared/interceptors/refreshtoken-interceptors';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    SidebarModule,
    HttpClientModule,
    FormsModule,
    DragDropModule
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS, useClass:Interceptor, multi: true},
    {provide:HTTP_INTERCEPTORS, useClass:RefreshTokenInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
