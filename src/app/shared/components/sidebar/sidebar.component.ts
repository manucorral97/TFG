import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@app/pages/auth/auth.service';
import { UtilsSidenavService } from '@app/shared/services/utilsSidenav.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  userRol = "";
  isLogged = false;
  
  private subscription: Subscription = new Subscription;

  constructor(public authSvc:AuthService, private utilsSvc: UtilsSidenavService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.authSvc.isLogged.subscribe( (res) => (this.isLogged = res)));

    //Comprobamos el rol que tiene 
    this.subscription.add(
      this.authSvc.userRol.subscribe( (res) => (this.userRol = res)));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  //Cerramos el sidenav cuando pulsemos en un apartado concreto del menu
  closeSide(): void {
    this.utilsSvc.openSidenav(false);    
  }

}
