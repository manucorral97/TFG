import { Component, OnInit, Output, EventEmitter, OnDestroy, Injectable} from '@angular/core';
import { AuthService } from '@app/pages/auth/auth.service';
import { Subscription } from 'rxjs';
import { SharedService } from '@app/shared/services/shared.service';
import { UtilsSidenavService } from '@app/shared/services/utilsSidenav.service';

@Injectable({
  providedIn:'root'
})

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userRol = "";
  username = "";
  isLogged = false;
  show = false;
  showName = false;
  showInstalacion = false
  instalacion:any;

  //Generamos un objeto de tipo Subscription que nos ayadará con la perfomance de la aplicacion, 
  // ya que no dejaremos abiertos objetos de tipo Observable que consuman memoria de la aplicacion
  private subscription: Subscription = new Subscription;

  @Output() toggleSidenav = new EventEmitter<void>(); 
  constructor(public authSvc:AuthService, public sharedSvc:SharedService, public utilsSvc:UtilsSidenavService) { 
  }

  ngOnInit(): void {
    this.showName = false;
    this.subscription.add(
      this.authSvc.isLogged.subscribe( (res) => (this.isLogged = res)));

    //Comprobamos el rol que tiene 
    this.subscription.add(
      this.authSvc.userRol.subscribe( (res) => (this.userRol = res)));

    this.show=false;

    //Esperamos a que se logee el usuario para activar el campo del header con el nombre del usuario
    this.sharedSvc.getUserNameObservable.subscribe((res) => {
      this.username=res;
      this.showName = true;
    })

    //Esperamos a que elija una instalacion el usuario para activar el campo del header con el nombre de la instalacion
    this.sharedSvc.getInstalacionObservable.subscribe((res) => {
      this.instalacion=res;
      this.showInstalacion = true;
    })

    

    //Comprobamos si esta logado y asignamos la respuesta a la varibale isLogged, que cambiara los botones del html
    
  }
  //Eliminara el subscrible (suelen ser Observable) añadido en init
  ngOnDestroy(): void {
    this.show=false;
    this.subscription.unsubscribe();
  }

  onToggleSidenav(): void{
    //Cada vez que pulsemos en ella cambiamos su estado (open -> close -> open)
    this.toggleSidenav.emit();
    this.show = !this.show;
  }

  onLogout():void{
    this.authSvc.logout();
    //Si la sidebar esta expuesta, al deslogarse la cerramos
    if(this.show == true){
      this.utilsSvc.openSidenav(false)
      this.show=false;
    }
    this.showName = false;
    this.showInstalacion = false;

  }

}
