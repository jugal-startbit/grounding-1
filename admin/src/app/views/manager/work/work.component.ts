import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Router} from '@angular/router';
import { MatDialog, MatDialogRef  } from '@angular/material';

let selectedType: string;
@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit {
  constructor(
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.openConfirmDialog();
    }, 100);
  }
  openConfirmDialog() {
    selectedType = '';
    const dialogRef = this.dialog.open(ConfirmManagerWorkTypeComponent,{ width: '30%'});

    dialogRef.afterClosed().subscribe(result => {
      if (selectedType === 'new') {
        this.router.navigate(['/managers/worknew']);
      } else if (selectedType === 'existing') {
        this.router.navigate(['/managers/workexisting']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}


@Component({
  templateUrl: './work-confirm-dialog.html',
  styleUrls: ['./work.component.scss']
})
export class ConfirmManagerWorkTypeComponent {
  managerType: string;
  workType: string;
  constructor(public dialogRef: MatDialogRef<ConfirmManagerWorkTypeComponent>) {}

  onRadioButtonClick(val) {
    selectedType = val;
    this.dialogRef.close();
  }
}
