import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { ContactusEventsComponent} from './contactusEvents.component';

const routes: Routes = [
  {
    path: '',
    component: ContactusEventsComponent,
    data: {
      title: 'ContactusEvents'
    }
  },
  {
    path: 'contactusEvents',
    component: ContactusEventsComponent,
    data: {
      title: 'ContactusEvents'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactusEventsRoutingModule {}
