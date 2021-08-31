import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-threshold',
  templateUrl: './threshold.component.html',
  styleUrls: ['./threshold.component.css']
})
export class ThresholdComponent implements OnInit {

  minLum:number;
  minHum:number;
  minTem:number;
  maxLum:number;
  maxHum:number;
  maxTem:number;

  //Componente que se lanza al pulsar en el boton de threshold por cada componnete
  constructor(@Inject(MAT_DIALOG_DATA) public data:any) { 
    this.minLum = 0;
    this.minHum = 0;
    this.minTem = 0;
    this.maxLum = 0;
    this.maxHum = 0;
    this.maxTem = 0;
  }


  ngOnInit(): void {
  }

  //Función que recoge los valores introducidos por el usuario y que hanra que registrar en el servidor
  valueSlider($event:any, dato:string, tipo:string){
    console.log("Sensor:",this.data.data.id, dato, $event.value, tipo);
    //Almacenar valor en cada uno de las variables
  }
  confirm(){
    //Almacenar valores en BBDD
  }

}
