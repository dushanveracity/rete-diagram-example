import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReteModule } from "rete-angular-plugin/16";
import { ReteDiagramComponent } from "./rete-diagram.component";
import { VerticalNodeComponent } from './components/vertical-node/vertical-node.component';
import { FormsModule } from "@angular/forms";
import { VerticalSocketComponent } from './components/vertical-socket/vertical-socket.component';
import { VerticalConnectionComponent } from './components/vertical-connection/vertical-connection.component';


@NgModule({
  declarations: [ReteDiagramComponent, VerticalNodeComponent, VerticalSocketComponent, VerticalConnectionComponent],
  imports: [CommonModule, ReteModule, FormsModule],
  exports: [ReteDiagramComponent]
})
export class ReteDiagramModule {}
