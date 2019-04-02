import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { MaterialModuleModule} from '../../containers/material-module/material-module.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgxMaskModule} from 'ngx-mask';
import { ManagerRoutingModule } from './manager-routing.module';

import { ConfirmManagerTypeComponent} from './new/new.component';
import { ConfirmManagerWorkTypeComponent} from './work/work.component';
import { ClientSearchComponent} from './Individual/Individual.component';
import { ClientSearchForWorkComponent} from './workNew/workNew.component';

import { NewComponent } from './new/new.component';
import { IndividualComponent} from './Individual/Individual.component';
import { FirmComponent} from './firm/firm.component';

import { WorkComponent } from './work/work.component';
import { WorkNewComponent} from './workNew/workNew.component';
import { WorkExistingComponent} from './workExisting/workExisting.component';

@NgModule({
  imports: [
    CommonModule,
    ManagerRoutingModule,
    MaterialModuleModule,
    Ng4LoadingSpinnerModule.forRoot(),
    NgxMaskModule.forRoot()
  ],
  declarations: [
    ConfirmManagerTypeComponent,
    ClientSearchComponent,
    ClientSearchForWorkComponent,
    NewComponent,
    IndividualComponent,
    FirmComponent,
    WorkNewComponent,
    WorkComponent,
    ConfirmManagerWorkTypeComponent,
    WorkExistingComponent
  ],
  entryComponents: [
    ConfirmManagerTypeComponent,
    ClientSearchComponent,
    ClientSearchForWorkComponent,
    ConfirmManagerWorkTypeComponent
  ]
})
export class ManagerModule { }
