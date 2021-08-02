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
  //Se pone delante la mas restrictiva!
  {
    path: 'admin/users',
    loadChildren: () =>
      import('./pages/admin/user/user.module').then((m) => m.UserModule),
    data: {
      allowRol: ['0', '1'],
    },
    //Comporbamos si ya esta logeado para que no pueda acceder a la ruta y que tenga los permisos
    canActivate: [CheckRolGuard],
  },
  {
    path: 'admin/graphs',
    loadChildren: () =>
      import('./pages/admin/graphs/graphs.module').then((m) => m.GraphsModule),
    data: {
      allowRol: ['0', '1', '2'],
    },
    //Comporbamos si ya esta logeado para que no pueda acceder a la ruta y que tenga los permisos
    canActivate: [CheckRolGuard],
  },
  {
    path: 'admin/prueba',
    loadChildren: () =>
      import('./pages/admin/prueba/prueba.module').then((m) => m.PruebaModule),
    data: {
      allowRol: ['0', '1', '2'],
    },
    //Comporbamos si ya esta logeado para que no pueda acceder a la ruta y que tenga los permisos
    canActivate: [CheckRolGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.module').then((m) => m.AdminModule),
    data: {
      allowRol: ['0', '1', '2'],
    },
    //Comporbamos si ya esta logeado para que no pueda acceder a la ruta y que tenga los permisos
    canActivate: [CheckRolGuard],
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((m) => m.LoginModule),
    //Comporbamos si ya esta logeado para que no pueda acceder a la ruta
    canActivate: [CheckLoginGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/auth/register/register.module').then(
        (m) => m.RegisterModule
      ),
    data: {
      allowRol: ['0'],
    },
    //Comporbamos si ya esta logeado para que no pueda acceder a la ruta y que tenga los permisos
    canActivate: [CheckRolGuard],
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./shared/components/contact/contact.module').then(
        (m) => m.ContactModule
      ),
  },
  {
    path: 'alertas',
    loadChildren: () =>
      import('./pages/alertas/alertas.module').then((m) => m.AlertasModule),
      data: {
        allowRol: ['0', '1', '2'],
      },
      canActivate: [CheckRolGuard],
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
