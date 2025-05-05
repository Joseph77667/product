import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  @Input() title: string = 'Confirm Delete';
  @Input() message: string = 'Are you sure you want to delete this item?';
  @Output() confirm = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onDismiss() {
    this.dismiss.emit();
  }
}