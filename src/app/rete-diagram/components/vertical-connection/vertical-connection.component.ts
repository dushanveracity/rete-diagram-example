import { Component, Input } from '@angular/core';
import { ClassicPreset } from 'rete';

@Component({
  selector: 'connection',
  template: `
    <svg data-testid="connection">
      <path [attr.d]="path" />
    </svg>
  `,
  styleUrls: ['./vertical-connection.component.scss'],
})
export class VerticalConnectionComponent {
  @Input() data!: ClassicPreset.Connection<
    ClassicPreset.Node,
    ClassicPreset.Node
  >;
  @Input() start: any;
  @Input() end: any;
  @Input() path: string = '';
}
