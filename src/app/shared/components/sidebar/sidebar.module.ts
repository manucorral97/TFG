import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { MaterialModule } from '@app/material.module'
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    DragDropModule,
  ],
  exports:[
    SidebarComponent
  ]
})
export class SidebarModule { }
