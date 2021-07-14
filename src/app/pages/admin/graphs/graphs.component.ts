import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe ,formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapter  } from './custom-date-adapter';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

//npm install ng2-charts@2.2.3 --save --force
//npm install chart.js@2.9.3 --save


/* import { zoom } from 'chartjs-plugin-zoom'; */

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ]
})
export class GraphsComponent implements OnInit, AfterViewInit, OnDestroy {
  //// Varibale con las que se generara la grafica posteriormente
  lineChartData: ChartDataSets[] = [
    { data: [], label: '' },
  ];
  lineChartLabels: Label[] = [];
  lineChartOptions = {
    responsive: true,
  };
  lineChartColors: Color[] = [];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line' as ChartType;
  ////

  //Columnas de la tabla
  displayedColumns: string[] = ['type', 'valor', 'time_stamp'];
  //Tabla
  dataSource = new MatTableDataSource();
  //Gráfico
  chart:any;

  actualTime: Date;
  maxTime: Date | string | null | undefined;
  minTime: Date | string | null | undefined;
  filas: any;
  action:boolean;

  fileName:string;
  historico:Object[] | any;

  grafica: boolean;
  componente:number;

  private subscriptionAsk:Subscription = new Subscription;

  selected:any;


  constructor(private http: HttpClient, private DatePipe: DatePipe, private router: ActivatedRoute) {
    this.maxTime = new Date();
    this.minTime = new Date();
    this.filas = new Number;
    this.action = false;
    this.fileName = "Datos.xlsx";
    this.historico = [];
    this.dataSource.data = [null];
    this.grafica = false
    this.componente = 0;
    this.actualTime = new Date();

  }

  //Paginar y ordenar la tabla
  @ViewChild(MatSort, { static: false}) sort: MatSort = new MatSort;
  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);

  ngOnInit() {
    this.dataSource.data = [null];
    this.dataSource.paginator = this.paginator;
    this.router.params.subscribe((e) => {
      if(e){
        this.selected=e.id;
        this.componente=e.id;
      }
    });
  }

  ngAfterViewInit():void { }

  ngOnDestroy(): void {
    this.subscriptionAsk.unsubscribe();
  }

  oneHour(){
    var time = new Date();
    this.maxTime = formatDate(time, 'yyyy-MM-ddTHH:mm:ss','en');
    this.minTime = formatDate(time.setHours(time.getHours()-1), 'yyyy-MM-ddTHH:mm:ss', 'en');

    var maxTime_ = this.DatePipe.transform(this.maxTime, "yyyy-MM-ddTHH:mm:SS", "GMT")
    var minTime_ = this.DatePipe.transform(this.minTime, "yyyy-MM-ddTHH:mm:SS", "GMT")

    this.peticion(minTime_,maxTime_);
  }

  oneDay(){
    var time = new Date();
    this.maxTime = formatDate(time, 'yyyy-MM-ddTHH:mm:ss', 'en');
    this.minTime = formatDate(time.setHours(time.getHours()-24), 'yyyy-MM-ddTHH:mm:ss', 'en');
    
    var maxTime_ = this.DatePipe.transform(this.maxTime, "yyyy-MM-ddTHH:mm:SS", "GMT")
    var minTime_ = this.DatePipe.transform(this.minTime, "yyyy-MM-ddTHH:mm:SS", "GMT")

    this.peticion(minTime_,maxTime_);
  }

  oneWeek(){
    var time = new Date();
    this.maxTime = formatDate(time, 'yyyy-MM-ddTHH:mm:ss', 'en');
    this.minTime = formatDate(time.setHours(time.getHours()-(24*7)), 'yyyy-MM-ddTHH:mm:ss', 'en');
    
    var maxTime_ = this.DatePipe.transform(this.maxTime, "yyyy-MM-ddTHH:mm:SS", "GMT")
    var minTime_ = this.DatePipe.transform(this.minTime, "yyyy-MM-ddTHH:mm:SS", "GMT")

    this.peticion(minTime_,maxTime_);
  }

  fechas(minTime: any, maxTime: any){
    const fecha_max = maxTime.value;
    const fecha_min = minTime.value;

    var maxtime = new Date(fecha_max);
    var mintime = new Date(fecha_min);

    var maxTime_ = this.DatePipe.transform(maxtime, "yyyy-MM-ddTHH:mm:SS", "GMT");
    var minTime_ = this.DatePipe.transform(mintime, "yyyy-MM-ddTHH:mm:SS", "GMT");

    this.maxTime = maxTime_?.toString();
    this.minTime = minTime_?.toString();

    this.peticion(this.minTime,this.maxTime);
  }

  peticion(minTime: string|any, maxTime: string|any){
    this.maxTime = this.maxTime+'Z';
    this.minTime = this.minTime+'Z';
    let params = new HttpParams();
    params = params.append('inicio', this.minTime);
    params = params.append('final', this.maxTime);

    this.subscriptionAsk.add(
      this.http.get("http://13.80.8.137:80/api/1/graficar/1/1/1", {params:params}).subscribe((data) => {
        this.printData(data)
      })
    );
    //console.log(minTime, maxTime);
  } 

  //Metodo para pintar la tabla de los datos
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
      this.dataSource.data = historico;
      this.filas = historico.length;
      
      for (var i = 0; i < this.historico.length; i++) {
        this.historico[i].time_stamp = moment(this.historico[i].time_stamp).format("DD/MM/yyyy HH:mm:ss");
      }
    }
    if (this.grafica == true){
      this.grafica = !this.grafica;
      this.graficar();
    }
    this.dataSource.sort = this.sort;
    setTimeout(() =>{
      this.dataSource.sort = this.sort;
    });
  }
  
  //Metodo para filtrar la tabla por el tipo de dato seleccioando
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

  //Metodo para exportar en excel los datos
  exportExcel(): void {  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, this.fileName);
  }

  //Metodo que lanza la grafica al pulsar en el toogle button
  graficar():void {
    this.grafica = !this.grafica;
    if (this.grafica == true){
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

  //Metodo para indicar sobre que componente queremos gráficar. Hay que indicarlo en la peticion
  selectComponente(number:number){
    this.componente=1;
  }

}
