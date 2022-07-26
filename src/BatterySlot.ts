import { ChronoUnit, DateTimeFormatter, LocalDateTime } from "@js-joda/core";

export class BatterySlot{
    readTimeStamp: LocalDateTime;
    private length: number|null;
    producedInWatsH: number;
    feededInWatsH: number;
    consumedInWatsH: number;

    constructor(msg:any){
        let dateTimeformater=DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm:ss');
        //this.readTimeStamp=LocalDateTime.parse(msg.payload.uploadTime,dateTimeformater).plusHours(1);
        this.readTimeStamp=LocalDateTime.parse(msg.readTimeStamp.toString());
        //this.length=LocalDateTime.now().until(readTimeStamp,ChronoUnit.SECONDS)*1000;
        this.length=msg.length;
        this.producedInWatsH=msg.producedInWatsH;
        this.feededInWatsH=msg.feededInWatsH;
        this.consumedInWatsH=msg.consumedInWatsH;
    }

    calcLenght(b:BatterySlot){
        this.length=this.readTimeStamp.until(b.readTimeStamp,ChronoUnit.SECONDS)*1000;
    }

    get(){
        return {
            readTimeStamp:this.readTimeStamp,
            length:this.getLength(),
            producedInWatsH:this.producedInWatsH,
            feededInWatsH:this.feededInWatsH,
            consumedInWatsH:this.consumedInWatsH
        };
    }

    getLength():number{
        if(this.length===null){
            return -1;
        }else{
            return this.length;
        }
    }
}