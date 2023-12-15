import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";

/**
 * @title Paginator
 */
@Component({
  selector: 'pagination',
  templateUrl: 'pagination.component.html',
})
export class PaginationComponent {
  @Output() lowValueChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() highValueChange: EventEmitter<number> = new EventEmitter<number>();

  // mat-paginator
  @Input() length?: number;
  pageIndex: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [1, 2, 5, 10];

  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValueChange.emit(event.pageIndex * event.pageSize);
    this.highValueChange.emit(event.pageIndex * event.pageSize + event.pageSize);
    return event;
  }

  ngOnInit(): void {
    this.lowValueChange.emit(this.pageIndex * this.pageSize);
    this.highValueChange.emit(this.pageIndex * this.pageSize + this.pageSize);
  }
}
