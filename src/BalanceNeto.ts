import { ChronoField, ChronoUnit, Duration, IsoFields, LocalDateTime, ZoneId } from "@js-joda/core";
import { BatterySlot } from "./BatterySlot";
import { PricesTables } from "./PriceTables";

export type ResultSlot={
    timeStamp:LocalDateTime;
    value:number;
}

export class BalanceNeto{
    startTime:LocalDateTime;
    endTime:LocalDateTime;
    batterySlots: BatterySlot[];
    length: number|null;
    consolidable:boolean;
    duration:Duration;
    durationChronoUnit:ChronoUnit;
    slotsOffset:number|0;

    pricesCache:PricesTables=new PricesTables();

    /**
     * 
     * @param msg:any|undefined build the object from a serialized Object {
     * 
     * }
     */
    constructor(msg:any){
        if(msg===undefined){
            this.duration=Duration.ofMinutes(1);
            this.durationChronoUnit=ChronoUnit.MINUTES;
            this.startTime=LocalDateTime.now();
            this.endTime=LocalDateTime.now();
            this.slotsOffset=0;

            //this.setDurationInMinutes(this.duration.toMinutes());
            this.setDuration(1,ChronoUnit.MINUTES);
            this.batterySlots=new Array();
            this.length=null;
            this.consolidable=false;
            }else{
                this.duration=Duration.ofMinutes(msg.duration.toString());
                this.durationChronoUnit=msg.durationChronoUnit;
                this.startTime=LocalDateTime.parse(msg.startTime.toString());
                this.endTime=LocalDateTime.parse(msg.endTime.toString());
                this.batterySlots=[];
                this.slotsOffset=msg.slotOffset|0;
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


    setDuration(duration:number,chronounit:ChronoUnit):BalanceNeto{
        if(chronounit===ChronoUnit.MINUTES){
            return this.setDurationInMinutes(duration);
        }
        if(chronounit===ChronoUnit.HOURS){
            return this.setDurationInHours(duration);
        }
        if(chronounit===ChronoUnit.DAYS){
            return this.setDurationInDays(duration);
        }
        if(chronounit===ChronoUnit.WEEKS){
            return this.setDurationInWeeks(duration);
        }
        if(chronounit===ChronoUnit.MONTHS){
            return this.setDurationInMonths(duration);
        }
        if(chronounit===ChronoUnit.YEARS){
            return this.setDurationInYears(duration);
        }
        throw new Error("Failed setting duration of the bucket with "+duration+" of "+chronounit.toString());

    }
    
    /**
     * Sets Duration of the bucket
     * @param durationInMinutes Duration in minutes of the Bucket
     * @returns the instance of this object
     */
    setDurationInMinutes(durationInMinutes:number):BalanceNeto{
        this.duration=Duration.ofMinutes(durationInMinutes);
        let numberOfSlots=Math.floor(LocalDateTime.now().get(ChronoField.MINUTE_OF_DAY)/durationInMinutes);
        this.startTime=LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0).plusMinutes(numberOfSlots*durationInMinutes);
        this.endTime=this.startTime.plusMinutes(durationInMinutes);
        return this;
    }

    /**
     * 
     * @param duration in hours starting at 00 seconds from the current hour
     * @returns this object
     */
    setDurationInHours(duration:number):BalanceNeto{
        return this.setDurationInMinutes(60*duration);
    }

    /**
     * 
     * @param duration in days starting at 00:00 from the current day
     * @returns this balanceNeto
     */
    setDurationInDays(duration:number):BalanceNeto{
        return this.setDurationInHours(24*duration);
    }

    /**
     * 
     * @param duration in Weeks, starting at 00:00:00 from the first day of the current week to the 23:59:59 of the last day in the week
     * @returns this balanceNeto
     */
    setDurationInWeeks(duration:number):BalanceNeto{
        this.duration=Duration.ofDays(duration*7);
        this.startTime=LocalDateTime.now().minusDays(LocalDateTime.now().get(ChronoField.DAY_OF_WEEK)-1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        this.endTime=this.startTime.plusWeeks(duration);
        return this;
    }

    /**
     * 
     * @param duration in months, starting at 00:00:00 from the first day of month, to the last day of month at 23:59:59
     * @returns 
     */
    setDurationInMonths(duration:number):BalanceNeto{
        this.startTime=LocalDateTime.now().minusDays(LocalDateTime.now().get(ChronoField.DAY_OF_MONTH)-1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        this.endTime=this.startTime.plusMonths(duration);
        this.duration=Duration.between(this.startTime,this.endTime);
        return this;
    }

    /**
     * 
     * @param duration in years, starting at the first day of the year at 00:00:00 to the last day of the year at 23:59:59
     * @returns 
     */
    setDurationInYears(duration:number):BalanceNeto{
        this.startTime=LocalDateTime.now().minusDays(LocalDateTime.now().get(ChronoField.DAY_OF_YEAR)-1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        this.endTime=this.startTime.plusYears(duration);
        this.duration=Duration.between(this.startTime,this.endTime);
        return this;
    }


    /**
     * Add an slot to the bucket
     * @param slot containing the energy info to aggregate to the bucket
     * @returns the instance of this object
    */
    addBatterySlot(slot:BatterySlot):BalanceNeto{
        slot=this.batterySlotCorrectOffset(slot);
        var slotStart=LocalDateTime.parse(slot.readTimeStamp.toString());
        
        if(slotStart.isBefore(this.startTime)){
            throw "Slot time is before than this slot start time";
        }
        if(slot.getLength()<0){
            throw "Discarded slot, because no lenght defined";
        }
        if(slot.getLength()>this.duration.toMillis()){
            throw "Cannot add slots with duration "+slot.getLength()+"ms greater than the net balance duration "+this.duration.toMillis()+"ms";
        }

        if(this.isConsolidable()===true){
            throw "Cannot add slots the net balance is consolidable."
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
        //slot.readTimeStamp=LocalDateTime.parse(LocalDateTime.parse(slot.readTimeStamp.toString()).atZone(ZoneId.of("Europe/Madrid")).toString());
        this.batterySlots.push(slot);
        this._autoConsolidate();
        return this;
    }

    batterySlotCorrectOffset(slot:BatterySlot):BatterySlot{
        if(this.slotsOffset>0){
           slot.readTimeStamp=slot.readTimeStamp.plusHours(this.slotsOffset);
        }
        if(this.slotsOffset<0){
            slot.readTimeStamp=slot.readTimeStamp.minusHours(-1*this.slotsOffset);
        }
        return slot;
    }

    getProduced():Number{
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
    getProducedInSlots(slotDuration:Duration):ResultSlot[]{
        let slotStartOffset=this.startTime;
        let slotEndOffset=this.startTime.plusMinutes(slotDuration.toMinutes());
        let slotsInHour=(60*60*1000)/this.batterySlots[0].getLength();
        let oVal=new Array<ResultSlot>();
     
        while(slotEndOffset.compareTo(this.endTime)<=0){
            let count=  0;
            
            this.batterySlots.filter((batSlot:BatterySlot)=>{
                return batSlot.readTimeStamp.compareTo(slotEndOffset)<0 && batSlot.readTimeStamp.compareTo(slotStartOffset)>=0;
            }).forEach((item:BatterySlot)=>{
 //               console.log({slotStartOffset:slotStartOffset.toString(),slotEndOffset:slotEndOffset.toString(),item:item.readTimeStamp.toString()});
                count+= item.producedInWatsH/slotsInHour;
                
                
            });
            oVal.push({timeStamp:slotStartOffset,value:count});    
            slotStartOffset=slotStartOffset.plusMinutes(slotDuration.toMinutes());
            slotEndOffset=slotEndOffset=slotStartOffset.plusMinutes(slotDuration.toMinutes());
        };

        return oVal;
    }
    getFeeded():Number{
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
     getFeededInSlots(slotDuration:Duration):ResultSlot[]{
        let slotStartOffset=this.startTime;
        let slotEndOffset=this.startTime.plusMinutes(slotDuration.toMinutes());
        let slotsInHour=(60*60*1000)/this.batterySlots[0].getLength();
        let oVal=new Array<ResultSlot>();
        while(slotEndOffset.compareTo(this.endTime)<=0){
            let count=  0;
            this.batterySlots.filter((batSlot:BatterySlot)=>{
                return batSlot.readTimeStamp.compareTo(slotEndOffset)<0 && batSlot.readTimeStamp.compareTo(slotStartOffset)>=0;
            }).forEach((item:BatterySlot)=>{
 //               console.log({slotStartOffset:slotStartOffset.toString(),slotEndOffset:slotEndOffset.toString(),item:item.readTimeStamp.toString()});
                count+= item.feededInWatsH/slotsInHour;
            });
            oVal.push({timeStamp:slotStartOffset,value:count});    
            slotStartOffset=slotStartOffset.plusMinutes(slotDuration.toMinutes());
            slotEndOffset=slotEndOffset=slotStartOffset.plusMinutes(slotDuration.toMinutes());
        };

        return oVal;
    }
    getConsumed():Number{
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
    getConsumedInSlots(slotDuration:Duration):ResultSlot[]{
        let slotStartOffset=this.startTime;
        let slotEndOffset=this.startTime.plusMinutes(slotDuration.toMinutes());
        let slotsInHour=(60*60*1000)/this.batterySlots[0].getLength();
        let oVal=new Array<ResultSlot>();
        while(slotEndOffset.compareTo(this.endTime)<=0){
            let count=  0;
            this.batterySlots.filter((batSlot:BatterySlot)=>{
                return batSlot.readTimeStamp.compareTo(slotEndOffset)<0 && batSlot.readTimeStamp.compareTo(slotStartOffset)>=0;
            }).forEach((item:BatterySlot)=>{
                //console.log({slotStartOffset:slotStartOffset.toString(),slotEndOffset:slotEndOffset.toString(),item:item.readTimeStamp.toString()});
                count+= item.consumedInWatsH/slotsInHour;
            });
            oVal.push({timeStamp:slotStartOffset,value:count});    
            slotStartOffset=slotStartOffset.plusMinutes(slotDuration.toMinutes());
            slotEndOffset=slotEndOffset=slotStartOffset.plusMinutes(slotDuration.toMinutes());
        };

        return oVal;
    }
    get(){
        return {
            balanceNeto:{
            duration:this.duration,
            durationChronoUnit:this.durationChronoUnit,
            feeded:this.getFeeded(),
            consumed:this.getConsumed(),
            produced:this.getProduced(),
            startAt:this.startTime,
            endAt:this.endTime,
            isConsolidable:this.isConsolidable(),
            batterySlots:this.batterySlots,
            length:this.batterySlots.length,
            startTime:this.startTime,
            endTime:this.endTime,
            imported:this.getImportedFromGrid(),
            exported:this.getExportedToGrid()
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
    setPricesTables(pricetables:PricesTables){
        this.pricesCache=pricetables;
    }
    _autoConsolidate(){
        this.consolidable=this.endTime.isBefore(this.batterySlots[this.batterySlots.length-1].readTimeStamp);
    }

    /**
    *  TODO
    * @param input 
    * @param type 
    */
    of(input:any,type:string){
        if(type="e-distribucion"){
            
        }
        if(type="json"){
            try{
            this.duration=Duration.parse(input.duration.toString());
            this.durationChronoUnit=input.durationChronoUnit;
            }catch(e){
                throw new Error("Durattion cannot be settled because of "+e);
            }
            
            this.startTime=LocalDateTime.parse(input.startTime.toString());
            this.endTime=LocalDateTime.parse(input.endTime.toString());
            this.batterySlots=[];
            this.slotsOffset=input.slotOffset|0;
            try{
                input.batterySlots.forEach((item:any)=>{
                this.batterySlots.push(new BatterySlot(item));
            });
            }catch(e){
            console.log(e);
            }
            this.length=input.length;
            this.consolidable=input.isConsolidable;
        }
    }
    /**
     * 
     * @param slotOffsetInHours Set hours in slots comming into to be corrected
     */
    setSlotOffset(slotOffsetInHours:number){
        this.slotsOffset=slotOffsetInHours;
    }

    /**
     * 
     * @returns energy imnported from grid in wats
     */
    getImportedFromGrid():number{
        return this.getImportedFromGridInUnits(1);
    }
    /**
     * 
     * @returns energy exported to the grid in wats
     */
    getExportedToGrid():number{
        return this.getExportedToGridInUnits(1);
    }
    /**
     * 
     * @param divisor unit divisor for the output energy value
     * @returns energy imported from grid with divisor applied
     */
    getImportedFromGridInUnits(divisor:number):number{
        let count=0;
        this.batterySlots.filter((batSlot:BatterySlot)=>{return batSlot.feededInWatsH<0;})
        .forEach(function(item){
            let slotsInHour=(60*60*1000)/item.getLength();
            count+=item.feededInWatsH/slotsInHour;
            if(isNaN(count)){
                console.log(item);
                return 0;
            }
        });
        return count/divisor;
    }
    /**
     * 
     * @param divisor unit divisor for the output energy value
     * @returns energy exported to grid with divisor applied
     */
    getExportedToGridInUnits(divisor:number):number{
        let count=0;
        this.batterySlots.filter((batSlot:BatterySlot)=>{return batSlot.feededInWatsH>0;})
        .forEach(function(item){
            let slotsInHour=(60*60*1000)/item.getLength();
            count+=item.feededInWatsH/slotsInHour;
            if(isNaN(count)){
                console.log(item);
                return 0;
            }
        });
        return count/divisor;
    }

}