import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { timer, of, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/observable/timer'

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
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
  selector: 'app-index',
  templateUrl: './agencyManagement.component.html',
  styleUrls: ['./agencyManagement.component.css']
})
export class AgencyManagement implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  alive = true;
  
  constructor(private http: HttpClient) { 

    
  }
  ngOnInit() {
    this.http.get('http://115.124.103.128:5105/getFeed?mid=1.164384481&type=odds').subscribe((data:any) => {
      	console.log("data "+JSON.stringify(data));
      	//console.log("data result"+data.result);
        console.log("data result"+JSON.stringify(data.runners));
        //var array =  data.runners;
        //array.sort((a,b) => a.back.price.localeCompare(b.price.rendered));
      	this.dataSource = data.runners;
        });
    // Observable.timer(0,300)
    // .takeWhile(() => this.alive) // only fires when component is alive
    // .subscribe(() => {
    //   this.http.get('http://115.124.103.128:5105/getFeed?mid=1.164384481&type=odds').subscribe((data:any) => {
    //   	console.log("data "+JSON.stringify(data));
    //   	//console.log("data result"+data.result);
    //     console.log("data result"+JSON.stringify(data.runners));
    //     //var array =  data.runners;
    //     //array.sort((a,b) => a.back.price.localeCompare(b.price.rendered));
    //   	this.dataSource = data.runners;
    //     });
    // });
  }
  
}
