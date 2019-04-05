import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { AboutusEventsComponent} from './aboutusEvents.component';

const routes: Routes = [
  {
    path: '',
    component: AboutusEventsComponent,
    data: {
      title: 'Analytics'
    }
  },
  {
    path: 'aboutusEvents',
    component: AboutusEventsComponent,
    data: {
      title: 'Analytics'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutusEventsRoutingModule {}
