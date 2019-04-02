import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { MaterialModuleModule} from '../../containers/material-module/material-module.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { EmployeeRoutingModule } from './employee-routing.module';
import { WorkListComponent} from './workList/workList.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    MaterialModuleModule,
    Ng4LoadingSpinnerModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    WorkListComponent
  ],
  entryComponents: [
  ]
})
export class EmployeeModule { }
