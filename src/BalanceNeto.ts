import { ChronoField, Duration, IsoFields, LocalDateTime } from "@js-joda/core";
import { BatterySlot } from "./BatterySlot";

export class BalanceNeto{
    startTime:LocalDateTime;
    endTime:LocalDateTime;
    batterySlots: BatterySlot[];
    length: number|null;
    consolidable:boolean;
    duration:Duration;

    constructor(msg:any){
        if(msg===undefined){
            this.duration=Duration.ofMinutes(1);
            let numberOfSlots=Math.floor(LocalDateTime.now().get(ChronoField.MINUTE_OF_DAY)/this.duration.toMinutes());
            this.startTime=LocalDateTime.now().withMinute(0).withSecond(0).withNano(0).minusMinutes(numberOfSlots*this.duration.toMinutes());
            this.endTime=this.startTime.plusMinutes(this.duration.toMinutes());
            this.batterySlots=new Array();
            this.length=null;
            this.consolidable=false;
            }else{
                this.duration=Duration.ofMinutes(msg.duration.toString());
                this.startTime=LocalDateTime.parse(msg.startTime.toString());
                this.endTime=LocalDateTime.parse(msg.endTime.toString());
                this.batterySlots=[];
                try{
                msg.batterySlots.forEach((item:any)=>{
                    this.batterySlots.push(new BatterySlot(item));
                });
            }catch(e){
                console.log(e);
            }
                this.length=msg.length;
                this.consolidable=msg.isConsolidable;
            }
    }
}