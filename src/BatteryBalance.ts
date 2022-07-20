import { PmhItem, PmhItemSerialized } from "./PmhItem";
import { PvpcItem, PvpcItemSerialized } from "./PvpcItem";

export class ProximanEnergiaBatteryBalance{
    energyImported: number;
    energyFeeded: number;
    energyLossed: number;
    batteryLoad: number;
    buyPrice: PvpcItem;
    sellPrice: PmhItem;

    constructor(imported:number,feeded:number,losed:number,load:number){
        this.energyImported=imported;
        this.energyFeeded=feeded;
        this.energyLossed=losed;
        this.batteryLoad=load;
        this.buyPrice=new PvpcItem(new PvpcItemSerialized());
        this.sellPrice=new PmhItem(new PmhItemSerialized());
    }

    /**
     * 
     * @param balanceNeto TODO IMPLEMENTAR TIPO
     */
    addBalaceNeto(balanceNeto:any){
        if(balanceNeto.feeded<0){
            this.energyImported+=balanceNeto.feeded;
        }else{
            this.energyFeeded+=balanceNeto.feeded;
            this.energyLossed+=((5*this.energyFeeded)/100)*(this.sellPrice.getPrice()/1000000);
        }
        this.batteryLoad+=balanceNeto.feededPrice;
    }

    setPrices(buyPrice:PvpcItem,sellPrice:PmhItem){
        this.buyPrice=buyPrice;
        this.sellPrice=sellPrice;
    }
    get(){
        return {
            energyImported:this.energyImported,
            energyFeeded:this.energyFeeded,
            energyLossed:this.energyLossed,
            batteryLoad:this.batteryLoad,
            buyPrice:this.buyPrice,
            sellPrice:this.sellPrice
        };
    }
};