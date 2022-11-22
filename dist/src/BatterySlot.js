"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatterySlot = void 0;
const core_1 = require("@js-joda/core");
class BatterySlot {
    constructor(msg) {
        let dateTimeformater = core_1.DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm:ss');
        //this.readTimeStamp=LocalDateTime.parse(msg.payload.uploadTime,dateTimeformater).plusHours(1);
        this.readTimeStamp = core_1.LocalDateTime.parse(msg.readTimeStamp.toString());
        //this.length=LocalDateTime.now().until(readTimeStamp,ChronoUnit.SECONDS)*1000;
        this.length = msg.length;
        this.producedInWatsH = msg.producedInWatsH;
        this.feededInWatsH = msg.feededInWatsH;
        this.consumedInWatsH = msg.consumedInWatsH;
    }
    calcLenght(b) {
        this.length = this.readTimeStamp.until(b.readTimeStamp, core_1.ChronoUnit.SECONDS) * 1000;
    }
    get() {
        return {
            readTimeStamp: this.readTimeStamp,
            length: this.getLength(),
            producedInWatsH: this.producedInWatsH,
            feededInWatsH: this.feededInWatsH,
            consumedInWatsH: this.consumedInWatsH
        };
    }
    getLength() {
        if (this.length === null) {
            return -1;
        }
        else {
            return this.length;
        }
    }
}
exports.BatterySlot = BatterySlot;
