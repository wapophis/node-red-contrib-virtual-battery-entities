import { LocalDateTime } from "@js-joda/core";
export declare class BatterySlot {
    readTimeStamp: LocalDateTime;
    private length;
    producedInWatsH: number;
    feededInWatsH: number;
    consumedInWatsH: number;
    constructor(msg: any);
    calcLenght(b: BatterySlot): void;
    get(): {
        readTimeStamp: LocalDateTime;
        length: number;
        producedInWatsH: number;
        feededInWatsH: number;
        consumedInWatsH: number;
    };
    getLength(): number;
}
