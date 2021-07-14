import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../components/modal/modal.component';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements AfterViewInit, OnInit, OnDestroy {
  
  //Variable para asignar la referencia de las columnas de la tabla 
  displayedColumns: string[] = [
    'name',
    'lastname',
    'username',
    'rol',
    'actions',
  ];
  //Creamos la tabla
  dataSource = new MatTableDataSource();
  //Variable para obtener el estado del delete
  statusDelete: boolean;
  //Variable para guardar el rol del usuario
  rol: any;

  //Subscripiones de las peticiones de modificar y elimianr
  private subscriptionInit: Subscription = new Subscription();
  private subscriptionDelete: Subscription = new Subscription();

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.statusDelete = false;
    this.rol = localStorage.getItem('rol');
  }

  //Propiedades de la tabla para paginar y ordenar
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);

  //Al iniciar el componente, mostramos todos los usuarios registrados
  ngOnInit(): void {
    this.subscriptionInit.add(
      this.http
        .get<any>('http://13.80.8.137/api/1/showusers')
        .subscribe((users) => {
          this.dataSource.data = users;
        }, (err) => {
          console.log("Error al mostrar los usuaios")
        })
    );
    //this.dataSource.paginator = this.paginator;
  }
  //Asignamos a la tabla las propiedades de paginacion y orden
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  //Nos desubscribimos de los subscribes
  ngOnDestroy(): void {
    this.subscriptionInit.unsubscribe();
    this.subscriptionDelete.unsubscribe();
  }

  //Metodo para eliminar el usuario
  onDelete(user: any): void {
    //Comprobamos que tiene los permisos adecuados
    if (this.rol!=0){
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: 'No tienes los permisos adecuados!',
      })
      return;
    }
    //SweetAlert para ayudar con la interaccion del usuario
    Swal.fire({
      title: '¿Estas seguro?',
      text: 'No podrás volver atras...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar definitivamente!',
      cancelButtonText: 'No, parar borrado',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          '¡Borrado!',
          'Un usuario menos...',
          'success'
        );
        const body = JSON.stringify({ username: user.username });
        //Si ha pulsado en borrar definitivamente llamamos al metodo de delete
        this.subscriptionDelete.add(
          this.http
            .post<any>('http://13.80.8.137/api/1/dropuser', body)
            .subscribe(
              (res) => {
                //alert(res);
                this.ngOnInit();
              },
              //En esta peticion, sale como erroneo aunque el estado es correcto y el mensaje es usuario eliminado
              (err) => {
                //Si el mensaje es de exito, lo borramos y actualizamos
                if (err.error.text == 'Usuario eliminado satisfactoriamente') {
                  //alert("Usuario eliminado satisfactoriamente");
                  this.statusDelete = true;
                  this.ngOnInit();
                }
              }
            )
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'Tu usuario sigue ahí :)', 'error');
      }
    });
  }
  //Metodo para modificar un usuario
  onModify(user: any): void {
    //Comprobamos que tiene los permisos adecuados
    if (this.rol!=0){
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: 'No tienes los permisos adecuados!',
      })
      return;
    }
    //Llamaos al componente creado 
    const dialogRef = this.dialog.open(ModalComponent, {
      hasBackdrop: true,
      height: '500px',
      width: '700px',
      data: {
        title: 'Modificar Usuario',
        user: user,
        //User select
      },
    });
  }
}
