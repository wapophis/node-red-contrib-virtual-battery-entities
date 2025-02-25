import { IllegalArgumentException, LocalDateTime, ZoneId, ZoneOffset } from "@js-joda/core";
import { Interval } from "@js-joda/extra";
import { BalanceNetoHorario } from "./BalanceNetoHorario";
import { BatteryBalanceCounter } from "./BatteryBalance";
import { PriceIntervalItem } from "./PriceIntervalItem";
import { PricesTables } from "./PriceTables";
import { BalanceNeto } from "./BalanceNeto";

/**
 * 
 * @deprecated @since 1.0.11-SNAPSHOT
 */
export class VirtualBatteryConfig{
    
    private pricesTablesCache:PricesTables|null;

    constructor(priceCache:PricesTables|null){
        this.pricesTablesCache=priceCache;
    }

    cacheIsReady(){
        return this.pricesTablesCache!==null;
    }

    setPricesTables(priceCache:PricesTables){
        this.pricesTablesCache=priceCache;
    }

    getPricesTables():PricesTables{
        if(this.pricesTablesCache===null){
            throw new IllegalArgumentException(" I have no prices tables");
        }
        return this.pricesTablesCache;
    }
    
}

/**
 * @since 1.0.12-SNAPSHOT
 */
export class VirtualBatteryPricesCache{
    private pricesTablesCache:PricesTables|null;


    constructor(priceCache:PricesTables|null){
        this.pricesTablesCache=priceCache;
    }

    cacheIsReady(){
        return this.pricesTablesCache!==null;
    }

    setPricesTables(priceCache:PricesTables){
        this.pricesTablesCache=priceCache;
    }

    getPricesTables():PricesTables{
        if(this.pricesTablesCache===null){
            throw new IllegalArgumentException(" I have no prices tables");
        }
        return this.pricesTablesCache;
    }

}

export class VirtualBattery<T extends BatteryBalanceCounter>{
    config:VirtualBatteryConfig; // @deprecated SINCE 1.0.11-SNAPSHOT//
    pricesCache:VirtualBatteryPricesCache;

    private balance:T|null=null;

    constructor(virtualBatteryPricesCache:VirtualBatteryConfig){
        this.pricesCache=new VirtualBatteryPricesCache(virtualBatteryPricesCache.getPricesTables());
        this.config=virtualBatteryPricesCache;
    }

    getBalance():T{
        if(this.balance!==null){
            return this.balance;
        }
        throw new Error("Null object at balance in virtualBattery");
    }

    setBalance(balance:T){
        this.balance=balance;
    }

    /**
     * @since 1.0.12-SNAPSHOT
     * @param balanceNeto 
     * @returns 
     */
    setBalanceNeto(balanceNeto:BalanceNeto):VirtualBattery<T>{
        this._setBalancePricesForDateTime(balanceNeto.getStartTime());
        this.balance?.setBalanceNeto(balanceNeto);
        return this;
    }

    _setBalancePricesForDateTime(dateTime:LocalDateTime){
        this.getBalance().setPrices(this.pricesCache.getPricesTables().searchInBuy(dateTime),
        this.pricesCache.getPricesTables().searchInSell(dateTime));
    }


    /**
     * @deprecated @since 1.0.11-SNAPSHOT
     * @param bnetoH 
     */
    addBalanceNetoHorario(bnetoH:BalanceNetoHorario){
        if(!bnetoH.isConsolidable()){
            throw Error("Cannot add a non consolidable BalanceNetoHorario");
        }
        if(!this.config.cacheIsReady()){
            throw Error ("Cannot add BalanceNetoHorario, there is no prices available");
        }

        this.getBalance().setPrices(this.config.getPricesTables().searchInBuy(bnetoH.startTime),
        this.config.getPricesTables().searchInSell(bnetoH.startTime));

        this.getBalance().addBalaceNeto(bnetoH);

    }






    increaseEnergyInWatsH(qty:number){

    }

    reduceEnergyInWatsH(qty:number){

    }

    /**
     * 
     * @param qty cantidad
     * @param key motivo de decremento del balance Feeding|Peajes|etc
     */
    reduceCarga(qty:number,key:String){

    }

    /**
     * 
     * @param qty cantidad
     * @param key motivo del incremento del balance Feeding|bonus|etc
     */
    increaseCarga(qty:number,key:String){

    }
   
}; 