import { DateTimeFormatter, LocalDateTime, ZoneId } from "@js-joda/core";
import { Interval } from "@js-joda/extra";

export class PmhItemSerialized{
    value:number=0.0;
    datetime:String="";
    datetime_utc:String="";
    tz_time:String="";
    geo_ids:Array<number>=[];
}

export class PmhItem{
    value:number;
    datetime:LocalDateTime;
    datetime_utc:String;
    tz_time:String;
    interval:Interval;

    constructor(pmhItem:PmhItemSerialized){
        let parcheTime=pmhItem.datetime.split(".")[0]+"+"+pmhItem.datetime.split(".")[1].split("+")[1];
        this.value=pmhItem.value;
        //this.datetime=LocalDateTime.parse(pmhItem.datetime,DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'.'SZ"));
        this.datetime=LocalDateTime.parse(parcheTime,DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        this.datetime_utc=pmhItem.datetime_utc;
        this.tz_time=pmhItem.tz_time;
        this.interval=this.getInterval();
    }

    getInterval(){
        let endDateTime=this.datetime.plusHours(1);
        let startInstant=this.datetime.atZone(ZoneId.of("Europe/Madrid")).toInstant();
        let endInstant=endDateTime.atZone(ZoneId.of("Europe/Madrid")).toInstant();
        return Interval.of(startInstant,endInstant);
    }

    getPrice(){
        return this.value;
    }
};