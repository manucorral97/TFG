import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertSidebarComponent } from './alert-sidebar.component';
import { MaterialModule } from '@app/material.module';



@NgModule({
  declarations: [
    AlertSidebarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    AlertSidebarComponent
  ]
})
export class AlertSidebarModule { }
