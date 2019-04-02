import { Component, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { EntryService} from '../entry/entry.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { WorkListService} from '../../employee/workList/workList.service';
import { ClientService} from '../../settings/client/client.service';
import {MatSnackBar} from '@angular/material';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService} from '../../../containers/_services/authentication.service';

@Component({
  selector: 'app-work-list',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  displayedColumns: string[] = ['Work', 'Client', 'Department', 'Employee', 'Cost', 'PaidAmount', 'DueAmount', 'Action'];
  dataSource: MatTableDataSource<any>;

  displayedColumnspayment: string[] = ['Client', 'Message', 'PaymentMethod', 'TotalAmount', 'Discount', 'Total', 'Activity'];
  dataSourcePayment: MatTableDataSource<any>;
  isLoadingResults: any;
  isRateLimitReached: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //
  vewActive = 'All';
  localStorage: any;
  showSpinner: boolean;
  allPayments: any = [];
  allDueAmountWork: any = [];
  selectedDueAmountWork: any = [];
  allClients: any = [];
  viewActiveInReceived = 'All';
  viewActiveWork = 'All';
  selectedClientInReceived = new FormControl('0');
  selectedClientInWork = new FormControl('0');
  notificationMessage = '';
  selectedWork: any = {};
  FromDateInReceived: Date;
  ToDateInReceived: Date;
  FromDateInWork: Date;
  ToDateInWork: Date;
  constructor(
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    public entryService: EntryService,
    public workListService: WorkListService,
    public clientService: ClientService,
    private snackBar: MatSnackBar,
    private modal: NgbModal,
    public authenticationService: AuthenticationService
  ) {
    setTimeout(() => {
      this.authenticationService.checkSelectedComponentVisiblity('Register');
    }, 100);
    this.localStorage = JSON.parse(localStorage.getItem('currentUser'));
    this.showSpinner = false;
  }

  ngOnInit() {
    this.getAllWorkByDueAmount();
    this.getAllClients();
    this.getAllPaymentsByFilter();
  }
  getAllClients() {
    this.spinnerService.show();
    this.clientService.getAllClients().subscribe((data) => {
      if (data['status']) {
        this.spinnerService.hide();
        this.allClients = data['result'];
      }
    }, (err) => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getAllPaymentsByFilter() {
    this.spinnerService.show();
    const filterData = {
      activeData: this.viewActiveInReceived,
      client: this.selectedClientInReceived.value,
      FromDate: this.FromDateInReceived,
      ToDate: this.ToDateInReceived
    };
    this.entryService.getAllPaymentsByFilter(filterData).subscribe((data) => {
      if (data['status']) {
        this.spinnerService.hide();
        this.allPayments = data['result'];
        this.dataSourcePayment = new MatTableDataSource(this.allPayments);
        this.dataSourcePayment.paginator = this.paginator2;
        this.dataSourcePayment.sort = this.sort;
      }
    }, (err) => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getAllWorkByDueAmount() {
    this.spinnerService.show();
    this.workListService.getAllWorkByDueAmount().subscribe((data) => {
      if (data['status']) {
        this.spinnerService.hide();
        this.allDueAmountWork = data['result'];
        this.dataSource = new MatTableDataSource(data['result']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }, (err) => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }
  getAllWorkByDueAmountWithFilter() {
    this.spinnerService.show();
    const filterData = {
      activeData: this.viewActiveWork,
      client: this.selectedClientInWork.value,
      FromDate: this.FromDateInWork,
      ToDate: this.ToDateInWork
    };
    this.workListService.getAllWorkByDueAmountWithFilter(filterData).subscribe((data) => {
      if (data['status']) {
        this.spinnerService.hide();
        this.allDueAmountWork = data['result'];
        this.dataSource = new MatTableDataSource(data['result']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }, (err) => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }
  sendReminderToClient(row) {
    this.spinnerService.show();
    const msg = 'Payment Pending';
    this.workListService.createPaymentReminder(row, msg).subscribe((data) => {
      if (data['status']) {
        this.spinnerService.hide();
        this.notificationMessage = 'Successfully send message to client';
        this.snackBar.open(data['message'], 'Success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
      } else {
        this.spinnerService.hide();
        this.snackBar.open(data['message'], 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
      }
    }, (err) => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }
  onChangeDayInReceived(day) {
    this.viewActiveInReceived = day;
    this.getAllPaymentsByFilter();
  }
  onChangeDayInWork(day) {
    this.viewActiveWork = day;
    this.getAllWorkByDueAmountWithFilter();
  }
  getTotalAmount() {
    return this.getTotalDiscount() + this.getTotalPaidAmount();
  }
  getTotalDiscount() {
    return this.allPayments.reduce((summ, v) => summ += Number(v.Discount), 0);
  }
  getTotalPaidAmount() {
    return this.allPayments.reduce((summ, v) => summ += Number(v.Total), 0);
  }
  getSum(row) {
    return Number(row.Discount) + Number(row.Total);
  }
  getTotalCostInPending() {
    return this.allDueAmountWork.reduce((summ, v) => summ += Number(v.Cost), 0);
  }
  getTotalPaidInPending() {
    return this.allDueAmountWork.reduce((summ, v) => summ += Number(v.PaidAmount), 0);
  }
  getTotalDueInPending() {
    return this.allDueAmountWork.reduce((summ, v) => summ += Number(v.DueAmount), 0);
  }
  onClickResetInWork() {
      this.FromDateInWork = null;
      this.ToDateInWork = null;
      this.viewActiveWork = 'All';
      this.selectedClientInWork = new FormControl('0');
      this.getAllWorkByDueAmount();
  }
  onClickResetInReceived() {
    this.FromDateInReceived = null;
    this.ToDateInReceived = null;
    this.viewActiveInReceived = 'All';
    this.selectedClientInReceived = new FormControl('0');
    this.getAllPaymentsByFilter();
  }
  onClickWork(row) {
    this.selectedWork = row;
    this.router.navigate(['/dashboard/account', this.selectedWork._id]);
  }

}

