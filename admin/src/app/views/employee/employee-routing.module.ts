import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkListComponent} from './workList/workList.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Employee'
    },
    children: [
      {
        path: '',
        redirectTo: 'workList'
      },
      {
        path: 'workList',
        component: WorkListComponent,
        data: {
          title: 'Work List'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {}
