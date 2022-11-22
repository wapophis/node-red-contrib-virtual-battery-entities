import { LocalDateTime } from "@js-joda/core";
import { Interval } from "@js-joda/extra";
export declare class PriceIntervalItem {
    private interval;
    private price;
    getInterval(): Interval;
    getPrice(): number;
    setInterval(interval: Interval): PriceIntervalItem;
    setPrice(price: number): PriceIntervalItem;
    get(): any;
    static searchPriceInIntervalMap(map: Map<Interval, PriceIntervalItem>, date: LocalDateTime): PriceIntervalItem | null;
}
