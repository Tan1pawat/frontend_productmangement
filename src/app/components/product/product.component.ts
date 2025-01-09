import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Config } from 'datatables.net';
import { ProductService } from './product.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PictureComponent } from '../picture/picture.component';
import { ProductFormDialogComponent } from './form/form.component';
import { Subject } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ProductFormEditComponent } from './form-edit/form-edit.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    DataTablesModule,
    MatIconModule,
    MatProgressBarModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements AfterViewInit, OnDestroy, OnInit {
  constructor
    (
      private _Productservice: ProductService,
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

  addElement() {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '800px',
      height: 'auto',
      disableClose: true,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rerender();
      }
    });
  }

  // excelExport() {
  //   window.open(
  //     'https://laongherbalgroup.com/api/public/api/export_product/1'
  //   );
  // }

  editElement(id: number) {
    const dialogRef = this.dialog.open(ProductFormEditComponent, {
      width: '800px',
      height: 'auto',
      data: { id: id },
      disableClose: true,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rerender();
      }
    });
  }

  delete(itemid: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'ลบข้อมูล',
        message: 'คุณต้องการลบข้อมูลไหม?',
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._Productservice.delete(itemid).subscribe({
          next: () => {
            this.rerender();
          },
          error: (err: any) => {
            console.error('Error deleting item:', err);
          },
        });
      }
    });
  }

  showPicture(imgObject: any): void {
    this.dialog
      .open(PictureComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          imgSelected: imgObject,
        },
        panelClass: 'picture-dialog',
      })
      .afterClosed()
      .subscribe(() => {
        // Go up twice because card routes are setup like this; "card/CARD_ID"
        // this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
      });
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
        that._Productservice
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

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    if (this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance) => {
        dtInstance.ajax.reload();
      });
    } else {
      // If DataTables instance is not ready, reinitialize
      this.dtTrigger.next(null);
    }
  }
}