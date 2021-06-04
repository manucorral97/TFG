import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { MaterialModule } from '@app/material.module'
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    RouterModule,
    DragDropModule
  ],
  exports:[
    AdminComponent
  ]
})
export class AdminModule { }
