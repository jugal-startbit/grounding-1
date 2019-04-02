import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {WorkNewService} from './workNew.service';
import {Router} from '@angular/router';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {MatDialog, MatDialogRef} from '@angular/material';
import {slideToLeft} from '../../../router.animations';
import {ConfirmationDialogComponent} from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

import {DepartmentService} from '../../settings/department/department.service';
import {BranchService} from '../../settings/branch/branch.service';
import {MainTaskService} from '../../settings/mainTask/mainTask.service';
import {UserService} from '../../settings/user/user.service';
import {ClientService} from '../../settings/client/client.service';
import { AuthenticationService} from '../../../containers/_services/authentication.service';

export interface WorkNewData {
  TaskName: string;
  SpecialNote: string;
  Cost: string;
  Time: string;
}

export let refrenceArray: any = {};
let dialogOpenFrom: string;
let checkListHtml: string;

@Component({
  selector: 'app-work-assigment',
  templateUrl: './workNew.component.html',
  styleUrls: ['./workNew.component.scss'],
  animations: [
    slideToLeft(),
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class WorkNewComponent implements OnInit {
  WorkNewForm: FormGroup;
  showSpinner: boolean;
  maxDate = new Date();
  displayedColumns: string[] ;
  dataSource: MatTableDataSource<WorkNewData>;
  isLoadingResults: any;
  isRateLimitReached: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentUser: any = {};
  allBranches: any = [];
  allDepartments: any = [];
  allTasks: any = [];
  allChildTasks: any = [];
  allEmployees: any = [];
  costOnFirst: number;
  timeOnFirst: number;
  clientWorkArray: any = [];
  WorkType = 'New';
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  selectedEmployee: any = {};
  selectedClient: any = {};
  employeeID: any;
  clientName: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private workNewService: WorkNewService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private branchService: BranchService,
    private departmentService: DepartmentService,
    private mainTaskService: MainTaskService,
    private userService: UserService,
    public authenticationService: AuthenticationService
      ) {
        setTimeout(() => {
        this.authenticationService.checkSelectedComponentVisiblity('New Work');
      }, 100);
      this.showSpinner = false;
      this.WorkNewForm = fb.group({
      BranchID: ['', [Validators.required]],
      DepartmentID: ['', [Validators.required]],
      TaskID: ['', [Validators.required]],
      ChildTask: new FormControl(null),
      Cost: [''],
      CostNote: [''],
      Time: [''],
      TimeNote: [''],
      SpecialNote: [''],
      Is_Repetitive : [false],
      LastDate : [''],
      Occurrence : [''],
      GracePeriod : [''],
      Priority : [''],
    });
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getAllBranches();
    if (this.currentUser.role !== 'Super Admin') {
      this.displayedColumns = ['Symbol', 'TaskName', 'SpecialNote', 'Time', 'CheckList' , 'Action'];
      this.getAllDepartmentByBranchs(this.currentUser.Branch._id);
      this.getAllTaskByDepartments(this.currentUser.Department._id);
      this.getAllEmployeesByLeader(this.currentUser.id);
      this.WorkNewForm.patchValue({
        BranchID: this.currentUser.Branch._id,
        DepartmentID: this.currentUser.Department._id,
      });
    } else {
      this.displayedColumns = ['Symbol', 'TaskName', 'SpecialNote', 'Cost',  'Time', 'CheckList' , 'Action'];
    }
  }

  updateChildTaskDetail(index) {
    const cost = Number(document.getElementById('cost-' + index).innerHTML);
    const time = Number(document.getElementById('time-' + index).innerHTML);
    if (isNaN(cost)) {
      this.snackBar.open('Please put valid cost', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
      return 0;
    }
    if (isNaN(time)) {
      this.snackBar.open('Please put valid time', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
      return 0;
    }
    this.allChildTasks[index].Cost = Number(cost);
    this.allChildTasks[index].Days = Number(time);
    this.snackBar.open('Successfull', 'Success', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top'
    });
  }

  getAllBranches() {
    this.branchService.getAllBranchs().subscribe((data: {}) => {
      if (data['status']) {
        this.allBranches = data['result'];
      }
    }, err => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getAllDepartmentByBranchs(selectedBranchID) {
    this.departmentService.getAllDepartmentsByID(selectedBranchID).subscribe((data: {}) => {
      if (data['status']) {
        this.allDepartments = data['result'].filter(x => x.Name !== 'Accounting');
      }
    }, err => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getAllTaskByDepartments(selectedDepartmentID) {
    this.mainTaskService.getAllByDepartmentWithoutChild(selectedDepartmentID).subscribe((data: {}) => {
      if (data['status']) {
        this.allTasks = data['result'];
      }
    }, err => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getAllChildTaskByParents(selectedTaskID, taskType, index) {
    if (taskType === 'P') {
      this.WorkNewForm.patchValue({
        Cost: '',
        Time: ''
      });
      this.mainTaskService.getAllChildTaskByParentID(selectedTaskID).subscribe((data: {}) => {
        if (data['status']) {
          this.allChildTasks = data['result'];
        }
      }, err => {
        this.spinnerService.hide();
        this.snackBar.open('Server Error', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
      });
    } else {
      this.costOnFirst = Number(this.allTasks[index].Cost);
      this.timeOnFirst = Number(this.allTasks[index].Days);
      this.WorkNewForm.patchValue({
        Cost: this.costOnFirst,
        Time: this.timeOnFirst,
        ChildTask: []
      });
    }
  }

  getAllEmployees(selectedDepartmentID) {
    // if(this.currentUser.role == '')
    this.userService.getAllUserByDepartment(selectedDepartmentID).subscribe((data: {}) => {
      if (data['status']) {
        this.allEmployees = data['result'];
      }
    }, err => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getAllEmployeesByLeader(selectedLeaderID) {
    // if(this.currentUser.role == '')
    this.userService.getAllUserByLeader(selectedLeaderID).subscribe((data: {}) => {
      if (data['status']) {
        this.allEmployees = data['result'];
      }
    }, err => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getChildTaskDetail(selectedChildTask) {
    this.costOnFirst = 0;
    this.timeOnFirst = 0;
    for (const item of selectedChildTask) {
      const index = this.allChildTasks.findIndex(x => x.Name === item);
      const selectedChildTaskID = this.allChildTasks[index]._id;
      this.mainTaskService.getOneChildTask(selectedChildTaskID).subscribe((data: {}) => {
        if (data['status']) {
          this.costOnFirst += Number(data['result'].Cost);
          this.timeOnFirst += Number(data['result'].Days);
          this.WorkNewForm.patchValue({
            Cost: this.costOnFirst,
            Time: this.timeOnFirst
          });
        }
      }, err => {
        this.spinnerService.hide();
        this.snackBar.open('Server Error', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
      });
    }
  }

  onBranchChange(selectedBranchID) {
    if (this.clientWorkArray.length > 0) {
      this.snackBar.open('All of your assignments have been removed because you have changed the branch.', 'Error', {
        duration: 5000,
        panelClass: ['warning-snackbar'],
        verticalPosition: 'top'
      });
      this.clientWorkArray = [];
      this.dataSource = new MatTableDataSource(this.clientWorkArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.allChildTasks.length = 0;
    if (!selectedBranchID) {
      this.allDepartments = [];
      return 0;
    }
    this.getAllDepartmentByBranchs(selectedBranchID);
  }

  onDepartmentChange(selectedDepartmentID) {
    if (this.clientWorkArray.length > 0) {
      this.snackBar.open('All of your assignments have been removed because you have changed the department.', 'Error', {
        duration: 5000,
        panelClass: ['warning-snackbar'],
        verticalPosition: 'top'
      });
      this.clientWorkArray = [];
      this.dataSource = new MatTableDataSource(this.clientWorkArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.allChildTasks.length = 0;
    if (!selectedDepartmentID) {
      this.allTasks = [];
      return 0;
    }
    this.getAllTaskByDepartments(selectedDepartmentID);
    this.getAllEmployees(selectedDepartmentID);
  }

  onTaskChange(selecteTaskID) {
    if (!selecteTaskID) {
      return 0;
    }
    this.allChildTasks.length = 0;
    const index = this.allTasks.findIndex(x => x._id === selecteTaskID);
    const taskType = this.allTasks[index].TaskType;
    this.getAllChildTaskByParents(selecteTaskID, taskType, index);
  }

  onChildTaskChange(selectedChildTask) {
    this.getChildTaskDetail(selectedChildTask);
  }

  onChangeEmployee(selectedEmployeeID) {
    this.userService.getOneUser(selectedEmployeeID).subscribe((data) => {
      if (data['status']) {
        this.selectedEmployee = data['result'];
      }
    });
  }

  addClientWork() {
    for (const st of this.allChildTasks) {
      if (st.Is_Repetitive) {
        if (st.LastDate === undefined) {
          this.snackBar.open('Please put LastDate', 'Error', {
            duration: 5000,
            panelClass: ['danger-snackbar'],
            verticalPosition: 'top'
          });
          return 0;
        }
        if (st.Occurrence === undefined) {
          this.snackBar.open('Please put occurrence', 'Error', {
            duration: 5000,
            panelClass: ['danger-snackbar'],
            verticalPosition: 'top'
          });
          return 0;
        }
        if (st.GracePeriod === undefined) {
          this.snackBar.open('Please put GracePeriod', 'Error', {
            duration: 5000,
            panelClass: ['danger-snackbar'],
            verticalPosition: 'top'
          });
          return 0;
        }
        if ( parseInt(st.Occurrence) < parseInt(st.GracePeriod)) {
          this.snackBar.open('Please put reminder period less then occurrence', 'Error', {
            duration: 5000,
            panelClass: ['danger-snackbar'],
            verticalPosition: 'top'
          });
          return 0;
        }
      }
    }
    if (this.WorkNewForm.get('Is_Repetitive').value) {
      if (!this.WorkNewForm.get('LastDate').value) {
        this.snackBar.open('Please put last date', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
        return 0;
      }
      if (!this.WorkNewForm.get('Occurrence').value) {
        this.snackBar.open('Please put occurrence', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
        return 0;
      }
      if (!this.WorkNewForm.get('GracePeriod').value) {
        this.snackBar.open('Please put reminder period', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
        return 0;
      }
      if (this.WorkNewForm.get('Occurrence').value < this.WorkNewForm.get('GracePeriod').value ) {
        this.snackBar.open('Please put reminder period less then occurrence', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
        return 0;
      }
    }
    if ((this.WorkNewForm.get('Cost').value) && this.costOnFirst !== this.WorkNewForm.get('Cost').value) {
      if (!(this.WorkNewForm.get('CostNote').value)) {
        this.snackBar.open('Please put reason for update cost', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
        return 0;
      }
    }
    if ((this.WorkNewForm.get('Time').value) && this.timeOnFirst != this.WorkNewForm.get('Time').value) {
      if (!(this.WorkNewForm.get('TimeNote').value)) {
        this.snackBar.open('Please put reason for update task taking time', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
        return 0;
      }
    }
    const selectedTaskID = this.WorkNewForm.get('TaskID').value;
    const index = this.allTasks.findIndex(x => x._id === selectedTaskID);
    const addedTaskIndex = this.clientWorkArray.findIndex(x => x.TaskID === selectedTaskID);
    if (addedTaskIndex !== -1) {
      this.snackBar.open('Selected task already in grid', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
      return 0;
    }
    const childTaskArray = [];
    if (this.allTasks[index].TaskType === 'R') {
      if (!this.WorkNewForm.get('Cost').value || !this.WorkNewForm.get('Time').value) {
        this.snackBar.open('Cost and Time required', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
        return 0;
      }
    } else {
      for (const item of this.allChildTasks) {
        if (item.value) {
          this.WorkNewForm.patchValue({
            Cost: Number(item.Cost) + Number(this.WorkNewForm.get('Cost').value),
            Time: Number(item.Days) + Number(this.WorkNewForm.get('Time').value),
            Is_Repetitive : item.Is_Repetitive ? item.Is_Repetitive : this.WorkNewForm.get('Is_Repetitive').value
          });
          childTaskArray.push({
            id: item._id,
            Name: item.Name,
            Cost: item.Cost,
            Time: item.Days,
            CheckList: item.CheckList,
            Is_Repetitive: item.Is_Repetitive,
            LastDate: item.LastDate,
            Occurrence: item.Occurrence,
            GracePeriod: item.GracePeriod
          });
        }
      }
      if (childTaskArray.length === 0) {
        this.snackBar.open('Please select minimum one sub task', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
        return 0;
      }
    }
    const array = this.WorkNewForm.value;
    array.TaskName = this.allTasks[index].Name;
    array.CheckList = this.allTasks[index].CheckList;
    array.ChildTask = childTaskArray;
    array.AssignBy = this.currentUser.id;
    this.clientWorkArray.push(array);
    this.dataSource = new MatTableDataSource(this.clientWorkArray);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.snackBar.open('Work added successfully', 'success', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top'
    });
    const branchID = this.WorkNewForm.get('BranchID').value;
    const departmentID = this.WorkNewForm.get('DepartmentID').value;
    this.WorkNewForm.reset();
    this.allChildTasks = [];
    this.costOnFirst = 0;
    this.timeOnFirst = 0;
    this.WorkNewForm.patchValue({
      BranchID: branchID,
      DepartmentID: departmentID,
    });
  }

  deleteClientWork(id) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {disableClose: false});
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete ?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientWorkArray.splice(id);
        this.dataSource = new MatTableDataSource(this.clientWorkArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.snackBar.open('Client Work deleted successfully', 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
      }
    });
  }

  getTotalCost() {
    const total: number = this.clientWorkArray.reduce(
      (a: number, b) => a + b.Cost, 0);
    return total;
  }

  getTotalTime() {
    const total: number = this.clientWorkArray.reduce(
      (a: number, b) => a + b.Time, 0);
    return total;
  }

  onSubmitForm() {
    this.workNewService.addClientWork(this.employeeID, this.selectedClient.id, this.clientWorkArray).subscribe((data) => {
      if (data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/employees/workList']);
      }
    });
  }

  openPDF(index, name) {
    console.log(index);
    dialogOpenFrom = 'checklist-last';
    const pdfContent = this.clientWorkArray[index];
    checkListHtml = pdfContent;
    const dialogRef = this.dialog.open(ClientSearchForWorkComponent, {width: '60%'});
  }
  openPDFDownload(index, name) {
    console.log(index);
    dialogOpenFrom = 'checklist-last';
    const pdfContent = this.clientWorkArray[index];
    let clHtml = '';
    if (pdfContent.CheckList) {
      clHtml  = clHtml + pdfContent.CheckList;
    } else {
      for (const rw of pdfContent.ChildTask) {
        clHtml  = clHtml + rw.CheckList;
      }
    }

    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(clHtml);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
    // var doc = new jspdf('A4');
    // var source = clHtml;
    // var specialElementHandlers = {
    //   '#bypassme': function(element, renderer) {
    //     return true;
    //   }
    // };
    //
    // doc.fromHTML(
    //   source, // HTML string or DOM elem ref.
    //   0.5, // x coord
    //   0.5, // y coord
    //   {
    //     'elementHandlers': specialElementHandlers
    //   });
    // doc.save('CheckList.pdf');
  }

  openClientSerachDialog() {
    dialogOpenFrom = 'client';
    const dialogRef = this.dialog.open(ClientSearchForWorkComponent, {width: '60%'});

    dialogRef.afterClosed().subscribe(result => {
      this.clientName = refrenceArray.client;
      if (refrenceArray) {
        this.selectedClient = refrenceArray;
      }
    });
  }

  viewCheckList(row) {
    dialogOpenFrom = 'checklist';
    const pdfContent = row.CheckList;
    checkListHtml = pdfContent;
    const dialogRef = this.dialog.open(ClientSearchForWorkComponent, {width: '60%'});
  }
}

export interface ClientData {
  _id: string;
  Name: string;
  Phone: string;
  Email: string;
}

@Component({
  templateUrl: './client-search-model.html',
  styleUrls: ['./workNew.component.scss']
})
export class ClientSearchForWorkComponent {
  displayedColumns: string[] = ['Name', 'Address', 'Phone'];
  dataSource: MatTableDataSource<ClientData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  SearchPerson: FormGroup;
  selectedClients: any;
  dialogOpenFrom: string;
  checkListHtml: string;

  constructor(public dialogRef: MatDialogRef<ClientSearchForWorkComponent>,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private clientService: ClientService) {
    this.SearchPerson = fb.group({
      UID: [''],
      Name: [''],
      Phone: ['']
    });
    this.dialogOpenFrom = dialogOpenFrom;
    this.checkListHtml = checkListHtml;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmitForm() {
    if (this.SearchPerson.value.Name === '' && this.SearchPerson.value.Phone === '' && this.SearchPerson.value.UID === '') {
      this.snackBar.open('Please select anyone from UID, Client/Firm Name and Mobile No', 'warning', {
        duration: 5000,
        panelClass: ['warning-snackbar'],
        verticalPosition: 'top'
      });
      return 0;
    }
    this.clientService.getAllClientsByFilterValue(this.SearchPerson.value).subscribe((data: {}) => {
      if (data['status']) {
        this.selectedClients = data['result'];
        this.dataSource = new MatTableDataSource(this.selectedClients);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.SearchPerson.reset();
        if (this.selectedClients.length > 0) {
          this.snackBar.open('Recorded added into table', 'success', {
            duration: 5000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top'
          });
        } else {
          this.snackBar.open('There are no record to show', 'warning', {
            duration: 5000,
            panelClass: ['warning-snackbar'],
            verticalPosition: 'top'
          });
        }
      }
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getRowDetail(row) {
    refrenceArray = {};
    refrenceArray = {
      client: row.Name,
      Name: row.Name,
      id: row._id,
      UID: row.CID,
      Mobile: row.Phone
    };
    this.dialogRef.close();
  }
}
