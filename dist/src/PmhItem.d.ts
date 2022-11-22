import { LocalDateTime } from "@js-joda/core";
import { Interval } from "@js-joda/extra";
import '@js-joda/timezone';
export declare class PmhItemSerialized {
    value: number;
    datetime: String;
    datetime_utc: String;
    tz_time: String;
    geo_ids: Array<number>;
}
export declare class PmhItem {
    value: number;
    datetime: LocalDateTime;
    datetime_utc: String;
    tz_time: String;
    interval: Interval | null;
    constructor();
    of(pmhItem: PmhItemSerialized): void;
    getInterval(): Interval;
    getPrice(): number;
    static of(pmh: any): PmhItem;
}
