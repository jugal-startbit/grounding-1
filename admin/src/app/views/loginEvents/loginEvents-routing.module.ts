import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { LoginEventsComponent} from './loginEvents.component';

const routes: Routes = [
  {
    path: '',
    component: LoginEventsComponent,
    data: {
      title: 'LoginEvents'
    }
  },
  {
    path: 'loginEvents',
    component: LoginEventsComponent,
    data: {
      title: 'LoginEvents'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginEventsRoutingModule {}
