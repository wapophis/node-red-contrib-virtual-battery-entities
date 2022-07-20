import { DateTimeFormatter, LocalDate, ZoneId } from "@js-joda/core";
import { Interval } from "@js-joda/extra";


export class PvpcItemSerialized{
    dia:string="";
    hora:string="";
    PCB:string="";
    TEUPCB:string="";

    getStartHour():number{
        return Number.parseInt(this.hora.split("-")[0]);
    }

    getEndHour():number{
        return this.getStartHour()+1;
    }

    getPrice():number{
        return  parseFloat(this.PCB.replace(/,/g, '.'));
    }

    getTerminoFijo():number{
        return  parseFloat(this.TEUPCB.replace(/,/g, '.'));
    }

}



export class PvpcItem{
    serItem:PvpcItemSerialized;
    interval:Interval;
    constructor(fromEsios:PvpcItemSerialized){
        {
            this.serItem=fromEsios;
            ///this.timeInterval=Interval.of(Instant.)
            this.interval=this.getInterval();
        }
    }

    getInterval():Interval{
        let startHour=this.serItem.getStartHour();
        let startDateTime=LocalDate.parse(this.serItem.dia,DateTimeFormatter.ofPattern("dd/MM/yyyy")).atTime(startHour,0,0,0);
        let endDateTime=startDateTime.plusHours(1);
        let startInstant=startDateTime.atZone(ZoneId.of("Europe/Madrid")).toInstant();
        let endInstant=endDateTime.atZone(ZoneId.of("Europe/Madrid")).toInstant();
        return Interval.of(startInstant,endInstant);
    }

    getPrice(){
        return  this.serItem.getPrice();
    }

    getPeaje(){
        return this.serItem.getTerminoFijo();
    }
    

}