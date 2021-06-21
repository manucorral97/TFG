import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'lastname', 'username', 'rol', 'actions'];
  dataSource = new MatTableDataSource();
  statusDelete:boolean;

  constructor(private http: HttpClient,) {
    this.statusDelete=false;
   }

  @ViewChild(MatSort) sort: MatSort = new MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);

  ngOnInit():void{
    this.http.get<any>("http://13.80.8.137/api/1/showusers").subscribe((users) => {
      this.dataSource.data = users;
    });
    //this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit(): void{
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onDelete(user: any):void{
    if(window.confirm("Desea eliminar?")){
      const body = JSON.stringify({username: user.username});
      console.log(JSON.parse(body));
      this.http.post<any>("http://13.80.8.137/api/1/dropuser", body).subscribe((res) =>{
        alert(res);
        this.ngOnInit();
      },
      (err) => {
        if(err.error.text == "Usuario eliminado satisfactoriamente"){
          alert("Usuario eliminado satisfactoriamente");
          this.statusDelete = true
          this.ngOnInit();
        }
      });
    }
  }

}
