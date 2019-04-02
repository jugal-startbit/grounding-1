import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewComponent } from './new/new.component';
import { IndividualComponent} from './Individual/Individual.component';
import { FirmComponent} from './firm/firm.component';

import { WorkComponent } from './work/work.component';
import { WorkNewComponent} from './workNew/workNew.component';
import { WorkExistingComponent} from './workExisting/workExisting.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Manager'
    },
    children: [
      {
        path: '',
        redirectTo: 'new'
      },
      {
        path: 'new',
        component: NewComponent,
        data: {
          title: 'New Client'
        }
      },
      {
        path: 'individual',
        component: IndividualComponent,
        data: {
          title: 'Individual'
        }
      },
      {
        path: 'firm',
        component: FirmComponent,
        data: {
          title: 'Firm'
        }
      },
      {
        path: 'work',
        component: WorkComponent,
        data: {
          title: 'Work Assignment'
        }
      },
      {
        path: 'worknew',
        component: WorkNewComponent,
        data: {
          title: 'Work Assigment'
        }
      },
      {
        path: 'workexisting',
        component: WorkExistingComponent,
        data: {
          title: 'Work Existing'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule {}
