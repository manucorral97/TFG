import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@app/pages/auth/auth.service';
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

  components = [
    {
      name: "Humedad",
      icon: "thermostat"
    },
    {
      name: "Temperatura",
      icon: "water"
    }
  ];

  constructor(public authSvc:AuthService) { }

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

}
