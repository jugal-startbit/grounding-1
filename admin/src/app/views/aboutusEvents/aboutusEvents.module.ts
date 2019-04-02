import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';
import {AboutusEventsComponent} from './aboutusEvents.component';
import {AboutusEventsRoutingModule} from "./aboutusEvents-routing.module";

import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModuleModule} from '../../containers/material-module/material-module.module';

import { ModalModule } from 'ngx-bootstrap/modal';

import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  imports: [
    FormsModule,
    AboutusEventsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    MaterialModuleModule,
    ModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
  ],
  declarations: [
    AboutusEventsComponent,

  ],
  exports: []
})
export class AboutusEventsModule { }
