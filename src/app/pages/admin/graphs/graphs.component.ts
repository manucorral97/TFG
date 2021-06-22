import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Chart, ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
/* import { zoom } from 'chartjs-plugin-zoom'; */

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit, AfterViewInit {
  //// To show example and initizalice (set to null)
  lineChartData: ChartDataSets[] = [
    { data: [85, 72, 78, 75, 77, 75], label: 'Crude oil prices' },
  ];

  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line' as ChartType;
  ////


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

  @ViewChild(MatSort, { static: false}) sort: MatSort = new MatSort;
  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit():void {
    this.dataSource.sort = this.sort;
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
    //console.log(minTime, maxTime);
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
      this.filas = historico.length;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
    if (this.grafica == true){
      this.grafica = !this.grafica;
      this.graficar();
    }
    this.dataSource.sort = this.sort;
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
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.grafica = !this.grafica;

    let labels = [];
    for (var i = 0; i < this.historico.length/3; i++) {
      labels[i] = this.historico[i].time_stamp;
    }
    this.lineChartLabels = labels;

    let data_temp = [];
    const filt_temp = (d: { type: string; }) => d.type === "temperatura";
    data_temp = this.historico.filter(filt_temp);

    let data_hume = [];
    const filt_hume = (d: { type: string; }) => d.type === "humedad";
    data_hume = this.historico.filter(filt_hume);

    let data_lumi = [];
    const filt_lumi = (d: { type: string; }) => d.type === "luminosidad";
    data_lumi = this.historico.filter(filt_lumi);

    for (var i = 0; i<data_temp.length; i++){
      data_temp[i] = data_temp[i].valor
    }

    for (var i = 0; i<data_hume.length; i++){
      data_hume[i] = data_hume[i].valor
    }

    for (var i = 0; i<data_lumi.length; i++){
      data_lumi[i] = data_lumi[i].valor
    }


    this.lineChartData = [
      { data: data_temp, label: 'Temperatura' },
      { data: data_hume, label: 'Humedad' },
      { data: data_lumi, label: 'Luminosidad' },
      //{ data: [85, 20, 78, 75, 13, 75], label: 'Crude oil pricessss' },
    ];

    this.lineChartPlugins = [
      
    ];

    this.lineChartOptions = {
      responsive: true,
      
    };

    this.lineChartColors= [
      {
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.301)',
      },
      {
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.397)',
      },
      {
        borderColor: 'yellow',
        backgroundColor: 'rgba(255, 255, 0, 0.363)',
      },
    ];
    


  }

}
