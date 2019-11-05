import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  constructor(private http:HttpClient) { }
taskList=[]
  ngOnInit() {
    this.http.get('http://localhost:2018/result/getTask').subscribe((s:any[])=>{console.log(s);this.taskList=s})
  }

}
