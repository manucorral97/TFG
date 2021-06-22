import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraphsRoutingModule } from './graphs-routing.module';
import { GraphsComponent } from './graphs.component';
import { MaterialModule } from '@app/material.module';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    GraphsComponent
  ],
  imports: [
    CommonModule,
    GraphsRoutingModule,
    MaterialModule,
    ChartsModule
  ]
})
export class GraphsModule { }
