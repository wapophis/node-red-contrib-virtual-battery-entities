import { IllegalArgumentException, Instant, LocalDateTime, ZoneId } from "@js-joda/core";
import { Interval } from "@js-joda/extra";

export class PriceIntervalItem{
    private interval:Interval|null=null;
    private price:number|null=null;

    getInterval():Interval{
        if(this.interval===null)
        {
            throw new Error("Interval is null");
        }
        return this.interval;
    }

    getPrice(){
        if(this.price===null){
            throw new Error("Price is null")
        }
        return this.price;
    }

    setInterval(interval:Interval):PriceIntervalItem{
        this.interval=interval;
        return this;
    }

    setPrice(price:number):PriceIntervalItem{
        this.price=price;
        return this;
    }


    static searchPriceInIntervalMap(map:Map<Interval,PriceIntervalItem>,date:LocalDateTime):PriceIntervalItem|null{
        let oVal:PriceIntervalItem=new PriceIntervalItem();
        map.forEach((item:PriceIntervalItem,key:Interval,map:Map<Interval,PriceIntervalItem>)=>{
            if( Interval.of(
                Instant.parse(item.getInterval().start().toString())
                ,Instant.parse(item.getInterval().end().toString()))
                .contains(Instant.parse(date.atZone(ZoneId.of("Europe/Madrid")).toInstant().toString()))){
                    oVal=item;
                }
        });
       return oVal;
    }


}