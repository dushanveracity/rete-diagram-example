import {
  Component,
  Input,
  HostBinding,
  ChangeDetectorRef,
  OnChanges
} from "@angular/core";

@Component({
  template: ``,
  styleUrls: ["./vertical-socket.component.scss"]
})
export class VerticalSocketComponent implements OnChanges {
  @Input() data!: any;
  @Input() rendered!: any;

  @HostBinding("title") get title() {
    return this.data.name;
  }

  constructor(private cdr: ChangeDetectorRef) {
    this.cdr.detach();
  }

  ngOnChanges(): void {
    this.cdr.detectChanges();
    requestAnimationFrame(() => this.rendered());
  }
}
