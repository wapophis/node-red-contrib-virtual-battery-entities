import { IllegalArgumentException } from "@js-joda/core";
import { BalanceNetoHorario } from "./BalanceNetoHorario";
import { BatteryBalanceCounter, ProximanEnergiaBatteryBalance } from "./BatteryBalance";
import { PricesTables } from "./PriceTables";

export class VirtualBatteryConfig{
    wastePercent:number=0;
    private pricesTablesCache:PricesTables|null;

    constructor(wastePercent:number,priceCache:PricesTables|null){
        this.wastePercent=wastePercent;
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
    config:VirtualBatteryConfig;
    private balance:T|null=null;

    constructor(virtualBatteryConfig:VirtualBatteryConfig){
        this.config=virtualBatteryConfig;
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