//Nos permite enviar datos entre componentes

import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class SharedService{
    message:any;
    constructor () { }
    setMessage(data: any){
        this.message = data;
    }
    getMessage(){
        return this.message;
    }


    //Cogemos el nombre del login para pasarlo al header
    private getUserName = new Subject<string>();
    getUserNameObservable = this.getUserName.asObservable();

    setUserName(username:string) {
        this.getUserName.next(username);
    }

    //Cogemos el nombre de la instalacion para pasarlo al header
    private getInstalacion = new Subject<string | number>();
    getInstalacionObservable = this.getInstalacion.asObservable();

    setInstalacion(inst:string | number) {
        this.getInstalacion.next(inst);
    }

}