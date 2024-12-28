import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { BillService } from './bill.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [
    MatProgressBarModule,
    DataTablesModule,
    MatIcon,
    NgIf,
    NgFor
  ],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.scss'
})
export class BillComponent implements AfterViewInit, OnDestroy, OnInit {
  constructor(
    private _Billservice: BillService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private dialog: MatDialog,
  ) { }

  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective
  languageUrl = 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
  dataRow: any[] = [];
  isLoading: boolean = false;

  ngOnInit() {

    this.loadTable();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  addElement() {
    // const dialogRef = this.dialog.open(ProductFormDialogComponent, {
    //   width: '800px',
    //   height: 'auto',
    //   disableClose: true,

    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.rerender();
    //   }
    // });
  }

    editElement(id: number) {
      // const dialogRef = this.dialog.open(ProductFormEditComponent, {
      //   width: '800px',
      //   height: 'auto',
      //   data: { id: id },
      //   disableClose: true,
  
      // });
  
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result) {
      //     this.rerender();
      //   }
      // });
    }
  
    delete(itemid: any): void {
      // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      //   width: '400px',
      //   data: {
      //     title: 'ลบข้อมูล',
      //     message: 'คุณต้องการลบข้อมูลไหม?',
      //   },
      // });
    
      // dialogRef.afterClosed().subscribe((result) => {
      //   if (result === 'confirmed') {
      //     this._Productservice.delete(itemid).subscribe({
      //       next: () => {
      //         this.rerender();
      //       },
      //       error: (err: any) => {
      //         console.error('Error deleting item:', err);
      //       },
      //     });
      //   }
      // });
    }
  
    showPicture(): void {

    }

  pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };

  loadTable(): void {

    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      language: {
        url: this.languageUrl,
      },
      ajax: (dataTablesParameters: any, callback) => {
        that._Billservice
          .getPage(dataTablesParameters)
          .subscribe((resp: any) => {
            this.dataRow = resp.data;
            this.pages.current_page = resp.current_page;
            this.pages.last_page = resp.last_page;
            this.pages.per_page = resp.per_page;
            if (resp.current_page > 1) {
              this.pages.begin =
                resp.per_page * resp.current_page - 1;
            } else {
              this.pages.begin = 0;
            }

            callback({
              recordsTotal: resp.total,
              recordsFiltered: resp.total,
              data: [],
            });
            this._changeDetectorRef.markForCheck();
          });
      }
    };

  }
}
