import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-analyst',
  templateUrl: './analyst.component.html',
  styleUrls: ['./analyst.component.css']
})
export class AnalystComponent implements OnInit {

	empId=0;
  projList=[];
  projectForm:FormGroup;
  option;
  selectedEmp;
  change(data){
this.option=data
console.log(this.option)
  }
  constructor(private http:HttpClient,private fb:FormBuilder) { }

  ngOnInit() {
    
   let x=new Date().getFullYear()+"-";
   if(new Date().getMonth()+1<10){
     x=x+"0"+(new Date().getMonth()+1)
   }
   else{
    x=x+(new Date().getMonth()+1)
   }
   if(new Date().getDate()>10){
    x=x+"-"+new Date().getDate()
   }
   else{
    x=x+"-0"+new Date().getDate()
   }
   console.log(x) 
   this.projList=JSON.parse(sessionStorage.getItem('projList'))
    console.log(this.projList)
    if(this.projList==null){
      console.log('Hi')
      this.http.get('http://localhost:2018/result/getProj').subscribe((res:any)=>{this.projList=res;console.log(res)
    sessionStorage.setItem('projList',JSON.stringify(this.projList))
  },(err)=>{console.log(err)})
    }
    console.log(JSON.stringify(new Date()))
    this.projectForm=this.fb.group(
      {
        'projId':['',Validators.required],
        'projDate':[x,[Validators.required]],
        'blocker':['',[Validators.required]]
      }
    )
  }
  sub(data){
	  
    console.log(data);
    this.http.post('http://localhost:2018/result/getEmp',{id:data}).subscribe((s:any[])=>{for(let i of s){
      
    if(i.empid==data){
        this.empId=data
        this.selectedEmp=i
      }

    }
 
  
  
  })
	 
  }

  submit(){
    this.http.post('http://localhost:2018/result/insert',{empid:this.empId,projId:this.projectForm.controls.projId.value,projDate:this.projectForm.controls.projDate.value,blocker:this.projectForm.controls.blocker.value}).subscribe(s=>{console.log(s)})
  }

}
