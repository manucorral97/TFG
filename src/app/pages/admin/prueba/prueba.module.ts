import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PruebaRoutingModule } from './prueba-routing.module';
import { PruebaComponent } from './prueba.component';

import { MaterialModule } from '@app/material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';





@NgModule({
  declarations: [
    PruebaComponent
  ],
  imports: [
    CommonModule,
    PruebaRoutingModule,
    MaterialModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PruebaModule { }
