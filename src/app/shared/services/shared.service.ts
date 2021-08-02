//Nos permite enviar datos entre componentes

import { Injectable } from "@angular/core";

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
}