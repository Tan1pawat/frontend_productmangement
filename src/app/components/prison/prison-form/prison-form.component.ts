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
  selector: 'app-prison-form',
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
  templateUrl: './prison-form.component.html',
  styleUrl: './prison-form.component.scss'
})
export class PrisonFormComponent {
  PrisonForm: FormGroup = new FormGroup({});
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PrisonFormComponent>,
    private _PrisonService: PrisonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = !!data;
    this.initForm();
  }

  ngOnInit() {

    if (this.isEdit && this.data) {
      this.PrisonForm.patchValue(this.data);
    }
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
      const formData = new FormData();
      const formValue = this.PrisonForm.value;

      Object.keys(formValue).forEach(key => {
        formData.append(key, formValue[key]);
      });

      this._PrisonService.create(formData).subscribe({
        next: (response) => {
          console.log('Product created successfully', response);
        },
        error: (error) => {
          console.error('Error creating product', error);
        }
      });

      this.dialogRef.close(formData);
    }
  }
}
