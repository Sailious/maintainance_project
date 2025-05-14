// register-error-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-error-dialog',
  template: `
    <div class="error-dialog">
      <mat-icon class="error-icon">error_outline</mat-icon>
      <h2 class="error-title">Registration failed</h2>
      <p class="error-message">{{ data.message }}</p>
      <button mat-raised-button
              color="warn"
              (click)="dialogRef.close()">
        Close
      </button>
    </div>
  `,
  styles: [`
    .error-dialog {
      text-align: center;
      padding: 24px;
    }

    .error-icon {
      color: #d32f2f;
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .error-title {
      color: #d32f2f;
      margin: 16px 0;
    }

    .error-message {
      color: #666;
      margin-bottom: 24px;
      max-width: 300px;
      word-break: break-word;
    }
  `]
})
export class RegisterErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RegisterErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}
