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
  height = 222;
  data: { imgUrl: string; type: string } = { imgUrl: '', type: '' };
}
class Socket extends ClassicPreset.Socket {}
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

type NodeData = {
  id: number;
  name: string;
  type: string;
  imgUrl: string;
  inputs: { id: number; name: string }[];
  outputs: { id: number; name: string }[];
  layer: number;
};

@Component({
  selector: 'app-rete-diagram',
  templateUrl: './rete-diagram.component.html',
  styleUrls: ['./rete-diagram.component.scss'],
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

    AreaExtensions.zoomAt(this.area, this.editor.getNodes());

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
    this.selected[type] = deviceData;
  }

  async addNode(node: NodeData) {
    const newNode = new Node(node.name);
    newNode.data = { imgUrl: node.imgUrl, type: node.type };

    node.outputs.forEach((output) => {
      newNode.addOutput(
        output.name,
        new ClassicPreset.Output(new Socket(output.name), undefined, false)
      );
    });
    node.inputs.forEach((input) => {
      newNode.addInput(
        input.name,
        new ClassicPreset.Input(new Socket(input.name), undefined, true)
      );
    });

    await this.editor.addNode(newNode);

    const nodes = this.editor.getNodes();
    const nodeLayer = nodes.filter((_node) => _node.data.type === node.type);

    if (nodeLayer.length < 2) {
      await this.area?.translate(newNode.id, { x: 0, y: node.layer });
      return;
    }

    if (nodeLayer.length % 2 === 0) {
      const right = nodeLayer.slice(0, nodeLayer.length / 2);
      const left = nodeLayer.slice(nodeLayer.length / 2);

      for (let i = 0; i < left.length; i++) {
        if (i + 1 === left.length) {
          await this.area?.translate(left[i].id, {
            x: -140,
            y: node.layer,
          });
        } else {
          await this.area?.translate(left[i].id, {
            x: -220 * (i + 2),
            y: node.layer,
          });
        }
      }
      for (let i = 0; i < right.length; i++) {
        if (i + 1 === 1) {
          await this.area?.translate(right[i].id, {
            x: 140,
            y: node.layer,
          });
        } else {
          await this.area?.translate(right[i].id, {
            x: 220 * (i + 1),
            y: node.layer,
          });
        }
      }
    } else {
      const centerNodeIdx = Math.round(nodeLayer.length / 2 - 1);
      const centerNode = nodeLayer[centerNodeIdx];
      await this.area?.translate(centerNode.id, { x: 0, y: node.layer });

      const left = nodeLayer.slice(0, centerNodeIdx);
      const right = nodeLayer.slice(centerNodeIdx + 1);

      for (let i = 0; i < left.length; i++) {
        await this.area?.translate(left[i].id, {
          x: -350 * (i + 1),
          y: node.layer,
        });
      }
      for (let i = 0; i < right.length; i++) {
        await this.area?.translate(right[i].id, {
          x: 350 * (i + 1),
          y: node.layer,
        });
      }
    }
  }

  async arrangeNodes() {
    const nodes = this.editor.getNodes();

    const connections = this.editor.getConnections();

    const fixedConnections = connections.filter((connection) => {
      const source = this.editor.getNode(connection.source);
      const target = this.editor.getNode(connection.target);

      return !(
        ['transformer', 'combinerbox'].includes(source.data.type) &&
        ['transformer', 'combinerbox'].includes(target.data.type)
      );
    });

    console.log('fixed connections: ', fixedConnections);

    await Promise.all(
      fixedConnections.map(async (connection) => {
        await this.editor.removeConnection(connection.id);
      })
    );

    const commonItems = nodes.filter(
      (node) =>
        node.data.type === 'transformer' || node.data.type === 'combinerbox'
    );

    console.log('common items: ', commonItems);

    await this.arrange.layout({
      options: {
        'org.eclipse.elk.direction': 'DOWN',
        'elk.layered.spacing.nodeNodeBetweenLayers': '150',
      },
      nodes: commonItems,
    });

    await Promise.all(
      fixedConnections.map(async (connection) => {
        await this.editor.addConnection(connection);
      })
    );

    // const strings = nodes.
  }
}
