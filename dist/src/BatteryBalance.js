"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatteryBalanceCounter = void 0;
class BatteryBalanceCounter {
    /*
    terminoEnergiaSum:number=0;
    terminoEnergiaPrice:PriceIntervalItem|null=null;
    terminoPotenciaSum:number=0;
    terminoPotenciaPrice:PriceIntervalItem|null=null;
    */
    constructor(imported, feeded, load) {
        this.energyImported = 0;
        this.energyFeeded = 0;
        this.batteryLoadInc = 0;
        this.buyPrice = null;
        this.sellPrice = null;
        this.energyImported = imported;
        this.energyFeeded = feeded;
        this.batteryLoad = load;
        console.log(JSON.stringify({ class: "BatteryBalanceCouter", method: "Constructor", args: { imported: imported, feeded: feeded, load: load } }));
    }
    /**
     *
     * @param balanceNeto TODO IMPLEMENTAR TIPO
     */
    addBalaceNeto(balanceNeto) {
        console.log(JSON.stringify({ class: "BatteryBalanceCouter", method: "addBalaceNeto", args: arguments }));
        if (balanceNeto.getFeeded() < 0) {
            this.energyImported == null ? this.energyImported = balanceNeto.getFeeded() : this.energyImported += balanceNeto.getFeeded();
            this.energyFeeded === undefined || this.energyFeeded === null || this.energyFeeded == NaN ? this.energyFeeded = 0 : false;
            if (this.buyPrice !== null) {
                this.batteryLoadInc = balanceNeto.getFeeded() * (this.buyPrice.getPrice() / 1000000);
                this.batteryLoad += balanceNeto.getFeeded() * (this.buyPrice.getPrice() / 1000000);
            }
            else {
                throw Error("No buyPrice settled");
            }
        }
        else {
            this.energyFeeded += balanceNeto.getFeeded();
            this.energyImported === undefined || this.energyImported === NaN || this.energyImported === null ? this.energyImported = 0 : false;
            if (this.sellPrice !== null) {
                this.batteryLoadInc = balanceNeto.getFeeded() * (this.sellPrice.getPrice() / 1000000);
                this.batteryLoad += this.batteryLoadInc;
            }
            else {
                throw Error("No sellPrice settled");
            }
            /*        if(this.terminoEnergiaPrice!==null){
                        this.terminoEnergiaSum+=balanceNeto.getFeeded()*(this.terminoEnergiaPrice.getPrice()/1000000);
                    }*/
        }
    }
    // addTerminoPotenciaIncrement(potenciaInTramo:number){
    //         if(this.terminoPotenciaPrice!==null){
    //             this.terminoPotenciaSum+=potenciaInTramo*(this.terminoPotenciaPrice.getPrice()/1000000);
    //         }
    // }
    setPrices(buyPrice, sellPrice) {
        if (buyPrice === undefined || buyPrice === null) {
            throw Error("Buy price is null");
        }
        if (sellPrice === undefined || buyPrice === null) {
            throw Error("Sell price is null");
        }
        this.buyPrice = buyPrice;
        this.sellPrice = sellPrice;
    }
    // setTerms(energia:PriceIntervalItem|null,potencia:PriceIntervalItem|null){
    //     this.terminoEnergiaPrice=energia;
    //     this.terminoPotenciaPrice=potencia;
    // }
    get() {
        return {
            energyImported: this.energyImported === undefined || this.energyImported === NaN ? 0 : this.energyImported,
            energyFeeded: this.energyFeeded === undefined || this.energyFeeded === NaN ? 0 : this.energyFeeded,
            batteryLoad: this.batteryLoad,
            batteryLoadInc: this.batteryLoadInc,
            buyPrice: this.buyPrice,
            sellPrice: this.sellPrice,
            // terminoEnergia:this.terminoEnergiaSum,
            // terminoPotencia:this.terminoPotenciaSum
        };
    }
}
exports.BatteryBalanceCounter = BatteryBalanceCounter;
