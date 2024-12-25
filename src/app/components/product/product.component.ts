import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../../type';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Config } from 'datatables.net';
import { ProductService } from './product.service';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PictureComponent } from '../picture/picture.component';

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
export class ProductComponent implements OnInit {
  constructor
    (
      private _Productservice: ProductService,
      private _changeDetectorRef: ChangeDetectorRef,
      private _router: Router,
      private dialog: MatDialog,
    ) { }
  dtOptions: Config = {};
  languageUrl = 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
  dataRow: any[] = [];
  isLoading: boolean = false;

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.loadTable();
  }

  addElement() {
    this._router.navigate(['admin/product/form']);
  }

  excelExport() {
    window.open(
      'https://laongherbalgroup.com/api/public/api/export_product/1'
    );
  }

  editElement(element: any) {
    this._router.navigate(['admin/product/edit/' + element]);
  }

  viewElement(element: any) {
    // const dialogRef = this.dialog.open(EditDialogComponent, {
    //     width: '700px', // กำหนดความกว้างของ Dialog
    //     data: element,
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //     if (result) {
    //         //    console.log(result,'result')
    //     }
    // });
  }

  delete(itemid: any) {
    // if (this.langues == 'tr') {
    //   const confirmation = this._fuseConfirmationService.open({
    //     title: 'ลบข้อมูล',
    //     message: 'คุณต้องการลบข้อมูลใช่หรือไม่ ?',
    //     icon: {
    //       show: true,
    //       name: 'heroicons_outline:exclamation-triangle',
    //       color: 'warning',
    //     },
    //     actions: {
    //       confirm: {
    //         show: true,
    //         label: 'Remove',
    //         color: 'warn',
    //       },
    //       cancel: {
    //         show: true,
    //         label: 'Cancel',
    //       },
    //     },
    //     dismissible: true,
    //   });
    //   confirmation.afterClosed().subscribe((result) => {
    //     if (result === 'confirmed') {
    //       this._service.delete(itemid).subscribe((resp) => {
    //         this.rerender();
    //       });
    //     }
    //     error: (err: any) => { };
    //   });
    // }
    // else if (this.langues == 'en') {
    //   const confirmation = this._fuseConfirmationService.open({
    //     title: 'Delete Data',
    //     message: ' Do you want to delete the data ?',
    //     icon: {
    //       show: true,
    //       name: 'heroicons_outline:exclamation-triangle',
    //       color: 'warning',
    //     },
    //     actions: {
    //       confirm: {
    //         show: true,
    //         label: 'Remove',
    //         color: 'warn',
    //       },
    //       cancel: {
    //         show: true,
    //         label: 'Cancel',
    //       },
    //     },
    //     dismissible: true,
    //   });
    //   confirmation.afterClosed().subscribe((result) => {
    //     if (result === 'confirmed') {
    //       this._service.delete(itemid).subscribe((resp) => {
    //         this.rerender();
    //       });
    //     }
    //     error: (err: any) => { };
    //   });
    // }
  }

  showPicture(imgObject: any): void {
    this.dialog
        .open(PictureComponent, {
            autoFocus: false,
            data: {
                imgSelected: imgObject,
            },
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
      pageLength: 25,
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

}