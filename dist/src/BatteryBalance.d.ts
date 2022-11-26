import { BalanceNetoHorario } from "./BalanceNetoHorario";
import { PriceIntervalItem } from "./PriceIntervalItem";
export declare class BatteryBalanceCounter {
    energyImported: number;
    energyFeeded: number;
    batteryLoad: number;
    batteryLoadInc: number;
    buyPrice: PriceIntervalItem | null;
    sellPrice: PriceIntervalItem | null;
    constructor(imported: number, feeded: number, load: number);
    /**
     *
     * @param balanceNeto TODO IMPLEMENTAR TIPO
     */
    addBalaceNeto(balanceNeto: BalanceNetoHorario): void;
    setPrices(buyPrice: PriceIntervalItem, sellPrice: PriceIntervalItem | null): void;
    get(): any;
}
