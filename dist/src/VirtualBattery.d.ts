import { BalanceNetoHorario } from "./BalanceNetoHorario";
import { BatteryBalanceCounter } from "./BatteryBalance";
import { PricesTables } from "./PriceTables";
export declare class VirtualBatteryConfig {
    private pricesTablesCache;
    constructor(priceCache: PricesTables | null);
    cacheIsReady(): boolean;
    setPricesTables(priceCache: PricesTables): void;
    getPricesTables(): PricesTables;
}
export declare class VirtualBattery<T extends BatteryBalanceCounter> {
    config: VirtualBatteryConfig;
    private balance;
    constructor(virtualBatteryConfig: VirtualBatteryConfig);
    getBalance(): T;
    setBalance(balance: T): void;
    addBalanceNetoHorario(bnetoH: BalanceNetoHorario): void;
    increaseEnergyInWatsH(qty: number): void;
    reduceEnergyInWatsH(qty: number): void;
    /**
     *
     * @param qty cantidad
     * @param key motivo de decremento del balance Feeding|Peajes|etc
     */
    reduceCarga(qty: number, key: String): void;
    /**
     *
     * @param qty cantidad
     * @param key motivo del incremento del balance Feeding|bonus|etc
     */
    increaseCarga(qty: number, key: String): void;
}
