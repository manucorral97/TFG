import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckLoginGuard } from '@shared/guards/check-login.guard';
import { CheckRolGuard } from './shared/guards/check-rol.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'notFound',
    loadChildren: () =>
      import('./pages/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((m) => m.LoginModule),
      //Comporbamos si ya esta logeado para que no pueda acceder a la ruta
      canActivate:[CheckLoginGuard]
  },
  { path: 'register', 
    loadChildren: () => 
      import('./pages/auth/register/register.module').then(m => m.RegisterModule),
      data:{
        allowRol : '0'
      },
      //Comporbamos si ya esta logeado para que no pueda acceder a la ruta y que tenga los permisos
      canActivate:[CheckRolGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
