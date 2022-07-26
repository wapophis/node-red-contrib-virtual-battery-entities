import { DateTimeFormatter, LocalDateTime, ZoneId } from "@js-joda/core";
import { Interval } from "@js-joda/extra";
import '@js-joda/timezone'

export class PmhItemSerialized{
    value:number=0.0;
    datetime:String=".";
    datetime_utc:String="";
    tz_time:String="";
    geo_ids:Array<number>=[];
}

export class PmhItem{
    value:number;
    datetime:LocalDateTime;
    datetime_utc:String;
    tz_time:String;
    interval:Interval|null;

    constructor(){
        this.value=0;
        this.datetime=LocalDateTime.now();
        this.datetime_utc="";
        this.tz_time="";
        this.interval=null;
    }

    of(pmhItem:PmhItemSerialized){
        let parcheTime=pmhItem.datetime.split(".")[0]+"+"+pmhItem.datetime.split(".")[1].split("+")[1];
        this.value=pmhItem.value;
        //this.datetime=LocalDateTime.parse(pmhItem.datetime,DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'.'SZ"));
        this.datetime=LocalDateTime.parse(parcheTime,DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        this.datetime_utc=pmhItem.datetime_utc;
        this.tz_time=pmhItem.tz_time;
        this.interval=this.getInterval();
    }

    getInterval(){
        if(this.interval===null){
        let endDateTime=this.datetime.plusHours(1);
        let startInstant=this.datetime.atZone(ZoneId.of("Europe/Madrid")).toInstant();
        let endInstant=endDateTime.atZone(ZoneId.of("Europe/Madrid")).toInstant();
        this.interval=Interval.of(startInstant,endInstant);
        }
        return this.interval;
        
    }

    getPrice(){
        return this.value;
    }

    static of(pmh:any):PmhItem{
        let oVal:PmhItem=new PmhItem();

        if(pmh["value"]!==undefined){
            oVal.value=pmh.value;
        }
        if(pmh["datetime"]!==undefined){
            oVal.datetime=LocalDateTime.parse(pmh.datetime.toString());
        }
        if(pmh["datetime_utc"]!==undefined){
            oVal.datetime_utc=pmh.datetime_utc.toString();
        }
        if(pmh["tz_time"]!==undefined){
            oVal.datetime_utc=pmh.tz_time.toString();
        }
        if(pmh["interval"]!==undefined){
            oVal.interval=Interval.parse(pmh.interval.toString());
            oVal.datetime=LocalDateTime.ofInstant(oVal.getInterval().start());
        }
        return oVal;
    }
};
