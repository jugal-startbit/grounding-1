import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatListModule} from '@angular/material/list';
import {MatStepperModule} from '@angular/material/stepper';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTreeModule} from '@angular/material/tree';
import {MatGridListModule} from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SafeHtmlPipe} from '../safe-html/safe-html.pipe';
import { TimeAgoPipe} from 'time-ago-pipe';
import { DataTablesModule} from 'angular-datatables';

@NgModule({
  imports: [
      CommonModule,
      MatButtonModule,
      MatProgressBarModule,
      MatSlideToggleModule,
      MatInputModule,
      MatTableModule,
      MatSortModule,
      MatPaginatorModule,
      MatProgressSpinnerModule,
      MatDialogModule,
      FormsModule,
      ReactiveFormsModule,
      MatSnackBarModule,
      MatTabsModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatCheckboxModule,
      MatBottomSheetModule,
      MatIconModule,
      MatRadioModule,
      MatAutocompleteModule,
      MatListModule,
      MatStepperModule,
      MatBadgeModule,
      AngularEditorModule,
      MatFormFieldModule,
      MatTreeModule,
      DataTablesModule,
    MatGridListModule
  ],
    exports: [
        CommonModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatProgressBarModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatTabsModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatBottomSheetModule,
        MatIconModule,
        MatRadioModule,
        MatAutocompleteModule,
        MatListModule,
        MatStepperModule,
        MatBadgeModule,
        AngularEditorModule,
        MatFormFieldModule,
        MatTreeModule,
      	SafeHtmlPipe,
        TimeAgoPipe,
        DataTablesModule,
      MatGridListModule
    ],
  declarations: [SafeHtmlPipe, TimeAgoPipe]
})
export class MaterialModuleModule { }
