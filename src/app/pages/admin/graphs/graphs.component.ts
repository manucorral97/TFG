import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js';
import * as XLSX from 'xlsx';
import { MatPaginatorIntl } from '@angular/material/paginator';

const initial_data = [null];

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['type', 'valor', 'time_stamp'];
  dataSource = new MatTableDataSource();
  chart:any;

  maxTime: Date | string;
  minTime: Date | string;
  urlHistorical: any = "http://13.80.8.137:80/api/1/graficar/1/1/1";
  filas: any;
  action:boolean;

  fileName:string;
  historico:Object[] | any;

  grafica: boolean

  constructor(private http: HttpClient) {
    this.maxTime = new Date();
    this.minTime = new Date();
    this.filas = new Number;
    this.action = false;
    this.dataSource.sort = this.sort;
    this.fileName = "Datos.xlsx";
    this.historico = [];
    this.grafica = false
  }

  @ViewChild(MatSort) sort: MatSort = new MatSort;
  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);

  ngOnInit() {
  
  }

  ngAfterViewInit():void {
    this.dataSource.data = [null];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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

    this.http.get(this.urlHistorical, {params:params}).subscribe((data) => {
      this.printData(data)
    });
    console.log(minTime, maxTime);
  } 

  printData(historico: Object | any){
    this.action=true;
    this.historico = historico;
    var error = {
      "no_data": true
    };

    if (historico[0].no_data == error.no_data){
      this.filas = 0
    }else{
      //Eliminamos el ultimo (no_data = false)
      historico.splice(-1,1);
      //historico.splice(20,100000);
      this.dataSource.data = historico;
      console.log("Tengo los datos");
      this.filas = historico.length;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log("pagino");
    }
  }
  
  getType(typeFilter: string|any){
    var new_hist = this.historico;
    if (typeFilter == ""){
      this.dataSource.data = this.historico;
      this.filas = this.historico.length;
      return;
    }
    if(typeFilter != ""){
      const filt = (d: { type: string; }) => d.type === typeFilter;
      this.dataSource.data = this.historico.filter(filt);
      this.filas = new_hist.length;
      return;
    } 
  }

  exportExcel(): void {  
    let element = document.getElementById('data'); 
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, this.fileName);
    
  }

  graficar():void {
    const data = {
      labels: ["enero", "febrero"],
      datasets: [
        {
          label: 'Dataset 1',
          data: this.historico.valor
        },
        {
          label: 'Dataset 2',
          data: this.historico.type
        }
      ]
    }
    this.grafica = !this.grafica;
    console.log("A graficar!");
    this.chart = new Chart('canvas', {
      type:'line',
      data:data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Line Chart'
          }
        }
      },
      },
    )

    var hashtags = ["activewear", "adidas", "aloyoga", "batterseapark", "outdoors", "park", "training", "winter", "workout", "workoutwednesday"]
    var avg_likes = [1185, 5311, 5521, 1713, 949, 321, 2860, 2661, 18899, 8108]

    var chart:any = document.getElementById("chart");
    var myBarChart = new Chart(chart, {
      type: 'line',
      data: {
        labels: hashtags,
        datasets: [{
          data: avg_likes
        }]
      },
      options: {}
}); 

  }

}
