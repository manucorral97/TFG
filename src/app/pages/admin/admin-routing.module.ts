import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [{ path: '', component: AdminComponent }, { path: 'users', loadChildren: () => import('./user/user.module').then(m => m.UserModule) }, { path: 'graphs', loadChildren: () => import('./graphs/graphs.module').then(m => m.GraphsModule) }, { path: 'prueba', loadChildren: () => import('./prueba/prueba.module').then(m => m.PruebaModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
