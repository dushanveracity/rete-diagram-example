import {
  Component,
  Input,
  HostBinding,
  ChangeDetectorRef,
  OnChanges,
} from '@angular/core';
import { ClassicPreset } from 'rete';
import { KeyValue } from '@angular/common';
import { NodeComponent } from 'rete-angular-plugin/16';
import { Node } from 'rete/_types/presets/classic';

interface NodePreset extends ClassicPreset.Node {
  data: Record<string, any>;
}

@Component({
  selector: 'app-vertical-node',
  templateUrl: './vertical-node.component.html',
  styleUrls: ['./vertical-node.component.scss'],
  host: {
    'data-testid': 'node',
  },
})
export class VerticalNodeComponent {
  @Input() data!: NodePreset;
  @Input() emit!: (data: any) => void;
  @Input() rendered!: () => void;

  seed = 0;

  @HostBinding('class.selected') get selected() {
    return this.data.selected;
  }

  constructor(private cdr: ChangeDetectorRef) {
    this.cdr.detach();
  }

  ngOnChanges(): void {
    this.cdr.detectChanges();
    requestAnimationFrame(() => this.rendered());
    this.seed++; // force render sockets
  }

  sortByIndex(a: any, b: any) {
    const ai = a.value.index || 0;
    const bi = b.value.index || 0;

    return ai - bi;
  }
}
