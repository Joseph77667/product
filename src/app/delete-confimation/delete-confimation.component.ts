import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confimation',
  templateUrl: './delete-confimation.component.html',
  styleUrls: ['./delete-confimation.component.css'],
})
export class DeleteConfimationComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
