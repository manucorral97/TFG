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
  displayedColumns: string[] = [
    'name',
    'lastname',
    'username',
    'rol',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  statusDelete: boolean;
  rol: any;
  private subscriptionInit: Subscription = new Subscription();
  private subscriptionDelete: Subscription = new Subscription();

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.statusDelete = false;
    this.rol = localStorage.getItem('rol');
  }

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);

  ngOnInit(): void {
    this.subscriptionInit.add(
      this.http
        .get<any>('http://13.80.8.137/api/1/showusers')
        .subscribe((users) => {
          this.dataSource.data = users;
        })
    );
    //this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscriptionInit.unsubscribe();
    this.subscriptionDelete.unsubscribe();
  }

  onDelete(user: any): void {
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
        console.log(JSON.parse(body));
        this.subscriptionDelete.add(
          this.http
            .post<any>('http://13.80.8.137/api/1/dropuser', body)
            .subscribe(
              (res) => {
                //alert(res);
                this.ngOnInit();
              },
              (err) => {
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

  onModify(user: any): void {
    console.log(user);
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
