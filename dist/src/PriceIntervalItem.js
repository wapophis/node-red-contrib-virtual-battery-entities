"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceIntervalItem = void 0;
const core_1 = require("@js-joda/core");
const extra_1 = require("@js-joda/extra");
class PriceIntervalItem {
    constructor() {
        this.interval = null;
        this.price = null;
    }
    getInterval() {
        if (this.interval === null) {
            throw new Error("Interval is null");
        }
        return this.interval;
    }
    getPrice() {
        if (this.price === null) {
            throw new Error("Price is null");
        }
        return this.price;
    }
    setInterval(interval) {
        this.interval = interval;
        return this;
    }
    setPrice(price) {
        this.price = price;
        return this;
    }
    get() {
        return {
            interval: this.getInterval().toString(),
            price: this.getPrice()
        };
    }
    static searchPriceInIntervalMap(map, date) {
        let oVal = new PriceIntervalItem();
        map.forEach((item, key, map) => {
            if (extra_1.Interval.of(core_1.Instant.parse(item.getInterval().start().toString()), core_1.Instant.parse(item.getInterval().end().toString()))
                .contains(core_1.Instant.parse(date.atZone(core_1.ZoneId.of("Europe/Madrid")).toInstant().toString()))) {
                oVal = item;
            }
        });
        return oVal;
    }
}
exports.PriceIntervalItem = PriceIntervalItem;
