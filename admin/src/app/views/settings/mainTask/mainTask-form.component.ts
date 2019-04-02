import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MainTaskService} from './mainTask.service';
import { Router} from '@angular/router';

import { DepartmentService} from '../department/department.service';
import { BranchService} from '../branch/branch.service';
import {MatSnackBar} from '@angular/material';
import { MatDialog, MatDialogRef  } from '@angular/material';
import { ConfirmationDialogComponent} from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import {AngularEditorConfig} from '@kolkov/angular-editor';

@Component({
  selector: 'app-maintask-form',
  templateUrl: './mainTask-form.component.html',
  styleUrls: ['./mainTask.component.scss']
})
export class MainTaskFormComponent implements OnInit {
  MainTaskForm: FormGroup;
  RootTaskForm: FormGroup;
  ParentTaskForm: FormGroup;
  ChildTaskForm: FormGroup;
  mainTaskID: String;
  showSpinner: boolean;
  allDepartments: any;
  TaskType = 'R';
  allBranches: any;
  ParentTask: any = [];
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '10rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: '/src/assets/img/', // if needed\src\assets\img
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  localStorage: any;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private mainTaskService: MainTaskService,
    private router: Router,
    private departmentService: DepartmentService,
    private branchService: BranchService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.showSpinner = false;
    this.mainTaskID = this.route.params['value'].id;
    this.MainTaskForm = fb.group({
      Name: [ '', [Validators.required ] ],
      Days: [ '', [Validators.required ] ],
      Cost: [ '', [Validators.required ] ],
      BranchID: [ '', [Validators.required ] ],
      DepartmentID: [ '', [Validators.required ] ],
      Description: [''],
      Checklist: new FormControl(null),
    });

    this.RootTaskForm = fb.group({
      Name: [ '', [Validators.required ] ],
      Days: [ '', [Validators.required ] ],
      Cost: [ '', [Validators.required ] ],
      BranchID: [ '', [Validators.required ] ],
      DepartmentID: [ '', [Validators.required ] ],
      Description: ['', [Validators.required ]],
      CheckList: ['', [Validators.required ]],
    });
    this.ParentTaskForm = fb.group({
      Name: [ '', [Validators.required ] ],
      BranchID: [ '', [Validators.required ] ],
      DepartmentID: [ '', [Validators.required ] ],
      Description: [''],
    });
    this.ChildTaskForm = fb.group({
      Name: [ '', [Validators.required ] ],
      Days: [ '', [Validators.required ] ],
      Cost: [ '', [Validators.required ] ],
      ParentTaskID: [ '', [Validators.required ] ],
      DepartmentID: [ {value : '' , disabled : true}, [Validators.required ] ],
      Description: ['', [Validators.required ]],
      CheckList: ['', [Validators.required ]],
    });
    this.localStorage = JSON.parse(localStorage.getItem('currentUser'));
    if (this.mainTaskID !== '-1') {
      this.getOne(this.mainTaskID);
    } else {
      if (this.localStorage.role !== 'Super Admin') {
        this.RootTaskForm.patchValue({
          BranchID: this.localStorage.Branch._id
        });
        this.ParentTaskForm.patchValue({
          BranchID: this.localStorage.Branch._id
        });
        this.getAllDepartmentsByBranch(this.localStorage.Branch._id);
      }
    }
  }
  setTasksType() {
    // alert(this.TaskType);
    if (this.TaskType === 'P') {
      this.RootTaskForm.reset();
      this.ChildTaskForm.reset();
    }
    if (this.TaskType === 'R') {
      this.ParentTaskForm.reset();
      this.ChildTaskForm.reset();
    }
    if (this.TaskType === 'C') {
      this.RootTaskForm.reset();
      this.ParentTaskForm.reset();
    }
  }

  ngOnInit() {
    this.getAllBranches();
    this.mainTaskService.getAllByTaskType('P').subscribe((data: {}) => {
      if (data['status']) {
        this.ParentTask = data['result'];
      }
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getAllBranches() {
    this.branchService.getAllBranchs().subscribe((data: {}) => {
      this.allBranches = data['result'];
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getAllByParentID() {
    this.mainTaskService.getAllByParentID(this.ChildTaskForm.value.ParentTaskID).subscribe((data: {}) => {
      if (data['status']) {
        this.ChildTaskForm.patchValue({
          DepartmentID: data['result'].DepartmentID._id
        });
      }
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getAllDepartmentsByBranch(selectedID) {
    this.allDepartments = [];
    if (selectedID !== undefined) {
      this.departmentService.getAllDepartmentsByID(selectedID).subscribe((data: {}) => {
        this.allDepartments = data['result'];
      }, err => {
        this.snackBar.open('Server Error', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
      });
    }
  }
  onChangeBranch(id) {
    this.getAllDepartmentsByBranch(id);
  }

  onSubmitForm() {
    if (this.TaskType === 'R') {
      if (this.RootTaskForm.invalid) {
        return 0;
      }
    }
    if (this.TaskType === 'P') {
      if (this.ParentTaskForm.invalid) {
        return 0;
      }
    }
    if (this.TaskType === 'C') {
      if (this.ChildTaskForm.invalid) {
        return 0;
      }
    }
    this.showSpinner = true;
    if (this.mainTaskID === '-1') {
      if (this.TaskType === 'R') {
        this.RootTaskForm.value.TaskType = 'R';
        this.createNew(this.RootTaskForm.value);
      }
      if (this.TaskType === 'P') {
        this.ParentTaskForm.value.TaskType = 'P';
        this.createNew(this.ParentTaskForm.value);
      }
      if (this.TaskType === 'C') {
        this.ChildTaskForm.value.TaskType = 'C';
        const dpt = this.ChildTaskForm.get('DepartmentID').value;
        this.ChildTaskForm.value.DepartmentID = dpt;
        this.createNew(this.ChildTaskForm.value);
      }

    } else {
      if (this.TaskType === 'R') {
        this.RootTaskForm.value.TaskType = 'R';
        this.editExisting(this.RootTaskForm.value);
      }
      if (this.TaskType === 'P') {
        this.ParentTaskForm.value.TaskType = 'P';
        this.editExisting(this.ParentTaskForm.value);
      }
      if (this.TaskType === 'C') {
        this.ChildTaskForm.value.TaskType = 'C';
        this.editExisting(this.ChildTaskForm.value);
      }

    }
   }

  createNew(task) {
    this.mainTaskService.addMainTask(task).subscribe((data: {}) => {
      if ( data['status']) {
        this.showSpinner = false;
        this.router.navigate(['/settings/Task']);
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
      }
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  editExisting(task) {
    this.mainTaskService.updateMainTask(this.mainTaskID, task).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/Task']);
      }
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getOne(id) {
    this.mainTaskService.getOneMainTask(id).subscribe((data: {}) => {
      if ( data['status']) {
        this.getAllDepartmentsByBranch(data['result'].DepartmentID.BranchID);
        if (data['result'].TaskType === 'R') {
          this.TaskType = 'R';
          this.RootTaskForm = this.fb.group({
            Name: [ {value: data['result'].Name, disabled: true}, [Validators.required ] ],
            Days: [ data['result'].Days, [Validators.required ] ],
            Cost: [ data['result'].Cost, [Validators.required ] ],
            BranchID: [ data['result'].DepartmentID.BranchID, [Validators.required ] ],
            DepartmentID: [ data['result'].DepartmentID._id, [Validators.required ] ],
            Description: [data['result'].Description],
            CheckList: [data['result'].CheckList],
          });
        }
        if (data['result'].TaskType === 'P') {
          this.TaskType = 'P';
          this.ParentTaskForm = this.fb.group({
            Name: [ {value: data['result'].Name, disabled: true}, [Validators.required ] ],
            BranchID: [ data['result'].DepartmentID.BranchID, [Validators.required ] ],
            DepartmentID: [ data['result'].DepartmentID._id, [Validators.required ] ],
            Description: [data['result'].Description],
          });
        }
        if (data['result'].TaskType === 'C') {
          this.TaskType = 'C';
          this.ChildTaskForm = this.fb.group({
            Name: [ {value: data['result'].Name, disabled: true}, [Validators.required ] ],
            Days: [ data['result'].Days, [Validators.required ] ],
            Cost: [ data['result'].Cost, [Validators.required ] ],
            DepartmentID: [ {value: data['result'].DepartmentID._id , disabled: true}, [Validators.required ] ],
            ParentTaskID: [ data['result'].ParentTaskID._id, [Validators.required ] ],
            Description: [data['result'].Description],
            CheckList: [data['result'].CheckList],
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

  cancel() {
    this.showSpinner = true;
    this.router.navigate(['/settings/Task']);
  }
  reset() {
    this.RootTaskForm.reset();
    this.ParentTaskForm.reset();
    this.ChildTaskForm.reset();
  }

}
