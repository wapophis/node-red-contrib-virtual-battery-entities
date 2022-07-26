import { BalanceNetoHorario } from "./BalanceNetoHorario";
import { PmhItem, PmhItemSerialized } from "./PmhItem";
import { PvpcItem, PvpcItemSerialized } from "./PvpcItem";


export class BatteryBalanceCounter{
    energyImported: number;
    energyFeeded: number;    
    batteryLoad: number;
    buyPrice: PvpcItem|null=null;
    sellPrice: PmhItem|null=null;

    constructor(imported:number,feeded:number,load:number){
        this.energyImported=imported;
        this.energyFeeded=feeded;
        this.batteryLoad=load;
    }

    /**
     * 
     * @param balanceNeto TODO IMPLEMENTAR TIPO
     */
    addBalaceNeto(balanceNeto:BalanceNetoHorario){
        if(balanceNeto.getFeeded()<0){
            this.energyImported+=balanceNeto.getFeeded();
            if(this.buyPrice!==null){
                this.batteryLoad+=balanceNeto.getFeeded()*(this.buyPrice.getPrice()/1000000);
            }else{
                throw Error("No buyPrice settled");
            }
        }else{
            this.energyFeeded+=balanceNeto.getFeeded();
            if(this.sellPrice!==null){
                this.batteryLoad+=balanceNeto.getFeeded()*(this.sellPrice.getPrice()/1000000);
            }
            else{
                throw Error("No sellPrice settled");
            }
        }
    }

    setPrices(buyPrice:PvpcItem,sellPrice:PmhItem){
        this.buyPrice=buyPrice;
        this.sellPrice=sellPrice;
    }


    get():any{
        return {
            energyImported:this.energyImported,
            energyFeeded:this.energyFeeded,
            batteryLoad:this.batteryLoad,
            buyPrice:this.buyPrice,
            sellPrice:this.sellPrice
        };
    }
}


export class ProximanEnergiaBatteryBalance extends BatteryBalanceCounter{
    energyLossed: number;
    private wastePercent:number|null=null;
    
    constructor(imported:number,feeded:number,losed:number,load:number,wastePercent:number){
        super(imported,feeded,load);
        this.energyLossed=losed;
        this.wastePercent=wastePercent;
    }

    getWastePercent():number{
        if(this.wastePercent===null){
            this.wastePercent=0;
        }
        return this.wastePercent;
    }

    addBalaceNeto(balanceNeto:BalanceNetoHorario){
        super.addBalaceNeto(balanceNeto);
        if(this.sellPrice!==null){
            this.energyLossed+=((this.getWastePercent()*this.energyFeeded)/100)*(this.sellPrice.getPrice()/1000000);
        }else{
            throw Error("No sellPrice settled");
        }
    }


    get():any{
        let oVal:Record<string,any>=super.get();
        oVal.energyLossed=this.energyLossed;
        return oVal;
    }
    
};