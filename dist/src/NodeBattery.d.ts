import { BalanceNetoHorario } from "./BalanceNetoHorario";
import { BatteryBalanceCounter } from "./BatteryBalance";
import { VirtualBattery, VirtualBatteryConfig } from "./VirtualBattery";
export declare abstract class NodeBattery<T extends BatteryBalanceCounter> {
    node: any;
    nodeConfig: any;
    config: VirtualBatteryConfig;
    battery: VirtualBattery<T>;
    nodeContext: any;
    pendingArray: Array<any>;
    constructor(node: any, nodeConfig: any);
    setConfig(config: VirtualBatteryConfig): void;
    abstract init(): VirtualBattery<T>;
    abstract onClose(): boolean;
    onInput(msg: any, send: any, done: any): VirtualBattery<T>;
    abstract validateConfig(): boolean;
    abstract processBalanceNetoHorario(bHorario: BalanceNetoHorario): void;
}
