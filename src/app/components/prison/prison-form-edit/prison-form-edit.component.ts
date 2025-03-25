import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PrisonService } from '../prison.service';

@Component({
  selector: 'app-prison-form-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './prison-form-edit.component.html',
  styleUrl: './prison-form-edit.component.scss'
})
export class PrisonFormEditComponent {
  PrisonForm: FormGroup = new FormGroup({});
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PrisonFormEditComponent>,
    private _PrisonService: PrisonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = !!data;
    this.initForm();
  }

  ngOnInit() {

    this._PrisonService.getPrisonById(this.data.id).subscribe({
      next: (response) => {
        this.PrisonForm.patchValue(response);
      },
      error: (error) => {
        console.error('Error getting product', error);
      }
    });
  }

  private initForm() {
    this.PrisonForm = this.fb.group({
      name: ['', Validators.required],
      receiver_address: ['', Validators.required],
      receiver_tax_number: ['', Validators.required],
    });
  }


  onSubmit() {
    if (this.PrisonForm.valid) {
      // Create FormData for file upload
      const formValue = this.PrisonForm.value;

      const PrisonForm = {
        name: formValue.name,
        receiver_address: formValue.receiver_address,
        receiver_tax_number: formValue.receiver_tax_number,
      }

      this._PrisonService.update(this.data.id,PrisonForm).subscribe({
        next: (response) => {
          console.log('Product created successfully', response);
        },
        error: (error) => {
          console.error('Error creating product', error);
        }
      });

      this.dialogRef.close(PrisonForm);
    }
  }
}
