import { BalanceNeto } from "./BalanceNeto";
import { BalanceNetoHorario } from "./BalanceNetoHorario";
import { PriceIntervalItem } from "./PriceIntervalItem";



export class BatteryBalanceCounter{
    energyImported: number=0;  /* @deprecated */
    energyFeeded: number=0;    /* @deprecated */ 
    energyExportedToGrid:number=0;   // @since 1.0.12-SNAPSHOT
    energyImportedFromGrid:number=0; // @since 1.0.12-SNAPSHOT
    energyExportedBill:number=0;    // @since 1.0.12-SNAPSHOT
    energyImportedBill:number=0;    // @since 1.0.12-SNAPSHOT
    batteryLoad: number;
    batteryLoadInc:number=0;
    buyPrice: PriceIntervalItem|null=null;
    sellPrice: PriceIntervalItem|null=null;


    constructor(imported:number,exported:number,load:number){
        this.energyImported=imported;   
        this.energyFeeded=exported;
        this.energyExportedToGrid=exported;
        this.energyImportedFromGrid=imported;
        this.batteryLoad=load;
        console.log(JSON.stringify({class:"BatteryBalanceCouter",method:"Constructor",args:{imported:imported,feeded:exported,load:load}}));
    }


    /**
     * @deprecated @since 1.0.11-SNAPSHOT
     * @param balanceNeto TODO IMPLEMENTAR TIPO
     */
    addBalaceNeto(balanceNeto:BalanceNetoHorario){
        console.log(JSON.stringify({class:"BatteryBalanceCouter",method:"addBalaceNeto",args:arguments}));
        if(balanceNeto.getFeeded()<0){
            this.energyImported==null?this.energyImported=balanceNeto.getFeeded():this.energyImported+=balanceNeto.getFeeded();
            this.energyFeeded===undefined || this.energyFeeded===null || Number.isNaN(this.energyFeeded) ?this.energyFeeded=0:false;
            if(this.buyPrice!==null){
                this.batteryLoadInc=balanceNeto.getFeeded()*(this.buyPrice.getPrice()/1000000);
                this.batteryLoad+=this.batteryLoadInc;
            }else{
                throw Error("No buyPrice settled");
            }
        }else{
            this.energyFeeded+=balanceNeto.getFeeded();
            this.energyImported===undefined || Number.isNaN(this.energyImported) || this.energyImported===null?this.energyImported=0:false;
            if(this.sellPrice!==null){
                this.batteryLoadInc=balanceNeto.getFeeded()*(this.sellPrice.getPrice()/1000000);
                this.batteryLoad+=this.batteryLoadInc;
            }
            else{
                throw Error("No sellPrice settled");
            }          

        }
    }

    /**
     * @since 1.0.12-SNAPSHOT
     * @param balanceNeto balanceNeto to make number
     */
    setBalanceNeto(balanceNeto:BalanceNeto):BatteryBalanceCounter{
        this.energyImportedFromGrid=balanceNeto.getImportedFromGridInUnits(1);
        this.energyExportedToGrid=balanceNeto.getExportedToGridInUnits(1);
        this._calcEnergyExportedBill();
        this._calcEnergyExportedBill();
        return this;
    }

    /**
     * 
     * @returns bill of exported energy
     */
    _calcEnergyExportedBill():number{
        if(this.sellPrice!==null){
            this.energyExportedBill=this.energyExportedToGrid*(this.sellPrice?.getPrice()/1000000);
        }
        else{
            this.energyExportedBill=NaN;
        }
        return this.energyExportedBill;
    }

    /**
     * 
     * @returns bill of imported energy
     */
    _calcEnergyImportedBill():number{
        if(this.buyPrice!==null){
            this.energyImportedBill=this.energyImportedFromGrid*(this.buyPrice?.getPrice()/1000000);
        }
        else{
            this.energyImportedBill=NaN;
        }
        return this.energyImportedBill;
    }

    /**
     * 
     * @param buyPrice price of buying energy
     * @param sellPrice price of selling energy
     */
    setPrices(buyPrice:PriceIntervalItem,sellPrice:PriceIntervalItem|null){
        if(buyPrice===undefined || buyPrice===null){
            throw Error("Buy price is null");
        }
        if(sellPrice===undefined || buyPrice===null){
            throw Error("Sell price is null");
        }

        this.buyPrice=buyPrice;
        this.sellPrice=sellPrice;
    }

    /**
     * @deprecated
     * @since 1.0.11-SNAPSHOT
     * @returns Object with deprecated data 
     */
    _dep_1_0_11_get(){
        return{
            energyImported:this.energyImported===undefined || Number.isNaN(this.energyImported)?0:this.energyImported,
            energyFeeded:this.energyFeeded===undefined || Number.isNaN(this.energyFeeded)?0:this.energyFeeded,
        }
    }

    /**
     * 
     * @returns object represeting the battery balance
     */
    get():any{
        return Object.assign({
            energyExportedToGrid:this.energyExportedToGrid,
            energyImportedFromGrid:this.energyImportedFromGrid,
            batteryLoad:this.batteryLoad,
            batteryLoadInc:this.batteryLoadInc,
            buyPrice:this.buyPrice,
            sellPrice:this.sellPrice,
            buyedAtPrice:this.buyPrice?.getPrice(),
            selledAtPrice:this.sellPrice?.getPrice()
        },this._dep_1_0_11_get());
    }
}


