import { LocalDateTime } from "@js-joda/core";
import { BatterySlot } from "./BatterySlot";
export declare class BalanceNetoHorario {
    startTime: LocalDateTime;
    endTime: LocalDateTime;
    batterySlots: BatterySlot[];
    length: number | null;
    consolidable: boolean;
    constructor(msg: any);
    addBatterySlot(slot: BatterySlot): void;
    getProduced(): number;
    getFeeded(): number;
    getConsumed(): number;
    get(): {
        balanceNetoHorario: {
            feeded: number;
            consumed: number;
            produced: number;
            startAt: LocalDateTime;
            endAt: LocalDateTime;
            isConsolidable: boolean;
            batterySlots: BatterySlot[];
            length: number;
            startTime: LocalDateTime;
            endTime: LocalDateTime;
        };
    };
    getEndTime(): LocalDateTime;
    getStartTime(): LocalDateTime;
    isConsolidable(): boolean;
    of(input: any, type: string): void;
}
