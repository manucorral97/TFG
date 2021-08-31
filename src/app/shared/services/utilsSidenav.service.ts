import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class UtilsSidenavService{
    private sidenavOpened = new BehaviorSubject<boolean>(false);
    sidenavOpened$ = this.sidenavOpened.asObservable();

    //Nos sirve para abrir (o cerrar) el menu lateral llamando a esta funcion desde cualquier punto de la aplicacion pasando true o false
    openSidenav(value:boolean):void{
        this.sidenavOpened.next(value);
    }
}