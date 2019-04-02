import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewComponent } from './new/new.component';
import  {CustomerComponent} from "./customer/customer.component";
import { ListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Deo'
    },
    children: [
      {
        path: '',
        redirectTo: 'list'
      },
      {
        path: 'new/:id',
        component: NewComponent,
        data: {
          title: 'New Entry'
        }
      },
      {
        path: 'list',
        component: ListComponent,
        data: {
          title: 'Entry Register'
        }
      },
      {
        path: 'customer',
        component: CustomerComponent,
        data: {
          title: 'Customer'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeoRoutingModule {}
