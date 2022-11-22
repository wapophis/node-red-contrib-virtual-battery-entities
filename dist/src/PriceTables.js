"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricesTablesMapper = exports.PricesTables = void 0;
const extra_1 = require("@js-joda/extra");
const PmhItem_1 = require("./PmhItem");
const PvpcItem_1 = require("./PvpcItem");
const PriceIntervalItem_1 = require("./PriceIntervalItem");
class PricesTables {
    constructor() {
        this.pricesToSell = new Map();
        this.pricesToBuy = new Map();
        this.energyTerm = new Map();
        this.potenciaTerm = new Map();
    }
    addPriceToBuy(pvpcItem) {
        this.pricesToBuy.set(pvpcItem.getInterval(), pvpcItem);
    }
    addPricetoSell(pmhItem) {
        this.pricesToSell.set(pmhItem.getInterval(), pmhItem);
    }
    addEnergyTerm(teuItem) {
        this.energyTerm.set(teuItem.getInterval(), teuItem);
    }
    searchInBuy(date) {
        let priceItem = PriceIntervalItem_1.PriceIntervalItem.searchPriceInIntervalMap(this.pricesToBuy, date);
        if (priceItem === null) {
            throw new Error("Sell prices error by null reference");
        }
        return priceItem;
    }
    setEnergyTerm(energyTerms) {
        this.energyTerm = energyTerms;
        return this;
    }
    setSellPrices(pricesToSell) {
        this.pricesToSell = pricesToSell;
        return this;
    }
    setBuyPrices(pricesToBuy) {
        this.pricesToBuy = pricesToBuy;
        return this;
    }
    setPotenciaTerm(potenciaTerms) {
        this.energyTerm = potenciaTerms;
    }
    searchInSell(date) {
        return PriceIntervalItem_1.PriceIntervalItem.searchPriceInIntervalMap(this.pricesToSell, date);
    }
    searchInTerminoEnergia(date) {
        return PriceIntervalItem_1.PriceIntervalItem.searchPriceInIntervalMap(this.energyTerm, date);
    }
    searchInTerminoPotencia(date) {
        return PriceIntervalItem_1.PriceIntervalItem.searchPriceInIntervalMap(this.potenciaTerm, date);
    }
    reset() {
        this.pricesToBuy.clear();
        this.pricesToSell.clear();
        this.energyTerm.clear();
    }
    get() {
        let oVal = {};
        let p1Array = [];
        let p2Array = [];
        let p3Array = [];
        this.pricesToSell.forEach((item, key) => {
            p1Array.push({ key: key.toString(), value: item.get() });
        });
        this.pricesToBuy.forEach((item, key) => {
            p2Array.push({ key: key.toString(), value: item.get() });
        });
        this.energyTerm.forEach((item, key) => {
            p3Array.push({ key: key.toString(), value: item.get() });
        });
        return {
            pricesToSell: p1Array,
            pricesToBuy: p2Array,
            energyTerm: p3Array
        };
    }
    set(serialized) {
        let p1Map = new Map();
        let p2Map = new Map();
        let p3Map = new Map();
        if (serialized["pricesToSell"] !== undefined) {
            serialized.pricesToSell.forEach((item) => {
                let interval0 = extra_1.Interval.parse(item.key);
                let interval1 = extra_1.Interval.parse(item.value.interval);
                let priceItem = new PriceIntervalItem_1.PriceIntervalItem();
                priceItem.setInterval(interval1);
                priceItem.setPrice(item.value.price);
                p1Map.set(interval0, priceItem);
            });
        }
        if (serialized["pricesToBuy"] !== undefined) {
            serialized.pricesToBuy.forEach((item) => {
                let interval0 = extra_1.Interval.parse(item.key);
                let interval1 = extra_1.Interval.parse(item.value.interval);
                let priceItem = new PriceIntervalItem_1.PriceIntervalItem();
                priceItem.setInterval(interval1);
                priceItem.setPrice(item.value.price);
                p2Map.set(interval0, priceItem);
            });
        }
        if (serialized["energyTerm"] !== undefined) {
            serialized.energyTerm.forEach((item) => {
                let interval0 = extra_1.Interval.parse(item.key);
                let interval1 = extra_1.Interval.parse(item.value.interval);
                let priceItem = new PriceIntervalItem_1.PriceIntervalItem();
                priceItem.setInterval(interval1);
                priceItem.setPrice(item.value.price);
                p3Map.set(interval0, priceItem);
            });
        }
        this.setSellPrices(p1Map);
        this.setBuyPrices(p2Map);
        this.setEnergyTerm(p3Map);
    }
}
exports.PricesTables = PricesTables;
class PricesTablesMapper {
    static unMarshallPvpC(pricesListObject) {
        let oVal = new Map();
        Object.keys(pricesListObject).forEach((key) => {
            try {
                let item = PvpcItem_1.PvpcItem.of(pricesListObject[key]);
                oVal.set(item.getInterval(), item);
            }
            catch (e) {
                console.log(e);
                oVal.set(pricesListObject[key].getInterval(), pricesListObject[key]);
            }
            ;
        });
        return oVal;
    }
    static unMarshallPmh(pricesListObject) {
        let oVal = new Map();
        Object.keys(pricesListObject).forEach((key) => {
            try {
                let item = PmhItem_1.PmhItem.of(pricesListObject[key]);
                oVal.set(item.getInterval(), item);
            }
            catch (e) {
                console.log(e);
                oVal.set(pricesListObject[key].getInterval(), pricesListObject[key]);
            }
            ;
        });
        return oVal;
    }
}
exports.PricesTablesMapper = PricesTablesMapper;
