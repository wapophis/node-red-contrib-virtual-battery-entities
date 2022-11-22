import { Interval } from "@js-joda/extra";
export declare class PvpcItemSerialized {
    dia: string;
    hora: string;
    PCB: string;
    TEUPCB: string;
    getStartHour(): number;
    getEndHour(): number;
    getPrice(): number;
    getTerminoFijo(): number;
    static of(payload: any): PvpcItemSerialized;
}
export declare class PvpcItem {
    serItem: PvpcItemSerialized;
    private interval;
    private price;
    private peaje;
    constructor(fromEsios: PvpcItemSerialized);
    getInterval(): Interval;
    getPrice(): number;
    getPeaje(): number;
    static of(pvpcItem: any): PvpcItem;
    get(): any;
}
