import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraphsRoutingModule } from './graphs-routing.module';
import { GraphsComponent } from './graphs.component';
import { MaterialModule } from '@app/material.module';


@NgModule({
  declarations: [
    GraphsComponent
  ],
  imports: [
    CommonModule,
    GraphsRoutingModule,
    MaterialModule
  ]
})
export class GraphsModule { }
