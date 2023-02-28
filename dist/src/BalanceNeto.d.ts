import { Duration, LocalDateTime } from "@js-joda/core";
import { BatterySlot } from "./BatterySlot";
import { PricesTables } from "./PriceTables";
export type ResultSlot = {
    timeStamp: LocalDateTime;
    value: number;
};
export type BalanceNetoSerialized = {
    startTime: string;
    endTime: string;
    batterSlots: any[];
    length: number;
    consolidable: boolean;
    duration: number;
};
export declare class BalanceNeto {
    startTime: LocalDateTime;
    endTime: LocalDateTime;
    batterySlots: BatterySlot[];
    length: number | null;
    consolidable: boolean;
    duration: Duration;
    pricesCache: PricesTables;
    /**
     *
     * @param msg:any|undefined build the object from a serialized Object {
     *
     * }
     */
    constructor(msg: any);
    /**
     * Sets Duration of the bucket
     * @param durationInMinutes Duration in minutes of the Bucket
     * @returns the instance of this object
     */
    setDuration(durationInMinutes: number): BalanceNeto;
    /**
     * Add an slot to the bucket
     * @param slot containing the energy info to aggregate to the bucket
     * @returns the instance of this object
    */
    addBatterySlot(slot: BatterySlot): BalanceNeto;
    getProduced(): Number;
    getProducedInSlots(slotDuration: Duration): ResultSlot[];
    getFeeded(): Number;
    getFeededInSlots(slotDuration: Duration): ResultSlot[];
    getConsumed(): Number;
    getConsumedInSlots(slotDuration: Duration): ResultSlot[];
    get(): {
        balanceNeto: {
            feeded: Number;
            consumed: Number;
            produced: Number;
            startAt: LocalDateTime;
            endAt: LocalDateTime;
            isConsolidable: boolean;
            batterySlots: BatterySlot[];
            length: number;
            startTime: LocalDateTime;
            endTime: LocalDateTime;
            duration: number;
        };
    };
    getEndTime(): LocalDateTime;
    getStartTime(): LocalDateTime;
    isConsolidable(): boolean;
    setPricesTables(pricetables: PricesTables): void;
    _autoConsolidate(): void;
    of(input: BalanceNetoSerialized): void;
}
