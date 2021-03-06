import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, SecurityContext } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '@app/pages/auth/auth.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {

  components = [
    {
      id: '0',
      name: 'Sensor 1',
      icon: 'sensors',
    }
  ];

  newName= this.fb.group({
    name:["", [Validators.required]],
  });

  granja: number;

  //Posicion de reset de las cajas (y de inicio...)
  dragPositionReset = { x: 0, y: 0 };
  //Posicion actual de las cajas
  dragPositionState = { x: 0, y: 0 };
  //Posicion de inicio de las cajas
  dragPositionInit = { x: 0, y: 0 };

  private urlGET: any = 'http://13.80.8.137/agm';
  //url = 'https://www.elegantthemes.com/blog/wp-content/uploads/2014/01/import-export-wordpress-content.png';
  url: string | any;

  trustHTML: string | null;
  //ejemplo: any = "<h1>Hola</h1><script>console.log('Hello! I am an alert box!');</script>";
  elem: any;
  frame: string | any;
  done: boolean;

  private subscriptionUp: Subscription = new Subscription;
  private subscriptionDown: Subscription = new Subscription;


  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private route: Router,
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: any
  ) {
    this.trustHTML = '';
    this.granja = 0;
    this.frame = '';
    this.url = '';
    this.done = false;
  }

  ngOnInit(): void {
    /* this.trustHTML = ''; */
    this.urlGET = this.sanitizer.sanitize(
      SecurityContext.URL,
      this.sanitizer.bypassSecurityTrustUrl(this.urlGET)
    );
    //this.ejemplo = this.sanitizer.sanitize(SecurityContext.HTML,this.sanitizer.bypassSecurityTrustHtml(this.ejemplo));
    //console.log(this.ejemplo);
    this.http
      .get(this.urlGET, { responseType: 'text' })
      .pipe(first())
      .subscribe(
        (data) =>
          (this.trustHTML = this.sanitizer.sanitize(
            SecurityContext.HTML,
            this.sanitizer.bypassSecurityTrustHtml(data)
          ))
      );

    this.elem = document.getElementById('container-center');

    this.dragPositionInit.x = this.dragPositionState.x;
    this.dragPositionInit.y = this.dragPositionState.y;
  }

  ngOnDestroy() {
    this.subscriptionUp.unsubscribe();
    this.subscriptionDown.unsubscribe();
  }

  onSelectFile(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      const file = e.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        /* Ya hace base 64 de la imagen */
        this.frame = reader.result;
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
                err.error.text == 'Imagen de la instalaci??n almacenada correctamente.'
              ) {
                this.done = true;
                this.url = this.frame;
                console.log(err.error.text);
              }
            }
          )
        );
      }
    }
  }

  //Metodo para poner la imagen en pantalla completa. Cambia la clase del div para verse m??s grande
  openFullScreen() {
    //Cambiar la imagen a 100%
    const img = this.document.getElementById('img');
    img.className += ' fulldisplay';

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
        img.className = '';
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
      x: this.dragPositionReset.x,
      y: this.dragPositionReset.y,
    };
  }

  //Metodo que guarda las iamgenes de las cajas al soltarse (not implemented)
  savePosition($event: { source: { getFreeDragPosition: () => any } }) {
    this.dragPositionState.x = $event.source.getFreeDragPosition().x;
    this.dragPositionState.y = $event.source.getFreeDragPosition().y;
    console.log(
      'Posiciones a guardar: ',
      this.dragPositionState.x,
      this.dragPositionState.y
    );

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
          console.log(err);
        }
      )
    );
  }

  //Metodo que nos lleva a la pagina de graficar directamente
  goGraphs(component:any){
    this.route.navigate(['admin/graphs', component]);
  }

  //Metodo para cambiar el nombre de un componente
  changeName(component:any){
    this.components[component.id].name = this.newName.value.name;
  }
}
