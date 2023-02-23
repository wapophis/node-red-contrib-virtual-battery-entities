"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceNeto = void 0;
const core_1 = require("@js-joda/core");
const BatterySlot_1 = require("./BatterySlot");
class BalanceNeto {
    constructor(msg) {
        if (msg === undefined) {
            this.duration = core_1.Duration.ofMinutes(1);
            let numberOfSlots = Math.floor(core_1.LocalDateTime.now().get(core_1.ChronoField.MINUTE_OF_DAY) / this.duration.toMinutes());
            this.startTime = core_1.LocalDateTime.now().withMinute(0).withSecond(0).withNano(0).minusMinutes(numberOfSlots * this.duration.toMinutes());
            this.endTime = this.startTime.plusMinutes(this.duration.toMinutes());
            this.batterySlots = new Array();
            this.length = null;
            this.consolidable = false;
        }
        else {
            this.duration = core_1.Duration.ofMinutes(msg.duration.toString());
            this.startTime = core_1.LocalDateTime.parse(msg.startTime.toString());
            this.endTime = core_1.LocalDateTime.parse(msg.endTime.toString());
            this.batterySlots = [];
            try {
                msg.batterySlots.forEach((item) => {
                    this.batterySlots.push(new BatterySlot_1.BatterySlot(item));
                });
            }
            catch (e) {
                console.log(e);
            }
            this.length = msg.length;
            this.consolidable = msg.isConsolidable;
        }
    }
}
exports.BalanceNeto = BalanceNeto;
