import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-picture',
  standalone: true,
  imports: [],
  templateUrl: './picture.component.html',
  styleUrl: './picture.component.scss'
})
export class PictureComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  imgSelected: string | undefined;
  /**
   * Constructor
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data:any,

  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.imgSelected = this._data.imgSelected;


  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
