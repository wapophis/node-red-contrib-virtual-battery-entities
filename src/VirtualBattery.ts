import { ProximanEnergiaBatteryBalance } from "./BatteryBalance";
import { PricesTables } from "./PriceTables";

export class VirtualBatteryConfig{
    wastePercent:number=0;
    pricesTablesCache:PricesTables|null;

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
    
}

export class VirtualBattery{
    config:VirtualBatteryConfig;
    balance:ProximanEnergiaBatteryBalance;

    constructor(virtualBatteryConfig:VirtualBatteryConfig){
        this.config=virtualBatteryConfig;
        this.balance=new ProximanEnergiaBatteryBalance(0,0,0,0);
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