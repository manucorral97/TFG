import { Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import { AuthService } from '@app/pages/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userRol = "";
  isLogged = false;
  show = false;
  
  //Generamos un objeto de tipo Subscription que nos ayadará con la perfomance de la aplicacion, 
  // ya que no dejaremos abiertos objetos de tipo Observable que consuman memoria de la aplicacion
  private subscription: Subscription = new Subscription;

  @Output() toggleSidenav = new EventEmitter<void>();
  constructor(public authSvc:AuthService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.authSvc.isLogged.subscribe( (res) => (this.isLogged = res)));

    //Comprobamos el rol que tiene 
    this.subscription.add(
      this.authSvc.userRol.subscribe( (res) => (this.userRol = res)));
  
    this.show=false;
    

    //Comprobamos si esta logado y asignamos la respuesta a la varibale isLogged, que cambiara los botones del html
    
  }
  //Eliminara el subscrible (suelen ser Observable) añadido en init
  ngOnDestroy(): void {
    this.show=false;
    this.subscription.unsubscribe();
  }

  onToggleSidenav(): void{
    //Cada vez que pulsemos en ella cambiamos su estado (open -> close -> open)
    this.show = !this.show;
    this.toggleSidenav.emit();
  }

  onLogout():void{
    this.authSvc.logout();
    //Si la sidebar esta expuesta, al deslogarse la cerramos
    if(this.show == true){
      this.toggleSidenav.emit();
      this.show=false;
    }

  }

}
