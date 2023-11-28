import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Injector,
} from '@angular/core';
import { ClassicPreset, GetSchemes, NodeEditor } from 'rete';
import { AngularArea2D, Presets, AngularPlugin } from 'rete-angular-plugin/15';
import { AreaExtensions, AreaPlugin, Area2D } from 'rete-area-plugin';
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from 'rete-connection-plugin';
import {
  ConnectionPathPlugin,
  Transformers,
} from 'rete-connection-path-plugin';
import { VerticalNodeComponent } from './components/vertical-node/vertical-node.component';
import { inverters, combinerBoxes, transformers } from './data/data';
import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
  ArrangeAppliers,
} from 'rete-auto-arrange-plugin';
import { VerticalSocketComponent } from './components/vertical-socket/vertical-socket.component';
import { VerticalConnectionComponent } from './components/vertical-connection/vertical-connection.component';

class Node extends ClassicPreset.Node {
  width = 180;
  height = 80;
  data: { imgUrl: string, type: string } = { imgUrl: '', type: '' };
}
class Connection<N extends Node> extends ClassicPreset.Connection<N, N> {}
type Schemes = GetSchemes<Node, Connection<Node>>;
type AreaExtra = AngularArea2D<Schemes>;

@Component({
  selector: 'app-rete-diagram',
  templateUrl: './rete-diagram.component.html',
  styles: [
    `
      .rete {
        width: 100vw;
        height: 100vh;
      }
    `,
  ],
})
export class ReteDiagramComponent implements AfterViewInit {
  constructor(private injector: Injector) {}
  @ViewChild('rete') container!: ElementRef;
  title = 'CodeSandbox';
  socket = new ClassicPreset.Socket('socket');
  editor = new NodeEditor<Schemes>();
  area: AreaPlugin<Schemes, AreaExtra> | null = null;
  connection = new ConnectionPlugin<Schemes, AreaExtra>();
  render = new AngularPlugin<Schemes, AreaExtra>({ injector: this.injector });
  pathPlugin = new ConnectionPathPlugin<Schemes, Area2D<Schemes>>({
    // curve: (c) => c.curve || curveStep // curveLinear
    transformer: () => Transformers.classic({ vertical: true, curvature: 0.5 }),
    arrow: () => true,
  });
  arrange = new AutoArrangePlugin<Schemes>();
  applier = new ArrangeAppliers.TransitionApplier<Schemes, never>({
    duration: 200,
    timingFunction: (t) => t,
    async onTick() {
      // await AreaExtensions.zoomAt(this.area, this.editor.getNodes());
    },
  });
  deviceList = {
    inverters: inverters,
    combinerboxes: combinerBoxes,
    transformers: transformers,
  };
  selected = {
    inverter: inverters[0],
    combinerbox: combinerBoxes[0],
    transformer: transformers[0],
  };

  async ngAfterViewInit(): Promise<void> {
    const pathPlugin = new ConnectionPathPlugin<Schemes, Area2D<Schemes>>({
      // curve: (c: any) => c.curve, // curveLinear
      transformer: () =>
        Transformers.classic({ vertical: true, curvature: 0.4 }),
      arrow: () => true,
    });
    this.area = new AreaPlugin<Schemes, AreaExtra>(
      this.container.nativeElement
    );

    // @ts-ignore
    this.render.use(pathPlugin);

    AreaExtensions.selectableNodes(this.area, AreaExtensions.selector(), {
      accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    this.render.addPreset(
      Presets.classic.setup({
        customize: {
          node() {
            return VerticalNodeComponent;
          },
          socket() {
            return VerticalSocketComponent;
          },
          connection() {
            return VerticalConnectionComponent;
          },
        },
      })
    );

    this.connection.addPreset(ConnectionPresets.classic.setup());

    this.editor.use(this.area);
    this.area.use(this.connection);
    this.area.use(this.render);

    this.arrange.addPreset(ArrangePresets.classic.setup());

    // @ts-ignore
    this.area.use(this.arrange);

    AreaExtensions.simpleNodesOrder(this.area);

    // const a = new ClassicPreset.Node('Solar Panel');
    // a.addOutput('b', new ClassicPreset.Output(this.socket));
    // a.addOutput('a', new ClassicPreset.Output(this.socket));
    // await this.editor.addNode(a);

    // const b = new ClassicPreset.Node('Inverter');
    // b.addInput('c', new ClassicPreset.Input(this.socket));
    // b.addInput('d', new ClassicPreset.Input(this.socket));
    // b.addInput('b', new ClassicPreset.Input(this.socket));
    // b.addOutput('a', new ClassicPreset.Output(this.socket));
    // await this.editor.addNode(b);

    // await this.area.translate(b.id, { x: 320, y: 0 });

    // await this.editor.addConnection(
    //   new ClassicPreset.Connection(a, 'a', b, 'b')
    // );

    AreaExtensions.zoomAt(this.area, this.editor.getNodes());
    // return () => area.destroy();

    this.editor.addPipe((context) => {
      if (context.type === 'connectioncreate') {
        console.log(context);
      }
      return context;
    });
  }

  // adding components
  changeSelectedDevice(
    deviceData: any,
    type: 'inverter' | 'combinerbox' | 'transformer'
  ) {
    console.log(deviceData);
    this.selected[type] = deviceData;
  }

  async addInverter() {
    const inverter = this.selected.inverter;
    const inverterNode = new Node(inverter.name);
    inverterNode.data = { imgUrl: 'assets/images/inverter.png', type: 'inverter' };

    inverter.outputs.forEach((output) => {
      inverterNode.addOutput(
        output.name,
        new ClassicPreset.Output(this.socket)
      );
    });

    inverter.inputs.forEach((input) => {
      inverterNode.addInput(input.name, new ClassicPreset.Input(this.socket));
    });

    console.log(this.editor);

    await this.editor.addNode(inverterNode);

    await this.area?.translate(inverterNode.id, { x: 0, y: -350 });
  }

  async addCombinerBox() {
    const combinerbox = this.selected.combinerbox;
    const combinerboxNode = new Node(combinerbox.name);
    combinerboxNode.data = { imgUrl: 'assets/images/combinerbox.png', type: 'combinerbox' };

    combinerbox.outputs.forEach((output) => {
      combinerboxNode.addOutput(
        output.name,
        new ClassicPreset.Output(this.socket)
      );
    });

    combinerbox.inputs.forEach((input) => {
      combinerboxNode.addInput(
        input.name,
        new ClassicPreset.Input(this.socket)
      );
    });

    await this.editor.addNode(combinerboxNode);

    await this.area?.translate(combinerboxNode.id, { x: 0, y: 0 });
  }

  async addTransformer() {
    const transformer = this.selected.transformer;
    const transformerNode = new Node(transformer.name);
    transformerNode.data = { imgUrl: 'assets/images/transformer.png', type: 'transformer' };

    transformer.outputs.forEach((output) => {
      transformerNode.addOutput(
        output.name,
        new ClassicPreset.Output(this.socket)
      );
    });

    transformer.inputs.forEach((input) => {
      transformerNode.addInput(
        input.name,
        new ClassicPreset.Input(this.socket)
      );
    });

    await this.editor.addNode(transformerNode);

    await this.area?.translate(transformerNode.id, { x: 0, y: 350 });

    // await this.arrange.layout({ applier: this.applier });
  }

  async arrangeNodes() {
    const nodes = this.editor.getNodes();

    console.log(nodes);

    // const strings = nodes.
  }
}
