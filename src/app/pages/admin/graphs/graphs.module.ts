import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { GraphsRoutingModule } from './graphs-routing.module';
import { GraphsComponent } from './graphs.component';
import { MaterialModule } from '@app/material.module';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [
    GraphsComponent
  ],
  imports: [
    CommonModule,
    GraphsRoutingModule,
    MaterialModule,
    ChartsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule
  ],
  providers:[
    DatePipe
  ]
})
export class GraphsModule { }
