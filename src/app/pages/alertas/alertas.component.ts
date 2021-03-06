import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ExportToCsv } from 'export-to-csv';
import * as XLSX from 'xlsx';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SharedService } from '@app/shared/services/shared.service';

export interface PeriodicElement {
  id: number;
  name: string;
  valor: string;
  position: number;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    id: 0,
    position: 1,
    name: '50',
    valor: 'Temperatura',
    weight: '30-40',
    symbol: '2021-08-15 19:00',

  },
  { id: 1, position: 2, name: '20', weight: "25-30", symbol: '2021-08-15 19:01', valor: 'Humedad'},
];

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css'],
})
export class AlertasComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'valor','name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  //Tabla
  //dataSource = new MatTableDataSource();

  maxTime: Date | string | null | undefined;
  minTime: Date | string | null | undefined;
  filas: any;
  inputDates: boolean;
  historico: Object[] | any;
  action: boolean;
  actualTime: Date | string;


  datesForm = this.fb.group({
    minDate: [[], Validators.required],
    maxDate: [[], Validators.required],
  });

  private subscriptionAsk: Subscription = new Subscription();

  constructor(
    private DatePipe: DatePipe,
    private http: HttpClient,
    private fb: FormBuilder,
    private _bottomSheet: MatBottomSheet
  ) {
    //this.dataSource.data = [null];
    this.maxTime = new Date();
    this.minTime = new Date();
    this.filas = new Number();
    this.inputDates = false;
    this.historico = [];
    this.action = false;
    this.actualTime = new Date;
  }

  //Paginar y ordenar la tabla
  @ViewChild(MatSort, { static: false }) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);

  ngOnInit(): void {
    //Inicializaci??n de las porpiedades de la tabla (ordenar y paginar)
    /*     this.dataSource.data = [null];
    this.dataSource.paginator = this.paginator; */
  }

  ngOnDestroy(): void {
    this.subscriptionAsk.unsubscribe();
  }

  //Tratamiento de las fechas por hora dia o semana
  onDates(duration: string) {
    this.inputDates = false;
    var time = new Date();
    this.maxTime = formatDate(time, 'yyyy-MM-ddTHH:mm:ss', 'en');
    if (duration == 'hour') {
      this.minTime = formatDate(
        time.setHours(time.getHours() - 1),
        'yyyy-MM-ddTHH:mm:ss',
        'en'
      );
    } else if (duration == 'day') {
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
  onPersonalizado() {
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
    params = params.append('inicio', this.minTime);
    params = params.append('final', this.maxTime);

    console.log(this.minTime);
    console.log(this.maxTime);

    /*
    this.subscriptionAsk.add(
      this.http
        .get('http://13.80.8.137:80/api/1/graficar/1/1/1', { params: params })
        .subscribe((data) => {
          this.printData(data);
        })
    );*/
    //console.log(minTime, maxTime);
  }

  //Metodo para pintar la tabla de los datos
  /*   printData(historico: Object | any) {
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
      this.filas = historico.length;

      for (var i = 0; i < this.historico.length; i++) {
        this.historico[i].time_stamp = moment(
          this.historico[i].time_stamp
        ).format('DD/MM/yyyy HH:mm:ss');
      }
    }

    this.dataSource.sort = this.sort;
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
  } */

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet);
  }
}


/* Este segundo componnete nos sirve para, al pulsar en descargar tabla, elegir entre CVS y XLSX */
@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: './bottom-sheet-overview-example-sheet.html',
  styleUrls: ['./bottom-sheet-overview-example-sheet.css'],
})
export class BottomSheetOverviewExampleSheet implements OnInit {
  constructor(private SharedService: SharedService) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  exportCSV() {
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
      filename: 'Alertas',
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(ELEMENT_DATA);
  }

  exportXLSX() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ELEMENT_DATA);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alertas');
    XLSX.writeFile(wb, 'Alertas.xlsx');
  }
}
