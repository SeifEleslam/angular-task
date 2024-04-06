import { Component, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-popover',
  standalone: true,
  imports: [],
  templateUrl: './custom-popover.component.html',
  styleUrl: './custom-popover.component.scss',
})
export class CustomPopoverComponent {
  @Input() title: string = '';
  @ViewChild('popover') popover!: { nativeElement: HTMLElement };
  @ViewChild('input') input!: { nativeElement: HTMLElement };
}
