import { Component, OnInit } from '@angular/core';
//import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  registered = false;
	submitted = false;
	userForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, public dialog: MatDialog,public router: Router) { }
  // invaliduserName()
  // {
  // 	return (this.submitted && this.userForm.controls.userName.errors != null);
  // }

  // invalidLastName()
  // {
  // 	return (this.submitted && this.userForm.controls.last_name.errors != null);
  // }

  // invalidEmail()
  // {
  // 	return (this.submitted && this.userForm.controls.email.errors != null);
  // }

  // invalidZipcode()
  // {
  // 	return (this.submitted && this.userForm.controls.zipcode.errors != null);
  // }

  // invalidPassword()
  // {
  // 	return (this.submitted && this.userForm.controls.password.errors != null);
  // }
  userName1 = "";
  userName2 = "";
  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit()
  {
    this.userForm = this.formBuilder.group({
  		userName1: ['', Validators.required],
      userName2: ['', [Validators.required]],
  		loginName: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
      creditLimit: ['', Validators.required],
      repeatPassword:['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
      agentPosition: ['', Validators.required],
      notes: ['', Validators.required],
      status: ['', Validators.required],

      
  	});
    this.http.get('/matieres/getUserMax/').subscribe((data:any) => {
        console.log("user Max data result=="+JSON.stringify(data[0].userName));
        var username = data[0].userName;
        let useN = username.split("M");
        console.log("split=="+useN[1]);      
        var userNa = parseInt(useN[1]) + 1;
        console.log("userNa==="+userNa);
        var userNa1 = userNa.toString(10);
        if(userNa>9){
          var a = userNa1.split('');       
          this.userName1 = a[0];
          this.userName2 = a[1];
        }else{
          var a = userNa1.split('');
          this.userName1 = "0";
          this.userName2 = a[0];
        }      
      });
  	
  }

  onSubmit()
  {
    console.log("IN");
  	this.submitted = true;

  	// if(this.userForm.invalid == true)
  	// {
  	// 	return;
  	// }
  	// else
  	// {
  	// 	this.registered = true;
    // }
    
    
     let data: any = Object.assign(this.userForm.value);
     console.log("IN"+JSON.stringify(data));
    //  if(data.password!=data.newPassword){
    //     //this.registered = false;
    //     return;
    //   }
  		this.http.post('/matieres/saveUser', data).subscribe((data:any) => {
	      console.log("data==="+JSON.stringify(data));
	      let path = '/usersDisplay';
	      this.router.navigate([path]);
	    }, error =>
	    {
	    	//this.serviceErrors = error.error.error;
        });

  		this.registered = true;
    // this.http.get('/matieres').subscribe((data:any) => {
    //   	console.log("data "+JSON.stringify(data));
    //   	//console.log("data result"+data.result);
    //     console.log("data result"+JSON.stringify(data.runners));
    //     //var array =  data.runners;
    //     //array.sort((a,b) => a.back.price.localeCompare(b.price.rendered));
    //   	///this.dataSource = data.runners;
    //     });    
  }
}
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {}
