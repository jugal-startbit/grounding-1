import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { MaterialModuleModule} from '../../containers/material-module/material-module.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { PaymentRoutingModule } from './payment-routing.module';
import { EntryComponent} from './entry/entry.component';
import { RegisterComponent} from './register/register.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    PaymentRoutingModule,
    MaterialModuleModule,
    Ng4LoadingSpinnerModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    EntryComponent,
    RegisterComponent
  ],
  entryComponents: [
  ]
})
export class PaymentModule { }
