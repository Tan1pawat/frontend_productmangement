import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../../type';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Config } from 'datatables.net';
import { ProductService } from './product.service';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    DataTablesModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  constructor
  (
    private _Productservice: ProductService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }
  dtOptions: Config = {};
  languageUrl = 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json';
  dataRow: any[] = [];

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    // this.loadTable();
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
                      console.log(this.dataRow);
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
          },
          columns: [
              { data: 'action', orderable: false },
              { data: 'No' },
              { data: 'No' },
              { data: 'No' },
              { data: 'No' },
              { data: 'No' },
              { data: 'No' },
              { data: 'name' },
              { data: 'create_by' },
              { data: 'created_at' },
          ],
      };
  }

}