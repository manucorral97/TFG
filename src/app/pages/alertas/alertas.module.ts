import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AlertasRoutingModule } from './alertas-routing.module';
import { AlertasComponent } from './alertas.component';

import { MaterialModule } from '@app/material.module';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AlertasComponent
  ],
  imports: [
    CommonModule,
    AlertasRoutingModule,
    MaterialModule,
    ChartsModule,
    ReactiveFormsModule,
  ],
  providers:[
    DatePipe
  ]
})
export class AlertasModule { }
