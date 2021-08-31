import { Component, OnInit } from '@angular/core';
import { UtilsSidenavService } from './shared/services/utilsSidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private utilsSvc: UtilsSidenavService) {}

  //Hacemos que podamos ocultar el menu lateral al pulsar en cualquiera de sus opciones
  ngOnInit(): void {
    this.utilsSvc.sidenavOpened$.subscribe(res => {
      this.opened = res;
    });
  }
  title = 'TFG';
  opened = false;
}
