import { LocalDateTime } from "@js-joda/core";
import { Interval } from "@js-joda/extra";
import { Instant } from "@js-joda/core";
import { ZoneId } from "@js-joda/core";
import { PmhItem, PmhItemSerialized } from "./PmhItem";
import { PvpcItem, PvpcItemSerialized} from "./PvpcItem";
import { PriceIntervalItem } from "./PriceIntervalItem";

export class PricesTables{
    pricesToSell:Map<Interval,PriceIntervalItem>=new Map();
    pricesToBuy:Map<Interval,PriceIntervalItem>=new Map();
    energyTerm:Map<Interval,PriceIntervalItem>=new Map();
    potenciaTerm:Map<Interval,PriceIntervalItem>=new Map();

    addPriceToBuy(pvpcItem:PriceIntervalItem){
        this.pricesToBuy.set(pvpcItem.getInterval(),pvpcItem);
    }

    addPricetoSell(pmhItem:PriceIntervalItem){
        this.pricesToSell.set(pmhItem.getInterval(),pmhItem);
    }

    addEnergyTerm(teuItem:PriceIntervalItem){
        this.energyTerm.set(teuItem.getInterval(),teuItem);
    }

    searchInBuy(date:LocalDateTime):PriceIntervalItem{
    let priceItem:PriceIntervalItem|null=PriceIntervalItem.searchPriceInIntervalMap(this.pricesToBuy,date);
    if(priceItem===null){
     throw new Error("Sell prices error by null reference");
        }
        return priceItem;
    }

    setEnergyTerm(energyTerms:Map<Interval,PriceIntervalItem>):PricesTables{
        this.energyTerm=energyTerms;
        return this;
    }

    setSellPrices(pricesToSell:Map<Interval,PriceIntervalItem>):PricesTables{
        this.pricesToSell=pricesToSell;
        return this;
    }

    setBuyPrices(pricesToBuy:Map<Interval,PriceIntervalItem>):PricesTables{
        this.pricesToBuy=pricesToBuy;
        return this;
    }

    setPotenciaTerm(potenciaTerms:Map<Interval,PriceIntervalItem>){
        this.energyTerm=potenciaTerms;
    }

    searchInSell(date:LocalDateTime):PriceIntervalItem|null{
       return PriceIntervalItem.searchPriceInIntervalMap(this.pricesToSell,date);
    }

    searchInTerminoEnergia(date:LocalDateTime):PriceIntervalItem|null{
        return PriceIntervalItem.searchPriceInIntervalMap(this.energyTerm,date);
    }

    searchInTerminoPotencia(date:LocalDateTime):PriceIntervalItem|null{
        return PriceIntervalItem.searchPriceInIntervalMap(this.potenciaTerm,date);
    }

    reset(){
        this.pricesToBuy.clear();
        this.pricesToSell.clear();
        this.energyTerm.clear();
    }
    get():any{
        let oVal:any={};
        let p1Array:Array<any>=[];
        let p2Array:Array<any>=[];
        let p3Array:Array<any>=[];

        this.pricesToSell.forEach((item:PriceIntervalItem,key:Interval)=>{
          p1Array.push({key:key.toString(),value:item.get()});
        });

        this.pricesToBuy.forEach((item:PriceIntervalItem,key:Interval)=>{
            p2Array.push({key:key.toString(),value:item.get()});
          });

        
        this.energyTerm.forEach((item:PriceIntervalItem,key:Interval)=>{
            p3Array.push({key:key.toString(),value:item.get()});
          });



        return{
            pricesToSell:p1Array,
            pricesToBuy:p2Array,
            energyTerm:p3Array
        }

    }

    set(serialized:any){
        let p1Map:Map<Interval,PriceIntervalItem>=new Map();
        let p2Map:Map<Interval,PriceIntervalItem>=new Map();
        let p3Map:Map<Interval,PriceIntervalItem>=new Map();
        if(serialized["pricesToSell"]!==undefined){
            serialized.pricesToSell.forEach((item:any)=>{
                let interval0:Interval=Interval.parse(item.key);
                let interval1:Interval=Interval.parse(item.value.interval);
                let priceItem:PriceIntervalItem=new PriceIntervalItem();
                priceItem.setInterval(interval1);
                priceItem.setPrice(item.value.price);
                p1Map.set(interval0,priceItem);

            });
        }
        if(serialized["pricesToBuy"]!==undefined){
            serialized.pricesToBuy.forEach((item:any)=>{
                let interval0:Interval=Interval.parse(item.key);
                let interval1:Interval=Interval.parse(item.value.interval);
                let priceItem:PriceIntervalItem=new PriceIntervalItem();
                priceItem.setInterval(interval1);
                priceItem.setPrice(item.value.price);
                p2Map.set(interval0,priceItem);

            });
        }
        if(serialized["energyTerm"]!==undefined){
            serialized.energyTerm.forEach((item:any)=>{
                let interval0:Interval=Interval.parse(item.key);
                let interval1:Interval=Interval.parse(item.value.interval);
                let priceItem:PriceIntervalItem=new PriceIntervalItem();
                priceItem.setInterval(interval1);
                priceItem.setPrice(item.value.price);
                p3Map.set(interval0,priceItem);

            });
        }
        this.setSellPrices(p1Map);
        this.setBuyPrices(p2Map);
        this.setEnergyTerm(p3Map);
    }


   
}


export class PricesTablesMapper{
    static unMarshallPvpC(pricesListObject:any):Map<Interval,PvpcItem>{
        let oVal:Map<Interval,PvpcItem>=new Map();
        Object.keys(pricesListObject).forEach((key:string)=>{
            try{
            let item:PvpcItem=PvpcItem.of(pricesListObject[key]);
            oVal.set(item.getInterval(),item);
            }catch(e){console.log(e)
             oVal.set(pricesListObject[key].getInterval(),pricesListObject[key]);
            };

            
        });
        return oVal;
    }


    static unMarshallPmh(pricesListObject:any):Map<Interval,PmhItem>{
        let oVal:Map<Interval,PmhItem>=new Map();
        Object.keys(pricesListObject).forEach((key:string)=>{
              try{
            let item:PmhItem=PmhItem.of(pricesListObject[key]);
            oVal.set(item.getInterval(),item);
            }catch(e){console.log(e)
             oVal.set(pricesListObject[key].getInterval(),pricesListObject[key]);
            };
        });
        return oVal;
    }
}