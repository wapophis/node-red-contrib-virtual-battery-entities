import { Duration, LocalDateTime } from "@js-joda/core";
import { BatterySlot } from "./BatterySlot";
export declare class BalanceNeto {
    startTime: LocalDateTime;
    endTime: LocalDateTime;
    batterySlots: BatterySlot[];
    length: number | null;
    consolidable: boolean;
    duration: Duration;
    constructor(msg: any);
}
