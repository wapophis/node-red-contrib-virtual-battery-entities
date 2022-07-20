import { LocalDateTime } from "@js-joda/core";
import { Interval } from "@js-joda/extra";
import { Instant } from "@js-joda/core";
import { ZoneId } from "@js-joda/core";
import { PmhItem, PmhItemSerialized } from "./PmhItem";
import { PvpcItem, PvpcItemSerialized} from "./PvpcItem";

export class PricesTables{
    pricesToSell:Map<Interval,PmhItem>=new Map();
    pricesToBuy:Map<Interval,PvpcItem>=new Map();


    addPriceToBuy(pvpcItem:PvpcItem){
        this.pricesToBuy.set(pvpcItem.interval,pvpcItem);
    }

    addPricetoSell(pmhItem:PmhItem){
        this.pricesToSell.set(pmhItem.interval,pmhItem);
    }

    searchInBuy(date:LocalDateTime):PvpcItem{
        let oVal:PvpcItem=new PvpcItem(new PvpcItemSerialized());
        this.pricesToBuy.forEach((item:PvpcItem,key:Interval,map:Map<Interval,PvpcItem>)=>{
            if( Interval.of(
                Instant.parse(item.interval.start().toString())
                ,Instant.parse(item.interval.end().toString()))
                .contains(Instant.parse(date.atZone(ZoneId.systemDefault()).toInstant().toString()))){
                    oVal=item;
                }
        });

       return oVal;
    }

    searchInSell(date:LocalDateTime):PmhItem{
        let oVal:PmhItem=new PmhItem(new PmhItemSerialized());
        this.pricesToSell.forEach((item:PmhItem,key:Interval,map:Map<Interval,PmhItem>)=>{
            if( Interval.of(
                Instant.parse(item.interval.start().toString())
                ,Instant.parse(item.interval.end().toString()))
                .contains(Instant.parse(date.atZone(ZoneId.systemDefault()).toInstant().toString()))){
                    oVal=item;
                }
        });

       return oVal;
    }
}