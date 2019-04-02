import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Router} from '@angular/router';
import { MatDialog, MatDialogRef  } from '@angular/material';
import { AuthenticationService} from '../../../containers/_services/authentication.service';

let selectedType: string;
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) {
    setTimeout(() => {
      this.authenticationService.checkSelectedComponentVisiblity('New');
    }, 100);
  }

  ngOnInit() {
    setTimeout(() => {
      this.openConfirmDialog();
    }, 100);
  }
  openConfirmDialog() {
    selectedType = '';
    const dialogRef = this.dialog.open(ConfirmManagerTypeComponent,{ width: '30%'});

    dialogRef.afterClosed().subscribe(result => {
      if (selectedType === 'individual') {
        this.router.navigate(['/managers/individual']);
      } else if (selectedType === 'firm') {
        this.router.navigate(['/managers/firm']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}


@Component({
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./new.component.scss']
})
export class ConfirmManagerTypeComponent {
  managerType: string;
  constructor(public dialogRef: MatDialogRef<ConfirmManagerTypeComponent>) {}

  onRadioButtonClick(val) {
    selectedType = val;
    this.dialogRef.close();
  }
}
