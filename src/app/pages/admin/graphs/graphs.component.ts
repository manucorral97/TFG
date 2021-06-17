import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {

  maxTime: Date;
  minTime: Date;
  constructor() {
    this.maxTime = new Date();
    this.minTime = new Date();
  }

  ngOnInit(): void {
  }

  oneHour(){
    console.log("Una hora");
    var time = new Date();
    const maxTime = formatDate(time, 'yyyy/MM/dd HH:mm:ss', 'en');
    const minTime = formatDate(time.setHours(time.getHours()-1), 'yyyy/MM/dd HH:mm:ss', 'en');
    this.peticion(maxTime,minTime);
  }

  oneDay(){
    console.log("Un dia");
    var time = new Date();
    const maxTime = formatDate(time, 'yyyy/MM/dd HH:mm:ss', 'en');
    const minTime = formatDate(time.setHours(time.getHours()-24), 'yyyy/MM/dd HH:mm:ss', 'en');
    this.peticion(maxTime,minTime);
  }

  oneWeek(){
    console.log("Una semana");
    var time = new Date();
    const maxTime = formatDate(time, 'yyyy/MM/dd HH:mm:ss', 'en');
    const minTime = formatDate(time.setHours(time.getHours()-(24*7)), 'yyyy/MM/dd HH:mm:ss', 'en');
    this.peticion(maxTime,minTime);
  }

  fechas(){
    console.log("Rango de fechas");
    var time = new Date();
    const maxTime = ""
    const minTime = ""
    this.peticion(maxTime,minTime);
  }

  peticion(minTime: string, maxTime: string){
    console.log(maxTime, minTime);

  }


  

}
