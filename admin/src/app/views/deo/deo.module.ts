import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { MaterialModuleModule} from '../../containers/material-module/material-module.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DeoRoutingModule } from './deo-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NewComponent } from './new/new.component';
import { DetailComponent } from './customer/customer.component';
import {CustomerComponent} from './customer/customer.component';
import { ListComponent} from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    DeoRoutingModule,
    MaterialModuleModule,
    Ng4LoadingSpinnerModule.forRoot(),
    NgbModalModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    NewComponent,
    DetailComponent,
    ListComponent,
    CustomerComponent
  ],
  entryComponents: [
    DetailComponent
  ]
})
export class DeoModule { }
