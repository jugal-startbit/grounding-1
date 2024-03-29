import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { ReviewComponent} from './review.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewComponent,
    data: {
      title: 'Review'
    }
  },
  {
    path: 'review',
    component: ReviewComponent,
    data: {
      title: 'Review'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewRoutingModule {}
