import { LocalDateTime } from "@js-joda/core";
import { Interval } from "@js-joda/extra";
import { Instant } from "@js-joda/core";
import { ZoneId } from "@js-joda/core";
import { PmhItem, PmhItemSerialized } from "./PmhItem";
import { PvpcItem, PvpcItemSerialized} from "./PvpcItem";

export class PricesTables{
    pricesToSell:Map<Interval,PmhItem>=new Map();
    pricesToBuy:Map<Interval,PvpcItem>=new Map();

    constructor(pricesToSell:Map<Interval,PmhItem>,pricesToBuy:Map<Interval,PvpcItem>){
        this.pricesToSell=pricesToSell;
        this.pricesToBuy=pricesToBuy;
    }

    addPriceToBuy(pvpcItem:PvpcItem){
        this.pricesToBuy.set(pvpcItem.getInterval(),pvpcItem);
    }

    addPricetoSell(pmhItem:PmhItem){
        this.pricesToSell.set(pmhItem.getInterval(),pmhItem);
    }

    searchInBuy(date:LocalDateTime):PvpcItem{
        let oVal:PvpcItem=new PvpcItem(new PvpcItemSerialized());
        this.pricesToBuy.forEach((item:PvpcItem,key:Interval,map:Map<Interval,PvpcItem>)=>{
            if( Interval.of(
                Instant.parse(item.getInterval().start().toString())
                ,Instant.parse(item.getInterval().end().toString()))
                .contains(Instant.parse(date.atZone(ZoneId.of("Europe/Madrid")).toInstant().toString()))){
                    oVal=item;
                    console.log("SEARCH IN BUY:"+item.getPrice()+"|"+item.getInterval().toString());
                }
        });

       return oVal;
    }

    searchInSell(date:LocalDateTime):PmhItem{
        let oVal:PmhItem=new PmhItem();
        this.pricesToSell.forEach((item:PmhItem,key:Interval,map:Map<Interval,PmhItem>)=>{
            if( Interval.of(
                Instant.parse(item.getInterval().start().toString())
                ,Instant.parse(item.getInterval().end().toString()))
                .contains(Instant.parse(date.atZone(ZoneId.of("Europe/Madrid")).toInstant().toString()))){
                    oVal=item;
                    console.log("SEARCH IN SELL:"+item.getPrice()+"|"+item.getInterval().toString());
                }
        });

       return oVal;
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