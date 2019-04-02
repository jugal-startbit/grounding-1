import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { AboutusEventsComponent} from './aboutusEvents.component';

const routes: Routes = [
  {
    path: '',
    component: AboutusEventsComponent,
    data: {
      title: 'AboutusEvents'
    }
  },
  {
    path: 'aboutusEvents',
    component: AboutusEventsComponent,
    data: {
      title: 'AboutusEvents'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutusEventsRoutingModule {}
