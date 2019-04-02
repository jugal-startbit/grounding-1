import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { AboutgroundinglogEventsComponent} from './aboutgroundinglogEvents.component';

const routes: Routes = [
  {
    path: '',
    component: AboutgroundinglogEventsComponent,
    data: {
      title: 'AboutgroundinglogEvents'
    }
  },
  {
    path: 'aboutgroundinglogEvents',
    component: AboutgroundinglogEventsComponent,
    data: {
      title: 'AboutgroundinglogEvents'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutgroundinglogEventsRoutingModule {}
