import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertasComponent } from './alertas.component';

const routes: Routes = [{ path: '', component: AlertasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertasRoutingModule { }
