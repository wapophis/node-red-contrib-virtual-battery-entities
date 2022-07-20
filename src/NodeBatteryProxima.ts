import { NodeBattery } from "./NodeBattery";
import { VirtualBattery, VirtualBatteryConfig } from "./VirtualBattery";

export class NodeBatteryProxima extends NodeBattery{
   



    constructor(node:any,nodeConfig:any){
      super(node,nodeConfig);
    }

    init(): VirtualBattery {
        throw new Error("Method not implemented.");
    }
    onClose(): boolean {
        throw new Error("Method not implemented.");
    }
    onInput(msg:any,send:any,done:any): VirtualBattery {
        return super.onInput(msg,send,done);
    }
    validateConfig(): boolean {
        throw new Error("Method not implemented.");
    }

    processBalanceNetoHorario(): void {
        throw new Error("Method not implemented.");
    }

}
