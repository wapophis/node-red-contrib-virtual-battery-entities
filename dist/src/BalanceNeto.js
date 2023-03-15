"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceNeto = void 0;
const core_1 = require("@js-joda/core");
const BatterySlot_1 = require("./BatterySlot");
const PriceTables_1 = require("./PriceTables");
class BalanceNeto {
    /**
     *
     * @param msg:any|undefined build the object from a serialized Object {
     *
     * }
     */
    constructor(msg) {
        this.pricesCache = new PriceTables_1.PricesTables();
        if (msg === undefined) {
            this.duration = core_1.Duration.ofMinutes(1);
            this.startTime = core_1.LocalDateTime.now();
            this.endTime = core_1.LocalDateTime.now();
            //this.startTime=LocalDateTime.now().withMinute(0).withSecond(0).withNano(0);
            this.setDuration(this.duration.toMinutes());
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
    /**
     * Sets Duration of the bucket
     * @param durationInMinutes Duration in minutes of the Bucket
     * @returns the instance of this object
     */
    setDuration(durationInMinutes) {
        this.duration = core_1.Duration.ofMinutes(durationInMinutes);
        let numberOfSlots = Math.floor(core_1.LocalDateTime.now().get(core_1.ChronoField.MINUTE_OF_DAY) / durationInMinutes);
        this.startTime = core_1.LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0).plusMinutes(numberOfSlots * durationInMinutes);
        this.endTime = this.startTime.plusMinutes(durationInMinutes);
        return this;
    }
    /**
     * Add an slot to the bucket
     * @param slot containing the energy info to aggregate to the bucket
     * @returns the instance of this object
    */
    addBatterySlot(slot) {
        var slotStart = core_1.LocalDateTime.parse(slot.readTimeStamp.toString());
        if (slotStart.isBefore(this.startTime)) {
            throw "Slot time is before than this slot start time";
        }
        if (slot.getLength() < 0) {
            throw "Discarded slot, because no lenght defined";
        }
        if (slot.getLength() > this.duration.toMillis()) {
            throw "Cannot add slots with duration " + slot.getLength() + "ms greater than the net balance duration " + this.duration.toMillis() + "ms";
        }
        if (this.isConsolidable() === true) {
            throw "Cannot add slots the net balance is consolidable.";
        }
        if (slot.consumedInWatsH === undefined || isNaN(slot.consumedInWatsH)) {
            throw "Error in slot data, consumedInWatsH undefined";
        }
        if (slot.feededInWatsH === undefined || isNaN(slot.feededInWatsH)) {
            throw "Error in slot data, feededInWatsH undefined";
        }
        if (slot.producedInWatsH === undefined || isNaN(slot.producedInWatsH)) {
            throw "Error in slot data, producedInWatsH undefined";
        }
        this.batterySlots.push(slot);
        this._autoConsolidate();
        return this;
    }
    getProduced() {
        let count = 0;
        this.batterySlots.forEach(function (item) {
            let slotsInHour = (60 * 60 * 1000) / item.getLength();
            count += item.producedInWatsH / slotsInHour;
            if (isNaN(count)) {
                console.log(item);
            }
        });
        return count;
    }
    getProducedInSlots(slotDuration) {
        let slotStartOffset = this.startTime;
        let slotEndOffset = this.startTime.plusMinutes(slotDuration.toMinutes());
        let slotsInHour = (60 * 60 * 1000) / this.batterySlots[0].getLength();
        let oVal = new Array();
        while (slotEndOffset.compareTo(this.endTime) <= 0) {
            let count = 0;
            this.batterySlots.filter((batSlot) => {
                return batSlot.readTimeStamp.compareTo(slotEndOffset) < 0 && batSlot.readTimeStamp.compareTo(slotStartOffset) >= 0;
            }).forEach((item) => {
                //               console.log({slotStartOffset:slotStartOffset.toString(),slotEndOffset:slotEndOffset.toString(),item:item.readTimeStamp.toString()});
                count += item.producedInWatsH / slotsInHour;
            });
            oVal.push({ timeStamp: slotStartOffset, value: count });
            slotStartOffset = slotStartOffset.plusMinutes(slotDuration.toMinutes());
            slotEndOffset = slotEndOffset = slotStartOffset.plusMinutes(slotDuration.toMinutes());
        }
        ;
        return oVal;
    }
    getProducedInSlotsMinutes(slotDuration) {
        return this.getProducedInSlots(core_1.Duration.ofMinutes(slotDuration));
    }
    getFeeded() {
        let count = 0;
        this.batterySlots.forEach(function (item) {
            let slotsInHour = (60 * 60 * 1000) / item.getLength();
            count += item.feededInWatsH / slotsInHour;
            if (isNaN(count)) {
                console.log(item);
                return 0;
            }
        });
        return count;
    }
    getFeededInSlots(slotDuration) {
        let slotStartOffset = this.startTime;
        let slotEndOffset = this.startTime.plusMinutes(slotDuration.toMinutes());
        let slotsInHour = (60 * 60 * 1000) / this.batterySlots[0].getLength();
        let oVal = new Array();
        while (slotEndOffset.compareTo(this.endTime) <= 0) {
            let count = 0;
            this.batterySlots.filter((batSlot) => {
                return batSlot.readTimeStamp.compareTo(slotEndOffset) < 0 && batSlot.readTimeStamp.compareTo(slotStartOffset) >= 0;
            }).forEach((item) => {
                //               console.log({slotStartOffset:slotStartOffset.toString(),slotEndOffset:slotEndOffset.toString(),item:item.readTimeStamp.toString()});
                count += item.feededInWatsH / slotsInHour;
            });
            oVal.push({ timeStamp: slotStartOffset, value: count });
            slotStartOffset = slotStartOffset.plusMinutes(slotDuration.toMinutes());
            slotEndOffset = slotEndOffset = slotStartOffset.plusMinutes(slotDuration.toMinutes());
        }
        ;
        return oVal;
    }
    getFeededInSlotsMinutes(slotDuration) {
        return this.getFeededInSlots(core_1.Duration.ofMinutes(slotDuration));
    }
    getConsumed() {
        let count = 0;
        this.batterySlots.forEach(function (item) {
            let slotsInHour = (60 * 60 * 1000) / item.getLength();
            count += item.consumedInWatsH / slotsInHour;
            if (isNaN(count)) {
                console.log(item);
            }
        });
        return count;
    }
    getConsumedInSlots(slotDuration) {
        let slotStartOffset = this.startTime;
        let slotEndOffset = this.startTime.plusMinutes(slotDuration.toMinutes());
        let slotsInHour = (60 * 60 * 1000) / this.batterySlots[0].getLength();
        let oVal = new Array();
        while (slotEndOffset.compareTo(this.endTime) <= 0) {
            let count = 0;
            this.batterySlots.filter((batSlot) => {
                return batSlot.readTimeStamp.compareTo(slotEndOffset) < 0 && batSlot.readTimeStamp.compareTo(slotStartOffset) >= 0;
            }).forEach((item) => {
                //console.log({slotStartOffset:slotStartOffset.toString(),slotEndOffset:slotEndOffset.toString(),item:item.readTimeStamp.toString()});
                count += item.consumedInWatsH / slotsInHour;
            });
            oVal.push({ timeStamp: slotStartOffset, value: count });
            slotStartOffset = slotStartOffset.plusMinutes(slotDuration.toMinutes());
            slotEndOffset = slotEndOffset = slotStartOffset.plusMinutes(slotDuration.toMinutes());
        }
        ;
        return oVal;
    }
    getConsumedInSlotsMinutes(slotDuration) {
        return this.getConsumedInSlots(core_1.Duration.ofMinutes(slotDuration));
    }
    get() {
        return {
            balanceNeto: {
                feeded: this.getFeeded(),
                consumed: this.getConsumed(),
                produced: this.getProduced(),
                startAt: this.startTime,
                endAt: this.endTime,
                isConsolidable: this.isConsolidable(),
                batterySlots: this.batterySlots,
                length: this.batterySlots.length,
                startTime: this.startTime,
                endTime: this.endTime,
                duration: this.duration.toMinutes()
            }
        };
    }
    getEndTime() {
        return core_1.LocalDateTime.parse(this.endTime.toString());
    }
    getStartTime() {
        return core_1.LocalDateTime.parse(this.startTime.toString());
    }
    isConsolidable() {
        return this.consolidable;
    }
    setPricesTables(pricetables) {
        this.pricesCache = pricetables;
    }
    _autoConsolidate() {
        /*let slotsTotalDuration=Duration.ofMinutes(0);
        for(let i=0,j=i+1;i<this.batterySlots.length&&j<this.batterySlots.length;i++,j=i+1){
                this.batterySlots[i].calcLenght(this.batterySlots[j]);
                slotsTotalDuration=slotsTotalDuration.plusMillis(this.batterySlots[i].getLength());
                console.log(slotsTotalDuration.toMillis());
        }
        if(slotsTotalDuration.compareTo(this.duration)>0){
            this.consolidable=true;
        }*/
        this.consolidable = this.endTime.isBefore(this.batterySlots[this.batterySlots.length - 1].readTimeStamp);
    }
    getCurrentSubBucketIndex(durationInMinutes) {
        return Math.floor((core_1.LocalDateTime.now().get(core_1.ChronoField.MINUTE_OF_DAY) - this.startTime.get(core_1.ChronoField.MINUTE_OF_DAY)) / (durationInMinutes));
    }
    getSerializedSubBucket(index, duration) {
        var _a, _b, _c, _d;
        let oVal = {
            consumed: (_a = this.getConsumedInSlotsMinutes(duration)[index]) === null || _a === void 0 ? void 0 : _a.value,
            produced: (_b = this.getProducedInSlotsMinutes(duration)[index]) === null || _b === void 0 ? void 0 : _b.value,
            feeded: (_c = this.getFeededInSlotsMinutes(duration)[index]) === null || _c === void 0 ? void 0 : _c.value,
            duration: duration,
            timeStamp: (_d = this.getConsumedInSlotsMinutes(duration)[index]) === null || _d === void 0 ? void 0 : _d.timeStamp.toString()
        };
        return oVal;
    }
    of(input) {
        this.startTime = core_1.LocalDateTime.parse(input.startAt);
        this.endTime = core_1.LocalDateTime.parse(input.endAt);
        this.duration = core_1.Duration.ofMinutes(input.duration);
        input.batterySlots.forEach((batSlot) => {
            this.addBatterySlot(new BatterySlot_1.BatterySlot(batSlot));
        });
        this.length = this.batterySlots.length;
    }
}
exports.BalanceNeto = BalanceNeto;
