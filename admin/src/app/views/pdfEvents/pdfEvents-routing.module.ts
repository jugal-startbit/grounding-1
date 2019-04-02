import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { PdfEventsComponent} from './pdfEvents.component';

const routes: Routes = [
  {
    path: '',
    component: PdfEventsComponent,
    data: {
      title: 'PdfEvents'
    }
  },
  {
    path: 'pdfEvents',
    component: PdfEventsComponent,
    data: {
      title: 'PdfEvents'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PdfEventsRoutingModule {}
