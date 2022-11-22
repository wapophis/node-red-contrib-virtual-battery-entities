"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PmhItem = exports.PmhItemSerialized = void 0;
const core_1 = require("@js-joda/core");
const extra_1 = require("@js-joda/extra");
require("@js-joda/timezone");
class PmhItemSerialized {
    constructor() {
        this.value = 0.0;
        this.datetime = ".";
        this.datetime_utc = "";
        this.tz_time = "";
        this.geo_ids = [];
    }
}
exports.PmhItemSerialized = PmhItemSerialized;
class PmhItem {
    constructor() {
        this.value = 0;
        this.datetime = core_1.LocalDateTime.now();
        this.datetime_utc = "";
        this.tz_time = "";
        this.interval = null;
    }
    of(pmhItem) {
        let parcheTime = pmhItem.datetime.split(".")[0] + "+" + pmhItem.datetime.split(".")[1].split("+")[1];
        this.value = pmhItem.value;
        //this.datetime=LocalDateTime.parse(pmhItem.datetime,DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'.'SZ"));
        this.datetime = core_1.LocalDateTime.parse(parcheTime, core_1.DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        this.datetime_utc = pmhItem.datetime_utc;
        this.tz_time = pmhItem.tz_time;
        this.interval = this.getInterval();
    }
    getInterval() {
        if (this.interval === null) {
            let endDateTime = this.datetime.plusHours(1);
            let startInstant = this.datetime.atZone(core_1.ZoneId.of("Europe/Madrid")).toInstant();
            let endInstant = endDateTime.atZone(core_1.ZoneId.of("Europe/Madrid")).toInstant();
            this.interval = extra_1.Interval.of(startInstant, endInstant);
        }
        return this.interval;
    }
    getPrice() {
        return this.value;
    }
    static of(pmh) {
        let oVal = new PmhItem();
        if (pmh["value"] !== undefined) {
            oVal.value = pmh.value;
        }
        if (pmh["datetime"] !== undefined) {
            oVal.datetime = core_1.LocalDateTime.parse(pmh.datetime.toString());
        }
        if (pmh["datetime_utc"] !== undefined) {
            oVal.datetime_utc = pmh.datetime_utc.toString();
        }
        if (pmh["tz_time"] !== undefined) {
            oVal.datetime_utc = pmh.tz_time.toString();
        }
        if (pmh["interval"] !== undefined) {
            oVal.interval = extra_1.Interval.parse(pmh.interval.toString());
            oVal.datetime = core_1.LocalDateTime.ofInstant(oVal.getInterval().start());
        }
        return oVal;
    }
}
exports.PmhItem = PmhItem;
;
