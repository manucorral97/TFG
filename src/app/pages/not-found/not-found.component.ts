import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  //Pensada para cuando el usuario intente acceder a partes no creadas (no implementada)
  ngOnInit(): void {
  }

}
