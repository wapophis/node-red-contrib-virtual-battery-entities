import { DateTimeFormatter, LocalDate, ZoneId } from "@js-joda/core";
import { Interval } from "@js-joda/extra";
/*
@Deprecated
*/
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
    static of(payload:any):PvpcItemSerialized{
        let oval:PvpcItemSerialized=new PvpcItemSerialized();
        oval.dia=payload.Dia;
        oval.hora=payload.Hora;
        oval.PCB=payload.PCB;
        oval.TEUPCB=payload.TEUPCB;
        return oval;
    }

}


/*
@Deprecated
*/
export class PvpcItem{
    serItem:PvpcItemSerialized;
    private interval:Interval;
    private price:number|null=null;
    private peaje:number|null=null;

    constructor(fromEsios:PvpcItemSerialized){
        {
            this.serItem=fromEsios;
            ///this.timeInterval=Interval.of(Instant.)
            this.interval=this.getInterval();
        }
    }

    getInterval():Interval{
        if(this.interval===null || this.interval===undefined){
            let startHour=this.serItem.getStartHour();
            let startDateTime=LocalDate.parse(this.serItem.dia,DateTimeFormatter.ofPattern("dd/MM/yyyy")).atTime(startHour,0,0,0);
            let endDateTime=startDateTime.plusHours(1);
            let startInstant=startDateTime.atZone(ZoneId.of("Europe/Madrid")).toInstant();
            let endInstant=endDateTime.atZone(ZoneId.of("Europe/Madrid")).toInstant();
            this.interval=Interval.of(startInstant,endInstant);
        }
        
        return this.interval;
    }

    getPrice(){
        if(this.price===null){
            this.price=this.serItem.getPrice();
        }

        return  this.price;;
    }

    getPeaje(){
        if(this.peaje===null){
            this.peaje=this.serItem.getTerminoFijo();
        }
        return this.peaje;
    }

    static of(pvpcItem:any):PvpcItem{
        let oVal:PvpcItem=new PvpcItem(new PvpcItemSerialized());

        if(pvpcItem["interval"]!==undefined){
            oVal.interval=Interval.parse(pvpcItem.interval.toString());
        }

        if(pvpcItem["price"]!==undefined){
            oVal.price=pvpcItem.price;
        }else{
            if(pvpcItem["PCB"]!==undefined){
                oVal.price=parseFloat(pvpcItem.PCB.toString().replace(/,/g, '.'));
            }
        }

        if(pvpcItem["peaje"]!==undefined){
            oVal.peaje=pvpcItem.peaje;
        }else{
            if(pvpcItem["TEUPCB"]!==undefined){
                oVal.peaje=parseFloat(pvpcItem.TEUPCB.toString().replace(/,/g, '.'));
            }
        }

        return oVal;
    }

    get():any{
        return{
            interval:this.getInterval().toString,
            price:this.getPrice(),
            peaje:this.getPeaje()
        }
    }
    

}