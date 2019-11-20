import { Component, OnInit } from '@angular/core';
//import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { HttpClient } from "@angular/common/http";
import {MatDialog} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { DialogContentExampleDialog } from '../../popModels/comPopup.component';

@Component({
  selector: 'app-display',
  templateUrl: './userDisplay.component.html',
  styleUrls: ['./userDisplay.component.css']
})
export class UserDisplayComponent implements OnInit {
  registered = false;
	submitted = false;
	userForm: FormGroup;
  dataSource = null;
  dataSource1 = [{betSettingId:"",cricketMinBet:"",footballMaxMarket:"",greyhoundRacingMarket:""}];
  user = [];
  ID = "";
  status = false;
  closeStatus = false;
  suspendedStatus = false;
  activeStatus = false;
  inactiveStatus = false;
  constructor(private formBuilder: FormBuilder, private http: HttpClient, public dialog: MatDialog,public router: Router,public ngxSmartModalService: NgxSmartModalService) { 
   
  }
  get_model(user){
    console.log("use==="+JSON.stringify(user));
    this.user  = user;
    this.ID = user.ID;
    let data: any = Object.assign(user);
    this.http.post('/matieres/getUser/',data).subscribe((data:any) => {      
      console.log("user data result"+JSON.stringify(data));
      this.dataSource1 = data;
      });
      console.log("dataSource====="+JSON.stringify(this.dataSource1));
    this.ngxSmartModalService.getModal('myModal').open(user);
  }

  onSubmit()
  {
    console.log("id========"+this.ID);
  	this.submitted = true;
    let data: any = Object.assign(this.userForm.value);
    data.ID = this.ID; 
     console.log("IN"+JSON.stringify(data));
    //  if(data.password!=data.newPassword){
    //     //this.registered = false;
    //     return;
    //   }
  		this.http.post('/matieres/updateUser/', data).subscribe((data:any) => {
	      console.log("data==="+JSON.stringify(data));
	      let path = '/usersDisplay';
	      this.router.navigate([path]);
	    }, error =>
	    {
	    	//this.serviceErrors = error.error.error;
        });
  		this.registered = true; 
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
      this.userForm = this.formBuilder.group({
          betSettingId:['',''],
          password: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
          creditLimit: ['', Validators.required],
          repeatPassword:['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
          payemtThreshould: ['', Validators.required],
          agentPosition: ['', Validators.required],
          notes: ['', Validators.required],
          status: ['', Validators.required],
          ID: ['', Validators.required],
          betSettingChk: ['', Validators.required],
          cricketMinBet: ['', Validators.required],
          cricketMaxBet: ['', Validators.required],
          cricketMaxMarket: ['', Validators.required],
          footballMinBet: ['', Validators.required],
          footballMaxBet: ['', Validators.required],
          footballMarket: ['', Validators.required],
          tennisMinBet: ['', Validators.required],
          tennisMaxBet: ['', Validators.required],
          tennisMarket: ['', Validators.required],
          horseRacingMinBet: ['', Validators.required],
          horseRacingMaxBet: ['', Validators.required],
          horseRacingMarket: ['', Validators.required],
          greyhoundRacingMinbet: ['', Validators.required],
          greyhoundRacingMaxbet: ['', Validators.required],
          greyhoundRacingMarket	: ['', Validators.required],
          casinoMinbet: ['', Validators.required],
          casinoMaxbet: ['', Validators.required],
          casinoMarket: ['', Validators.required],
          positnTakingChk: ['', Validators.required],
          
          postnCricket: ['', Validators.required],
          postnFootball: ['', Validators.required],
          postnTennis: ['', Validators.required],
          postnHorseRacing: ['', Validators.required],
          postnGreyndRacing: ['', Validators.required],
          postnCasino: ['', Validators.required],
          
        });    
  }
}

