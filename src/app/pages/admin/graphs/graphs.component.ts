import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

const initial_data = [null];

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['type', 'temperatura', 'time_stamp'];
  dataSource = new MatTableDataSource(initial_data);


  maxTime: Date | string;
  minTime: Date | string;
  urlHistorical: any = "http://13.80.8.137:80/api/1/graficar/1/1";
  filas: any;
  action:boolean;

  fileName:string;
  historico:Object[] | any;

  constructor(private http: HttpClient) {
    this.maxTime = new Date();
    this.minTime = new Date();
    this.filas = new Number;
    this.action = false;
    this.dataSource.sort = this.sort;
    this.fileName = "Datos.xlsx";
    this.historico = [];

  }
  @ViewChild(MatSort, { static: false}) 
  sort: MatSort = new MatSort;
  //@ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator;

  ngAfterViewInit():void {
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;

  }

  oneHour(){
    var time = new Date();
    this.maxTime = formatDate(time, 'yyyy-MM-ddTHH:mm:ss','en');
    this.minTime = formatDate(time.setHours(time.getHours()-1), 'yyyy-MM-ddTHH:mm:ss', 'en');
    this.peticion(this.minTime,this.maxTime);
  }

  oneDay(){
    var time = new Date();
    this.maxTime = formatDate(time, 'yyyy-MM-ddTHH:mm:ss', 'en');
    this.minTime = formatDate(time.setHours(time.getHours()-24), 'yyyy-MM-ddTHH:mm:ss', 'en');
    this.peticion(this.minTime,this.maxTime);
  }

  oneWeek(){
    var time = new Date();
    this.maxTime = formatDate(time, 'yyyy-MM-ddTHH:mm:ss', 'en');
    this.minTime = formatDate(time.setHours(time.getHours()-(24*7)), 'yyyy-MM-ddTHH:mm:ss', 'en');
    this.peticion(this.minTime,this.maxTime);
  }

  fechas(minTime: any, maxTime: any){
    this.maxTime = formatDate(maxTime.value, 'yyyy-MM-ddT00:00:00', 'en')
    this.minTime = formatDate(minTime.value, 'yyyy-MM-ddT00:00:00', 'en')

    this.peticion(this.minTime,this.maxTime);
  }

  peticion(minTime: string, maxTime: string){
    this.maxTime = this.maxTime+'Z';
    this.minTime = this.minTime+'Z';
    let params = new HttpParams();
    params = params.append('inicio', this.minTime);
    params = params.append('final', this.maxTime);

    this.http.get(this.urlHistorical, {params:params}).subscribe((data) =>
      this.printData(data)
    );
    

    console.log(minTime, maxTime);
  } 

  printData(historico: Object | any){
    this.action=true;
    this.historico = historico;
    var error = {
      "no_data": true
    };

    //id_datahunter: 1 temperatura: 27.6 time_stamp: "2021-06-13T17:05:52Z" type: "temperatura"

    if (historico[0].no_data == error.no_data){
      this.filas = 0
    }else{
      //Eliminamos el ultimo (no_data = false)
      //historico.splice(-1,1);

      //historico.splice(20,100000);
      this.dataSource.sort = this.sort;
      this.dataSource.data = historico;
      this.dataSource.sort = this.sort;
      this.filas = historico.length;
      
    }
    
  }
  

  getType(typeFilter: string|any){

    function getFilteredByKey(array: any[], key: string, value: any) {
      return array.filter(function(e) {
        return e[key] == value;
      });
    }
    
    console.log(typeFilter);
    var hist = this.historico;
    var new_hist = "";
    var retotrno = getFilteredByKey (hist, "type", typeFilter);

  
    console.log(retotrno);

    //filtrar hist!!!! No consigo acceder a la key de type
    for (var data in hist){
      if (hist[data].type == typeFilter){
        hist = this.historico.filte

      }
    }
    console.log(hist[0].temperatura);

    this.dataSource.data = hist;
    this.filas = hist.length;
      
  }


  exportexcel(): void {  
    let element = document.getElementById('data'); 
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, this.fileName);
    
  }

}
