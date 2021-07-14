import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcryptjs';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(/*public authSvc:AuthService*/) { }



  ngOnInit(): void { }

}
