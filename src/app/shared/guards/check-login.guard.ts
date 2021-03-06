import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '@app/pages/auth/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CheckLoginGuard implements CanActivate {
  constructor(private authSvc: AuthService){}
  //Metodo utilizado en las rutas de app-routing para dejar acceder solo si el usuario esta logado
  canActivate(): Observable<boolean>{
    //console.log("El guard de login envia esto: ", this.authSvc.isLogged.pipe(take(1),map( (isLogged: boolean)=> !isLogged)));
    return this.authSvc.isLogged.pipe(
      take(1),
      map( (isLogged: boolean)=> !isLogged)
    );
  }
}
