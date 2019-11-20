import { Component, OnInit } from '@angular/core';
//import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { HttpClient } from "@angular/common/http";
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'popup-display',
  templateUrl: './dialog-content-example-dialog.html',
  styleUrls: ['./comPopup.component.css']
})
export class DialogContentExampleDialog implements OnInit {
  registered = false;
	submitted = false;
	//userForm: FormGroup;
  dataSource = null;
  constructor(private http: HttpClient, public dialog: MatDialog,public router: Router,public ngxSmartModalService: NgxSmartModalService) { 
    //this.ngxSmartModalService.create('myModal1', 'content').open();

    // component
    ///this.ngxSmartModalService.create('myModal2', DialogContentExampleDialog).open();

    // or templateRef
    //this.ngxSmartModalService.create('myModal3', this.tpl).open();
  }

  ngOnInit()
  {
    this.http.get('/matieres/getUsers/').subscribe((data:any) => {
      	console.log("data "+JSON.stringify(data));
      	//console.log("data result"+data.result);
        console.log("data result"+JSON.stringify(data));
        //var array =  data.runners;
        //array.sort((a,b) => a.back.price.localeCompare(b.price.rendered));
      	this.dataSource = data;
        });
  }
}