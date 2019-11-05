import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{AnalystComponent} from './analyst/analyst.component';
import{ManagerComponent} from './manager/manager.component';

const routes: Routes = [{path:'analyst',component:AnalystComponent},{path:'manager',component:ManagerComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
