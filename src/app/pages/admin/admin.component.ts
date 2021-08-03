import {
  CdkDragDrop,
  CdkDragEnd,
} from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  OnInit,
  SecurityContext,
  ViewChild,
} from '@angular/core';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AlarmComponent } from './components/alarm/alarm.component';
import { Output, EventEmitter } from '@angular/core';
import { CropperComponent } from 'angular-cropperjs';



export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

var ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  template: ` <div>Interval: {{ observable$ | async }}</div>`,
})
export class AdminComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];
  dataSource = ELEMENT_DATA;
  components = [
    {
      id: '0',
      name: 'Sensor 1',
      icon: 'sensors',
      x:0,
      y:0
    },
    {
      id: '1',
      name: 'Sensor 2',
      icon: 'sensors',
      x:0,
      y:0
    },
  ];

  granjas = [
    {
      id: 1,
      name: 'Granja 1',
    },
    {
      id: 2,
      name: 'Granja 2',
    },
    {
      id: 3,
      name: 'Granja 3',
    },
  ];


  newName= this.fb.group({
    name:["", [Validators.required]],
  });

  granja: number;

  //Posicion de reset de las cajas (y de inicio...)
  dragPositionReset = { x: 0, y: 0 };
  //dragPositionReset = { x: 222, y: -110 };
  //Posicion actual de las cajas
  dragPositionState = { x: 0, y: 0 };
  //Posicion de inicio de las cajas
  //dragPositionInit = { x: 110, y: 0 };

  private urlGET: any = 'http://13.80.8.137/agm';
  urlEmpty = 'https://www.elegantthemes.com/blog/wp-content/uploads/2014/01/import-export-wordpress-content.png';
  url: string | any;

  trustHTML: string | null;
  //ejemplo: any = "<h1>Hola</h1><script>console.log('Hello! I am an alert box!');</script>";
  elem: any;
  frame: string | any;
  done: boolean;
  alarmas: number | string;
  data: any;

  private subscriptionUp: Subscription = new Subscription;
  private subscriptionDown: Subscription = new Subscription;


  offset: any;
  isOpen: boolean = false;
  @Output() toggleSidenav = new EventEmitter();

  imageUrl:string = '';
  imageResult:string = '';
  @ViewChild('angularCropper') angularCropper: CropperComponent = new CropperComponent;
  config = {
    zoomable:true,
    cropBoxResizable: true,
    aspectRatio:640/360,
    background:false,
    responsive:true,
/*     data:{
      width: 640,
      height:360
    } */
  };  

  //private cropper: Cropper;
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private route: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: any
  ) {
    this.trustHTML = '';
    this.granja = 0;
    this.frame = '';
    this.url = '';
    this.done = false;
    this.alarmas = 2;
    this.data = '';
    this.offset = { x: 0, y: 0 };

  }

  ngOnInit(): void {
    this.urlGET = this.sanitizer.sanitize(
      SecurityContext.URL,
      this.sanitizer.bypassSecurityTrustUrl(this.urlGET)
    );

    this.http.get(this.urlGET, { responseType: 'text' }).pipe(first()).subscribe(
        (data) =>
          (this.trustHTML = this.sanitizer.sanitize(
            SecurityContext.HTML,
            this.sanitizer.bypassSecurityTrustHtml(data)
          ))
      );

    //Timeout to know alarms numbers (save data in this.data and save number in this.alarmas)

    this.elem = document.getElementById('container-center');

    //this.dragPositionInit.x = this.dragPositionState.x;
    //this.dragPositionInit.y = this.dragPositionState.y;
  }

  ngOnDestroy() {
    this.subscriptionUp.unsubscribe();
    this.subscriptionDown.unsubscribe();
  }

  onSelectFile(e: any) {
    //this.imageUrl = ' ';
    if (e.target.files) {
      var reader = new FileReader();
      const file = e.target.files[0];
      
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      }
    }
  }

  getCroppedImage(){
    this.imageUrl = '';
    this.url = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg');


    /* Ya hace base 64 de la imagen */
    this.frame = this.url;    

    //Posible tratamiento del id de la instalacion 
    var userID = this.authService.userID;
    console.log(userID);
    var new_id = userID + this.granja.toString();
    console.log(new_id);
    //
    //Cuerpo de la peticion para almacenar la imagen
    const body = JSON.stringify({
      //Pasar una cadena del id del usuario + el id de la instalacion
      id_instalacion: this.granja,
      frame: this.frame,
    });

    //Peticion para almacenar la imagen 
    this.subscriptionUp.add(
      this.http.post('http://13.80.8.137/api/1/uploadimage', body).subscribe(
        (res) => {
          this.done = true;
        },
        (err) => {
          //Si el error que nos da es este, se ha guardado la imagen
          if (
            err.error.text == 'Imagen de la instalación almacenada correctamente.'
          ) {
            this.done = true;
            this.url = this.frame;
            console.log(err.error.text);
          }
        }
      )
    );
    
  }

  //Metodo para poner la imagen en pantalla completa. Cambia la clase del div para verse más grande
  openFullScreen() {
    //Cambiar la imagen a 100%
    const section_img = this.document.getElementById('section_img');
    const img = this.document.getElementById('img');

    //const img = this.document.getElementById('img');
    section_img.className += ' fulldisplay';
    img.className += ' fulldisplay_img';

    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
    //Manejar entrada de letra esc
    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('mozfullscreenchange', exitHandler);
    document.addEventListener('MSFullscreenChange', exitHandler);
    function exitHandler(this: any) {
      if (!document.fullscreenElement) {
        //img.className = '';
        section_img.className = 'section_img';
        img.className = 'img'
      }
    }
  }
  
  /* Close fullscreen */
  /*closeFullScreen(): void {
    console.log('entra');
    const img = this.document.getElementById('img');
    img.className = '';
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      // Firefox
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      // Chrome, Safari and Opera
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      // IE/Edge
      this.document.msExitFullscreen();
    }
  } */

  //Metodo para devolver las cajas a su posicion de inicio
  returnHome(sensor: any) {
    console.log(sensor);
    this.dragPositionReset = {
      x: 0 ,//+ sensor.id * 114,
      y: 0,
    };
  }

  //Metodo que guarda las imagenes de las cajas al soltarse (not implemented)
  savePosition($event: CdkDragEnd, sensor: any) {
    //console.log("ID_Componente: ", id);
    var id_number = parseInt(sensor.id);

    //¿OBTENER TAMAÑO DE LA VENTANA TAL VEZ?
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    console.log("Ventana:\nWidth -> ", windowWidth, "\nHeight -> ", windowHeight);


    //Limites del contenedor
    var container = this.document.getElementById('container-center');
    let topOffset = container.getBoundingClientRect().top;
    let leftOffset = container.getBoundingClientRect().left;
    let rightOffset = container.getBoundingClientRect().right;
    let bottomOffset = container.getBoundingClientRect().bottom;
    let height = container.getBoundingClientRect().height;
    let width = container.getBoundingClientRect().width;
    // X = LEFT
    //let x = container.getBoundingClientRect().x;
    // Y = TOP
    //let y = container.getBoundingClientRect().y;

    console.log("IMAGEN\nTOP: ", topOffset, "\nLEFT: ", leftOffset, "\nRIGHT: ", rightOffset, "\nBOTTOM: ", bottomOffset, "\nHEIGHT: ", height, "\nWIDTH: ", width);


    //Cada sensor tiene un desfase de 114 px en la barra inferior (Se coge el punto mas a la izquierda, asique si quisieramos ocger el centro del box, sumar 57px)
    this.dragPositionState.x = $event.source.getFreeDragPosition().x + id_number*114;

    //this.dragPositionState.y = bottomOffset + $event.source.getFreeDragPosition().y + 268.25;
    this.dragPositionState.y = bottomOffset-$event.source.getFreeDragPosition().y;

    console.log(
      'Posiciones a guardar\nX:', this.dragPositionState.x, 
      "\nY:", this.dragPositionState.y
    );




   /*  this.dragPositionState.x = this.dragPositionInit.x + this.offset.x;
    this.dragPositionState.y = this.dragPositionInit.y + this.offset.y;

    console.log("x", this.dragPositionState.x, "y",this.dragPositionState.y, "offset",this.offset); */


    //Guardar en un drgposition
  }

  //Cambia el icono y la informacion de la caja seleccionada al tipo de dato seleccionado
  showInfo(component: any, tipo:string) {
     //console.log(component, tipo);
     this.components[component.id].icon = tipo;
  }

  //Metodo que cambia todos los iconos de las cajas 
  changeAll(tipo:string){
    this.components.forEach(c => {
      c.icon = tipo;
    });
  }

  //Metodo para elegir cada una de las granjas a disposicion del usuario
  selectGranja(number: number) {
    this.granja = number;
    this.done = false;
    /* Pedimos la imagen almacenada */
    this.subscriptionDown.add(
      this.http
      .get(`http://13.80.8.137/api/1/downloadimage/${this.granja}`)
      .subscribe(
        (res: any) => {
          //Tratamos la respuesta para sacar la imagen de ella
          this.url = res[0].frame.slice(20, res[0].frame.length);
          this.url =
            'data:image/jpeg;base64,' +
            res[0].frame.slice(20, res[0].frame.length);
          this.done = true;
        },
        (err) => {
          this.done = false;
          //console.log(err);
        }
      )
    );
    //Reseteamos la posicion al cambiar de granja (Habrá que pedir las posiciones almacenadas)
    this.dragPositionReset = {
      x: this.dragPositionReset.x,
      y: this.dragPositionReset.y,
    };
  }

  //Metodo que nos lleva a la pagina de graficar directamente
  goGraphs(component:any){
    this.route.navigate(['admin/graphs', component]);
  }

  //Metodo para cambiar el nombre de un componente
  changeName(component:any){
    this.components[component.id].name = this.newName.value.name;
  }

  alarmFunction(){
    
    const dialogRef = this.dialog.open(AlarmComponent, {
      hasBackdrop: true,
      height: '500px',
      width: '700px',
      data: {
        title: 'Registro de Alarmas',
        data: this.data
      },
    });
    //Reseteamos el contador de alarmas
    this.alarmas = ''
  }

  alarmFunction2(){
    
    this.toggleSidenav.emit();
    this.isOpen =! this.isOpen;
  }

  deleteRow(i: any){
    console.log(i);
    //this.dataSource = this.dataSource.splice(i,1);
  }

}
