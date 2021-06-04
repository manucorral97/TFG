import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@app/pages/auth/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CheckRolGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log("Por ultimo, retornamos un...", this.checkUserRol(route));
    return this.checkUserRol(route);
  }
  checkUserRol(route: ActivatedRouteSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const rol = localStorage.getItem('rol')
    //console.log("Desde el auth service obtenemos este rol del usuario -> ", rol);
    if (rol){
      //console.log("Tenemos este rol", rol);
      //console.log("Se permiten estos roles para esta ruta,", route.data.allowRol);
      if (route.data.allowRol.includes(rol)){
        //console.log("Se incluye! ", rol);
        return true;
      } else{
        //console.log("No se incluye...", rol);
        this.router.navigate([]);
        return false;
      }
    } else{
      return false;
    }

  }
  
}
