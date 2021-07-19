import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit, OnDestroy {

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private http:HttpClient,) { }

  ngOnInit(): void {
    //Peticion de alertas
    
  }

  ngOnDestroy(): void {
    //Liberamos la peticion
  }

}
