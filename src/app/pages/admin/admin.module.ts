import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { MaterialModule } from '@app/material.module'
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MainPipe } from '@app/shared/pipes/pipes.module';
import { Directive } from '@shared/directives/directive.module';
import { ModalComponent } from './components/modal/modal.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AlarmComponent } from './components/alarm/alarm.component';
import { AlertSidebarModule } from './components/alert-sidebar/alert-sidebar.module';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { ThresholdComponent } from './components/threshold/threshold.component';




@NgModule({
  declarations: [
    AdminComponent,
    ModalComponent,
    AlarmComponent,
    ThresholdComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    RouterModule,
    DragDropModule,
    MainPipe,
    Directive,
    FormsModule,
    ReactiveFormsModule,
    AlertSidebarModule,
    AngularCropperjsModule
  ],
  exports:[
    AdminComponent
  ]
})
export class AdminModule { }
