import { ChangeDetectorRef, Component, EventEmitter, Injectable, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ChartDataSets, ChartType, Chart } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from './custom-date-adapter';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ExportToCsv } from 'export-to-csv';
import { SharedService } from '@app/shared/services/shared.service';



//NO BORRAR ESTE COMENTARIO
// @ts-ignore
import * as zoomPlugin from 'chartjs-plugin-zoom';
import { FormBuilder, Validators } from '@angular/forms';

//npm install ng2-charts@2.2.3 --save --force
//npm install chart.js@2.9.3 --save

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css'],
  providers: [{ provide: DateAdapter, useClass: CustomDateAdapter }],
})

@Injectable({
  providedIn: 'root'
})
export class GraphsComponent implements OnInit, AfterViewInit, OnDestroy {
  //// Varibale con las que se generara la grafica posteriormente
  lineChartData: ChartDataSets[] = [{ data: [], label: '' }];
  lineChartLabels: Label[] = [];
  lineChartOptions: any = {
    responsive: true,
  };
  lineChartColors: Color[] = [];
  lineChartLegend = true;
  lineChartPlugins: any = [];
  lineChartType = 'line' as ChartType;
  ////

  //Columnas de la tabla
  displayedColumns: string[] = ['type', 'valor', 'time_stamp'];
  //Tabla
  dataSource = new MatTableDataSource();
  //Gráfico
  chart: any;

  actualTime: Date | string;
  maxTime: Date | string | null | undefined;
  minTime: Date | string | null | undefined;
  filas: any;
  action: boolean;

  historico: Object[] | any;

  grafica: boolean;
  componente: number;

  private subscriptionAsk: Subscription = new Subscription();

  selected: any;
  inputDates:boolean;

  datesForm = this.fb.group({
    minDate: [[], Validators.required],
    maxDate: [[], Validators.required]
  });


  private messageSource = new BehaviorSubject<any>("x");
  //currentMessage = this.messageSource.asObservable();
  currentMessage:any = "";

  constructor(
    private http: HttpClient,
    private DatePipe: DatePipe,
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private _bottomSheet: MatBottomSheet,
    private SharedService: SharedService
  ) {
    this.maxTime = new Date();
    this.minTime = new Date();
    this.filas = new Number();
    this.action = false;
    this.historico = [];
    this.dataSource.data = [null];
    ///
    this.grafica = false;
    this.componente = 0;
    ////
    this.actualTime = new Date().toISOString().split(".")[0];
    this.inputDates = false;
    
  }


  //Paginar y ordenar la tabla
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);


  ngOnInit() {
    //Inicialización de las porpiedades de la tabla (ordenar y paginar)
    this.dataSource.data = [null];
    this.dataSource.paginator = this.paginator;
    // Cuando venimos a esta página a traves de la ruta con parametros (en admin)
    this.router.params.subscribe((e) => {
      if (e) {
        this.selected = e.id;
        this.componente = e.id;
      }
    });
  }

  ngAfterViewInit(): void {}

  //Al cerrar el componente nos desusbcribimos de la peticion al back
  ngOnDestroy(): void {
    this.subscriptionAsk.unsubscribe();
  }

  //Para mostrar o no el formualrio de fechas personalizado
  showInputDates(){
    this.inputDates = true
  }

  //Tratamiento de las fechas por hora dia o semana
  onDates(duration:string){
    this.inputDates = false
    var time = new Date();
    this.maxTime = formatDate(time, 'yyyy-MM-ddTHH:mm:ss', 'en');
    if (duration == "hour"){
      this.minTime = formatDate(
        time.setHours(time.getHours() - 1),
        'yyyy-MM-ddTHH:mm:ss',
        'en'
      );
    } else if (duration == "day"){
      this.minTime = formatDate(
        time.setHours(time.getHours() - 24),
        'yyyy-MM-ddTHH:mm:ss',
        'en'
      );
    } else {
      this.minTime = formatDate(
        time.setHours(time.getHours() - 24 * 7),
        'yyyy-MM-ddTHH:mm:ss',
        'en'
      );
    }
    var maxTime_ = this.DatePipe.transform(
      this.maxTime,
      'yyyy-MM-ddTHH:mm:SS',
      'GMT'
    );
    var minTime_ = this.DatePipe.transform(
      this.minTime,
      'yyyy-MM-ddTHH:mm:SS',
      'GMT'
    );

    this.maxTime = maxTime_?.toString();
    this.minTime = minTime_?.toString();

    this.peticion(this.minTime, this.maxTime);
  }

  //Tratamiento de las fechas seleccionadas
  onPersonalizado(){
    const fecha_max = this.datesForm.value.maxDate;
    const fecha_min = this.datesForm.value.minDate;

    var maxtime = new Date(fecha_max);
    var mintime = new Date(fecha_min);

    var maxTime_ = this.DatePipe.transform(
      maxtime,
      'yyyy-MM-ddTHH:mm:SS',
      'GMT'
    );
    var minTime_ = this.DatePipe.transform(
      mintime,
      'yyyy-MM-ddTHH:mm:SS',
      'GMT'
    );

    this.maxTime = maxTime_?.toString();
    this.minTime = minTime_?.toString();

    this.peticion(this.minTime, this.maxTime);
  }

  //Peticion de los datos
  peticion(minTime: string | any, maxTime: string | any) {

    this.maxTime = this.maxTime + 'Z';
    this.minTime = this.minTime + 'Z';
    let params = new HttpParams();
    
    //this.maxTime="2021-06-15T16:03:00Z"
    //this.minTime="2021-06-14T16:03:00Z"

    params = params.append('inicio', this.minTime);
    params = params.append('final', this.maxTime);

    console.log(this.minTime);
    console.log(this.maxTime);



    this.subscriptionAsk.add(
      this.http.get('http://13.80.8.137:80/api/1/graficar/1/1/1', { params: params })
        .subscribe((data) => {
          this.printData(data);
        }, (err) => {
          console.log("Err:", err);
        })
    );
    
    //console.log(minTime, maxTime);
  }

  //Metodo para pintar la tabla de los datos
  printData(historico: Object | any) {
    this.action = true;
    this.historico = historico;
    var error = {
      no_data: true,
    };

    if (historico[0].no_data == error.no_data) {
      this.filas = 0;
    } else {
      //Eliminamos el ultimo (no_data = false)
      historico.splice(-1, 1);
      this.dataSource.data = historico;
      this.SharedService.setMessage(this.dataSource.data);
      this.filas = historico.length;

      for (var i = 0; i < this.historico.length; i++) {
        this.historico[i].time_stamp = moment(
          this.historico[i].time_stamp
        ).format('DD/MM/yyyy HH:mm:ss');
      }
    }
    if (this.grafica == true) {
      this.grafica = !this.grafica;
      this.graficar();
    }
    this.dataSource.sort = this.sort;
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
  }

  //Metodo para filtrar la tabla por el tipo de dato seleccioando
  getType(typeFilter: string | any) {
    var new_hist = this.historico;
    if (typeFilter == '') {
      this.dataSource.data = this.historico;
      this.filas = this.historico.length;
      return;
    }
    if (typeFilter != '') {
      const filt = (d: { type: string }) => d.type === typeFilter;
      this.dataSource.data = this.historico.filter(filt);
      this.filas = new_hist.length;
      return;
    }
  }



  //Metodo que lanza la grafica al pulsar en el toogle button
  graficar(): void {
    this.grafica = !this.grafica;
    //
    //this.grafica==true;
    //
    if (this.grafica == true) {
      let labels = [];
      for (var i = 0; i < this.historico.length / 3; i++) {
        labels[i] = this.historico[i].time_stamp;
      }
      this.lineChartLabels = labels;

      let data_temp = [];
      const filt_temp = (d: { type: string }) => d.type === 'temperatura';
      data_temp = this.historico.filter(filt_temp);

      let data_hume = [];
      const filt_hume = (d: { type: string }) => d.type === 'humedad';
      data_hume = this.historico.filter(filt_hume);

      let data_lumi = [];
      const filt_lumi = (d: { type: string }) => d.type === 'luminosidad';
      data_lumi = this.historico.filter(filt_lumi);

      for (var i = 0; i < data_temp.length; i++) {
        data_temp[i] = data_temp[i].valor;
      }

      for (var i = 0; i < data_hume.length; i++) {
        data_hume[i] = data_hume[i].valor;
      }

      for (var i = 0; i < data_lumi.length; i++) {
        data_lumi[i] = data_lumi[i].valor;
      }

      this.lineChartData = [
        { data: data_temp, label: 'Temperatura' },
        { data: data_hume, label: 'Humedad' },
        { data: data_lumi, label: 'Luminosidad' },
        //{ data: [85, 20, 78, 75, 13, 75], label: 'Crude oil pricessss' },
      ];

      this.lineChartPlugins = [zoomPlugin];

      this.lineChartOptions = {
        responsive: true,
        pan: {
          enabled: true,
          drag: {
            enable:true,
          	borderColor: 'rgb(0,0,0)',
          	borderWidth: 5,
          	backgroundColor: 'rgb(225,225,225)'
          },
          mode: 'x',
          rangeMin: {
            // Format of min pan range depends on scale type
            x: null,
            y: null,
          },
          rangeMax: {
            // Format of max pan range depends on scale type
            x: null,
            y: null,
          },
          onPan: function () {
            //console.log('I was panned!!!');
          },
        },
        zoom: {
          enabled: true,
          wheel: {
            enabled: false,
          },
          pinch: {
            enabled: false
          },
          //drag: true,

          // Drag-to-zoom rectangle style can be customized
          drag: {
            enable:true,
          	borderColor: 'rgb(0,0,0)',
          	borderWidth: 5,
          	backgroundColor: 'rgb(225,225,225)'
          },

          // Zooming directions. Remove the appropriate direction to disable
          // Eg. 'y' would only allow zooming in the y direction
          mode: 'xy',

          rangeMin: {
            // Format of min zoom range depends on scale type
            x: null,
            y: null,
          },
          rangeMax: {
            // Format of max zoom range depends on scale type
            x: null,
            y: null,
          },

          // Speed of zoom via mouse wheel
          // (percentage of zoom on a wheel event)
          speed: 0.9,
          onZoom: function () {
            //console.log('I was zoomed!!!');
          },
        },
      };

      this.lineChartColors = [
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
  selectComponente(number: number) {
    this.componente = 1;
  }

  //Metodo para reseetear el zoom de la grafica
  resetZoom(){
    //console.log("Reset");
    this.graficar();
    this.graficar();

  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet);
  }
}


/* Este segundo componnete nos sirve para, al pulsar en descargar tabla, elegir entre CVS y XLSX */
@Component({
  selector: 'bottom-graphs-sheet',
  templateUrl: './bottom-graphs-sheet.html',
  styleUrls: ['./bottom-graphs-sheet.css'],
  providers:[
    GraphsComponent
  ]
})
export class BottomSheetOverviewExampleSheet implements OnInit{

  data:any;
  constructor(private SharedService: SharedService) { }

  ngOnInit(): void {
    this.data = this.SharedService.getMessage();    
  }

  exportCSV(){
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      //showTitle: true,
      //title: 'My Awesome CSV',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename:"Datos",
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.data);

  }

  //Metodo para exportar en excel los datos
  exportXLSX(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, "Datos.xlsx");
  }

}