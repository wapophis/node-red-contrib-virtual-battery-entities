import { LocalDateTime } from "@js-joda/core";
import { BatterySlot } from "./BatterySlot";



export class BalanceNetoHorario{
    startTime:LocalDateTime;
    endTime:LocalDateTime;
    batterySlots: BatterySlot[];
    length: number|null;
    consolidable:boolean;

    
    constructor(msg:any){
        if(msg===undefined){
        this.startTime=LocalDateTime.now().withMinute(0).withSecond(0).withNano(0);
        this.endTime=this.startTime.plusHours(1);
        this.batterySlots=new Array();
        this.length=null;
        this.consolidable=false;
        }else{
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
    addBatterySlot(slot:BatterySlot){
        var slotStart=LocalDateTime.parse(slot.readTimeStamp.toString());
        
        if(slotStart.isBefore(this.startTime)){
            throw "Slot time is before than this slot start time";
        }
        if(slot.getLength()<0){
            throw "Discarded slot, because no lenght defined";
        }

        if(slot.consumedInWatsH===undefined || isNaN(slot.consumedInWatsH)){
            throw "Error in slot data, consumedInWatsH undefined";
        }

        if(slot.feededInWatsH===undefined || isNaN(slot.feededInWatsH) ){
            throw "Error in slot data, feededInWatsH undefined";
        }

        if(slot.producedInWatsH===undefined || isNaN(slot.producedInWatsH) ){
            throw "Error in slot data, producedInWatsH undefined";
        }

        this.batterySlots.push(slot);
    }

    getProduced(){
        let count=0;
        this.batterySlots.forEach(function(item:BatterySlot){
            let slotsInHour=(60*60*1000)/item.getLength();
            count+=item.producedInWatsH/slotsInHour;
            if(isNaN(count)){
                console.log(item);
            }
        });
        return count;
    }
    getFeeded(){
        let count=0;
        this.batterySlots.forEach(function(item){
            let slotsInHour=(60*60*1000)/item.getLength();
            count+=item.feededInWatsH/slotsInHour;
            if(isNaN(count)){
                console.log(item);
                return 0;
            }
        });
        return count;
    }
    getConsumed(){
        let count=0;
        this.batterySlots.forEach(function(item){
            let slotsInHour=(60*60*1000)/item.getLength();
            count+=item.consumedInWatsH/slotsInHour;
            if(isNaN(count)){
                console.log(item);
            }
        });
        return count;
    }

    
    get(){
        return {
            balanceNetoHorario:{
            feeded:this.getFeeded(),
            consumed:this.getConsumed(),
            produced:this.getProduced(),
            startAt:this.startTime,
            endAt:this.endTime,
            isConsolidable:this.isConsolidable(),
            batterySlots:this.batterySlots,
            length:this.batterySlots.length,
            startTime:this.startTime,
            endTime:this.endTime
            }
        }
    }
    
    getEndTime():LocalDateTime {
        return LocalDateTime.parse(this.endTime.toString());
    }

    getStartTime():LocalDateTime{
        return LocalDateTime.parse(this.startTime.toString());
    }


    isConsolidable(){
        return this.consolidable;
    }

    of(input:any,type:string){
        if(type="e-distribucion"){
            
        }
    }
    
    
}

