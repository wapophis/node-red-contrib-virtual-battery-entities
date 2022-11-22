"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PvpcItem = exports.PvpcItemSerialized = void 0;
const core_1 = require("@js-joda/core");
const extra_1 = require("@js-joda/extra");
/*
@Deprecated
*/
class PvpcItemSerialized {
    constructor() {
        this.dia = "";
        this.hora = "";
        this.PCB = "";
        this.TEUPCB = "";
    }
    getStartHour() {
        return Number.parseInt(this.hora.split("-")[0]);
    }
    getEndHour() {
        return this.getStartHour() + 1;
    }
    getPrice() {
        return parseFloat(this.PCB.replace(/,/g, '.'));
    }
    getTerminoFijo() {
        return parseFloat(this.TEUPCB.replace(/,/g, '.'));
    }
    static of(payload) {
        let oval = new PvpcItemSerialized();
        oval.dia = payload.Dia;
        oval.hora = payload.Hora;
        oval.PCB = payload.PCB;
        oval.TEUPCB = payload.TEUPCB;
        return oval;
    }
}
exports.PvpcItemSerialized = PvpcItemSerialized;
/*
@Deprecated
*/
class PvpcItem {
    constructor(fromEsios) {
        this.price = null;
        this.peaje = null;
        {
            this.serItem = fromEsios;
            ///this.timeInterval=Interval.of(Instant.)
            this.interval = this.getInterval();
        }
    }
    getInterval() {
        if (this.interval === null || this.interval === undefined) {
            let startHour = this.serItem.getStartHour();
            let startDateTime = core_1.LocalDate.parse(this.serItem.dia, core_1.DateTimeFormatter.ofPattern("dd/MM/yyyy")).atTime(startHour, 0, 0, 0);
            let endDateTime = startDateTime.plusHours(1);
            let startInstant = startDateTime.atZone(core_1.ZoneId.of("Europe/Madrid")).toInstant();
            let endInstant = endDateTime.atZone(core_1.ZoneId.of("Europe/Madrid")).toInstant();
            this.interval = extra_1.Interval.of(startInstant, endInstant);
        }
        return this.interval;
    }
    getPrice() {
        if (this.price === null) {
            this.price = this.serItem.getPrice();
        }
        return this.price;
        ;
    }
    getPeaje() {
        if (this.peaje === null) {
            this.peaje = this.serItem.getTerminoFijo();
        }
        return this.peaje;
    }
    static of(pvpcItem) {
        let oVal = new PvpcItem(new PvpcItemSerialized());
        if (pvpcItem["interval"] !== undefined) {
            oVal.interval = extra_1.Interval.parse(pvpcItem.interval.toString());
        }
        if (pvpcItem["price"] !== undefined) {
            oVal.price = pvpcItem.price;
        }
        else {
            if (pvpcItem["PCB"] !== undefined) {
                oVal.price = parseFloat(pvpcItem.PCB.toString().replace(/,/g, '.'));
            }
        }
        if (pvpcItem["peaje"] !== undefined) {
            oVal.peaje = pvpcItem.peaje;
        }
        else {
            if (pvpcItem["TEUPCB"] !== undefined) {
                oVal.peaje = parseFloat(pvpcItem.TEUPCB.toString().replace(/,/g, '.'));
            }
        }
        return oVal;
    }
    get() {
        return {
            interval: this.getInterval().toString,
            price: this.getPrice(),
            peaje: this.getPeaje()
        };
    }
}
exports.PvpcItem = PvpcItem;
