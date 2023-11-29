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
import { inverterData, combinerBoxData, transformerData } from './data/data';
import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
  ArrangeAppliers,
} from 'rete-auto-arrange-plugin';
import { VerticalSocketComponent } from './components/vertical-socket/vertical-socket.component';
import { VerticalConnectionComponent } from './components/vertical-connection/vertical-connection.component';
import { BaseSocketPosition, getDOMSocketPosition } from 'rete-render-utils';

class Node extends ClassicPreset.Node {
  width = 180;
  height = 80;
  data: { imgUrl: string; type: string } = { imgUrl: '', type: '' };
}
class Connection<N extends Node> extends ClassicPreset.Connection<N, N> {}
type Schemes = GetSchemes<Node, Connection<Node>>;
type AreaExtra = AngularArea2D<Schemes>;

type Position = { x: number; y: number };
type Side = 'input' | 'output';
class ComputedSocketPosition<S extends Schemes, K> extends BaseSocketPosition<
  S,
  K
> {
  async calculatePosition(
    nodeId: string,
    side: Side,
    key: string
  ): Promise<Position | null> {
    if (!this.area) return null;
    console.log(nodeId, side, key);
    return {
      x: 100,
      y: 10,
    };
  }
}

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


  deviceList = {
    inverters: inverterData,
    combinerboxes: combinerBoxData,
    transformers: transformerData,
  };
  selected = {
    inverter: inverterData[0],
    combinerbox: combinerBoxData[0],
    transformer: transformerData[0],
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
        socketPositionWatcher: getDOMSocketPosition({
          offset({ x, y }, nodeId, side, key) {
            console.log(x,y)
            return {
              x: x,
              y: y,
            };
          },
        }),
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
    inverterNode.data = {
      imgUrl: 'assets/images/inverter.png',
      type: 'inverter',
    };

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
    combinerboxNode.data = {
      imgUrl: 'assets/images/combinerbox.png',
      type: 'combinerbox',
    };

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
    transformerNode.data = {
      imgUrl: 'assets/images/transformer.png',
      type: 'transformer',
    };

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

    const nodes = this.editor.getNodes();
    const transformers = nodes.filter(
      (node) => node.data.type === 'transformer'
    );

    if (transformers.length < 2) {
      await this.area?.translate(transformerNode.id, { x: 0, y: 350 });
      return;
    }

    if (transformers.length % 2 === 0) {
      const right = transformers.slice(0, transformers.length / 2);
      const left = transformers.slice(transformers.length / 2);

      for (let i = 0; i < left.length; i++) {
        console.log('even left loop', i);
        await this.area?.translate(left[i].id, { x: -200 * (i + 1), y: 350 });
      }
      for (let i = 0; i < right.length; i++) {
        console.log('even right loop', i);
        await this.area?.translate(right[i].id, { x: 200 * (i + 1), y: 350 });
      }
    } else {
      const centerNodeIdx = Math.round(transformers.length / 2 - 1);
      const centerNode = transformers[centerNodeIdx];
      await this.area?.translate(centerNode.id, { x: 0, y: 350 });

      const left = transformers.slice(0, centerNodeIdx);
      const right = transformers.slice(centerNodeIdx + 1);

      for (let i = 0; i < left.length; i++) {
        await this.area?.translate(left[i].id, { x: -350 * (i + 1), y: 350 });
      }
      for (let i = 0; i < right.length; i++) {
        await this.area?.translate(right[i].id, { x: 350 * (i + 1), y: 350 });
      }
    }

    // await this.arrange.layout({ applier: this.applier });
  }

  async arrangeNodes() {
    const nodes = this.editor.getNodes();

    console.log(nodes);
    await this.arrange.layout();
    
    console.log('arranging')

    // const strings = nodes.
  }
}
