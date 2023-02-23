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
            this.energyFeeded === undefined || this.energyFeeded === null || Number.isNaN(this.energyFeeded) ? this.energyFeeded = 0 : false;
            if (this.buyPrice !== null) {
                this.batteryLoadInc = balanceNeto.getFeeded() * (this.buyPrice.getPrice() / 1000000);
                this.batteryLoad += this.batteryLoadInc;
            }
            else {
                throw Error("No buyPrice settled");
            }
        }
        else {
            this.energyFeeded += balanceNeto.getFeeded();
            this.energyImported === undefined || Number.isNaN(this.energyImported) || this.energyImported === null ? this.energyImported = 0 : false;
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
        var _a, _b;
        return {
            energyImported: this.energyImported === undefined || Number.isNaN(this.energyImported) ? 0 : this.energyImported,
            energyFeeded: this.energyFeeded === undefined || Number.isNaN(this.energyFeeded) ? 0 : this.energyFeeded,
            batteryLoad: this.batteryLoad,
            batteryLoadInc: this.batteryLoadInc,
            buyPrice: this.buyPrice,
            sellPrice: this.sellPrice,
            buyedAtPrice: (_a = this.buyPrice) === null || _a === void 0 ? void 0 : _a.getPrice(),
            selledAtPrice: (_b = this.sellPrice) === null || _b === void 0 ? void 0 : _b.getPrice()
            // terminoEnergia:this.terminoEnergiaSum,
            // terminoPotencia:this.terminoPotenciaSum
        };
    }
}
exports.BatteryBalanceCounter = BatteryBalanceCounter;
