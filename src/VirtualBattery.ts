import { IllegalArgumentException, LocalDateTime, ZoneId, ZoneOffset } from "@js-joda/core";
import { Interval } from "@js-joda/extra";
import { BalanceNetoHorario } from "./BalanceNetoHorario";
import { BatteryBalanceCounter } from "./BatteryBalance";
import { PriceIntervalItem } from "./PriceIntervalItem";
import { PricesTables } from "./PriceTables";

export class VirtualBatteryConfig{
  //  wastePercent:number=0;
    // potenciasMap:Map<Interval,PriceIntervalItem>|null=null;
    
    private pricesTablesCache:PricesTables|null;

    constructor(priceCache:PricesTables|null){
    //    this.wastePercent=wastePercent;
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

    // addTerminoPotencia(startHour:number,endHour:number,pricePerMwH:number):VirtualBatteryConfig{
    //     if(this.potenciasMap!==null){
    //        let startDateInterval=LocalDateTime.now().withHour(startHour).withMinute(0).withSecond(0).withNano(0);
    //        let endDateInterval=LocalDateTime.now().withHour(endHour).withMinute(0).withSecond(0).withNano(0);
    //        let toAddTerm:PriceIntervalItem=new PriceIntervalItem();
    //         toAddTerm.setInterval(Interval.of(startDateInterval.atZone(ZoneId.of("Europe/Madrid")).toInstant(),endDateInterval.atZone(ZoneId.of("Europe/Madrid")).toInstant()));
    //         toAddTerm.setPrice(pricePerMwH);
    //         this.potenciasMap.set(toAddTerm.getInterval(),toAddTerm);
    //     }
    //     return this;
    // }

    // getTerminoPotencia(date:LocalDateTime):PriceIntervalItem|null{
    //     if(this.potenciasMap!==null)
    //         return PriceIntervalItem.searchPriceInIntervalMap(this.potenciasMap,date);
    //     return null;
    // }

    
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