import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-threshold',
  templateUrl: './threshold.component.html',
  styleUrls: ['./threshold.component.css']
})
export class ThresholdComponent implements OnInit {

  //Componente que se lanza al pulsar en el boton de threshold por cada componnete
  constructor(@Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
  }

  //Función que recoge los valores introducidos por el usuario y que hanra que registrar en el servidor
  valueSlider($event:any, dato:string, tipo:string){
    console.log("Sensor:",this.data.data.id, dato, $event.value, tipo);
  }

}
