import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { MaterialModule } from '@app/material.module'
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UtilsSidenavService } from '@app/shared/services/utilsSidenav.service';



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
  ],
  providers:[
    UtilsSidenavService
  ]
})
export class SidebarModule { }
