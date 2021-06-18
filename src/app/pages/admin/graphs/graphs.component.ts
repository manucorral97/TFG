import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {

  maxTime: Date | string;
  minTime: Date | string;
  constructor() {
    this.maxTime = new Date();
    this.minTime = new Date();
  }

  ngOnInit(): void {
  }

  oneHour(){
    var time = new Date();
    this.maxTime = formatDate(time, 'yyyy/MM/dd HH:mm:ss', 'en');
    this.minTime = formatDate(time.setHours(time.getHours()-1), 'yyyy/MM/dd HH:mm:ss', 'en');
    this.peticion(this.minTime,this.maxTime);
  }

  oneDay(){
    var time = new Date();
    this.maxTime = formatDate(time, 'yyyy/MM/dd HH:mm:ss', 'en');
    this.minTime = formatDate(time.setHours(time.getHours()-24), 'yyyy/MM/dd HH:mm:ss', 'en');
    this.peticion(this.minTime,this.maxTime);
  }

  oneWeek(){
    var time = new Date();
    this.maxTime = formatDate(time, 'yyyy/MM/dd HH:mm:ss', 'en');
    this.minTime = formatDate(time.setHours(time.getHours()-(24*7)), 'yyyy/MM/dd HH:mm:ss', 'en');
    this.peticion(this.minTime,this.maxTime);
  }

  fechas(minTime: any, maxTime: any){
    this.maxTime = formatDate(maxTime.value, 'yyyy/MM/dd', 'en')
    this.minTime = formatDate(minTime.value, 'yyyy/MM/dd', 'en')

    this.peticion(this.minTime,this.maxTime);
  }

  peticion(minTime: string, maxTime: string){
    console.log(minTime, maxTime);

  }  

}
