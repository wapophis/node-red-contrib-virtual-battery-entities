"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualBattery = exports.VirtualBatteryConfig = void 0;
const core_1 = require("@js-joda/core");
class VirtualBatteryConfig {
    constructor(priceCache) {
        //    this.wastePercent=wastePercent;
        this.pricesTablesCache = priceCache;
    }
    cacheIsReady() {
        return this.pricesTablesCache !== null;
    }
    setPricesTables(priceCache) {
        this.pricesTablesCache = priceCache;
    }
    getPricesTables() {
        if (this.pricesTablesCache === null) {
            throw new core_1.IllegalArgumentException(" I have no prices tables");
        }
        return this.pricesTablesCache;
    }
}
exports.VirtualBatteryConfig = VirtualBatteryConfig;
class VirtualBattery {
    constructor(virtualBatteryConfig) {
        this.balance = null;
        this.config = virtualBatteryConfig;
    }
    getBalance() {
        if (this.balance !== null) {
            return this.balance;
        }
        throw new Error("Null object at balance in virtualBattery");
    }
    setBalance(balance) {
        this.balance = balance;
    }
    addBalanceNetoHorario(bnetoH) {
        if (!bnetoH.isConsolidable()) {
            throw Error("Cannot add a non consolidable BalanceNetoHorario");
        }
        if (!this.config.cacheIsReady()) {
            throw Error("Cannot add BalanceNetoHorario, there is no prices available");
        }
        this.getBalance().setPrices(this.config.getPricesTables().searchInBuy(bnetoH.startTime), this.config.getPricesTables().searchInSell(bnetoH.startTime));
        // this.getBalance().setTerms(this.config.getPricesTables().searchInTerminoEnergia(bnetoH.startTime),
        // this.config.getPricesTables().searchInTerminoPotencia(bnetoH.startTime)
        // );
        this.getBalance().addBalaceNeto(bnetoH);
        // this._addPotenciaInTramo(bnetoH);
    }
    // private _addPotenciaInTramo(bnetoH:BalanceNetoHorario){
    //         /// TODO IMPLEMENT THIS
    //         let terminoAplicable:PriceIntervalItem|null=this.config.getTerminoPotencia(bnetoH.startTime);
    //         // if(terminoAplicable!==null)
    //         //     this.getBalance().addTerminoPotenciaIncrement(terminoAplicable.getPrice());
    // }
    increaseEnergyInWatsH(qty) {
    }
    reduceEnergyInWatsH(qty) {
    }
    /**
     *
     * @param qty cantidad
     * @param key motivo de decremento del balance Feeding|Peajes|etc
     */
    reduceCarga(qty, key) {
    }
    /**
     *
     * @param qty cantidad
     * @param key motivo del incremento del balance Feeding|bonus|etc
     */
    increaseCarga(qty, key) {
    }
}
exports.VirtualBattery = VirtualBattery;
;
