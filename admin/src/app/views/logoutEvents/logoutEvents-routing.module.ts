import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { LogoutEventsComponent} from './logoutEvents.component';

const routes: Routes = [
  {
    path: '',
    component: LogoutEventsComponent,
    data: {
      title: 'LogoutEvents'
    }
  },
  {
    path: 'logoutEvents',
    component: LogoutEventsComponent,
    data: {
      title: 'LogoutEvents'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogoutEventsRoutingModule {}
