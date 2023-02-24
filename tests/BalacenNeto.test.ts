import { ChronoField, Duration, LocalDateTime } from "@js-joda/core";
import { BalanceNeto, ResultSlot } from "../src/BalanceNeto";
import { BatterySlot } from "../src/BatterySlot";

describe("Testing BalanceNeto",()=>{
    test('Constructor',()=>{
        let balaceNeto=new BalanceNeto(undefined);
        
        expect(balaceNeto).toBeDefined();
        expect(balaceNeto.consolidable).toBeFalsy();
        expect(balaceNeto.batterySlots).toBeDefined();
        expect(balaceNeto.duration).toBeDefined();
        expect(balaceNeto.startTime).toBeDefined();
        expect(balaceNeto.endTime).toBeDefined();
        expect(balaceNeto.length).toBeNull();
    });
    test("Test duration vs starTime && endTIme",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        for(let i=1;i<24*60;i++){
            balaceNeto.setDuration(i);
            expect(Duration.between(balaceNeto.startTime,balaceNeto.endTime).toMinutes()).toBe(balaceNeto.duration.toMinutes());
 //           console.log({duration:balaceNeto.duration.toString(),startTIme:balaceNeto.startTime.toString(),endTime:balaceNeto.endTime.toString()});
            expect(balaceNeto.endTime.isAfter(LocalDateTime.now().withSecond(0))).toBeTruthy();
            }
    });
    
    function getSlot():BatterySlot{
    return new BatterySlot({
        readTimeStamp:LocalDateTime.now().toString(),
        length:5000,
        producedInWatsH:undefined,
        feededInWatsH:undefined,
        consumedInWatsH:undefined
    });
    }

    test("When adding empty slot",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        let slot=getSlot();
        slot.readTimeStamp=slot.readTimeStamp.minusHours(1);
        expect(()=>balaceNeto.addBatterySlot(slot)).toThrow(/^Slot time is before than this slot start time$/);
    });

    function getNoLengthSlot():BatterySlot{
        return new BatterySlot({
            readTimeStamp:LocalDateTime.now().toString(),
            length:-1,
            producedInWatsH:0,
            feededInWatsH:0,
            consumedInWatsH:0
        });
        }

    test("When adding slot without length data",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        expect(()=>balaceNeto.addBatterySlot(getNoLengthSlot())).toThrow(/^Discarded slot, because no lenght defined$/);
    });

    function getOverNetLengthSlot():BatterySlot{
        return new BatterySlot({
            readTimeStamp:LocalDateTime.now().toString(),
            length:60*60*1000,
            producedInWatsH:0,
            feededInWatsH:0,
            consumedInWatsH:0
        });
        }
    test("When adding slot with length over net length",()=>{
        let balaceNeto=new BalanceNeto(undefined);
        expect(()=>balaceNeto.addBatterySlot(getOverNetLengthSlot())).toThrow(/^Cannot add slots with duration ([0-9])+ms greater than the net balance duration ([0-9])+ms$/);
    });

    test("When net balance is consolidable",()=>{
        let balaceNeto=new BalanceNeto(undefined);
        balaceNeto.consolidable=true;
        let slot=getSlot();
        slot.consumedInWatsH=0;
        slot.producedInWatsH=888888;
        slot.feededInWatsH=0;
        expect(()=>balaceNeto.addBatterySlot(slot)).toThrow(/^Cannot add slots the net balance is consolidable.$/);
    });
   
    test("When feededInWatsH bad slot data",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        let slot=getSlot();
        slot.producedInWatsH=0;
        slot.consumedInWatsH=0;
        expect(()=>balaceNeto.addBatterySlot(slot)).toThrow(/^Error in slot data, feededInWatsH undefined$/);
    });

    test("When consumedInWatsH bad slot data",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        let slot=getSlot();
        slot.producedInWatsH=0;
        slot.feededInWatsH=0;
        expect(()=>balaceNeto.addBatterySlot(slot)).toThrow(/^Error in slot data, consumedInWatsH undefined$/);
    });

    test("When producedInWatsH bad slot data",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        let slot=getSlot();
        slot.consumedInWatsH=0;
        slot.feededInWatsH=0;
        expect(()=>balaceNeto.addBatterySlot(slot)).toThrow(/^Error in slot data, producedInWatsH undefined$/);
    });

    test("When Randomly adding slots ",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        
        for (let i=0;i<Math.floor(Math.random() * 999);i++){
            let slot=getSlot();
            slot.consumedInWatsH=Math.floor(Math.random() * 9999999);
            slot.feededInWatsH=Math.floor(Math.random() * 9999999);
            slot.producedInWatsH=Math.floor(Math.random() * 9999999);
            balaceNeto.addBatterySlot(slot)
            expect(balaceNeto.batterySlots.length).toBeGreaterThan(i);
        }
    });

    test("Energy production data is working properly",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        let slot=getSlot();
        slot.consumedInWatsH=0;
        slot.producedInWatsH=10000000;
        slot.feededInWatsH=0;
        balaceNeto.addBatterySlot(slot);
        expect(balaceNeto.getProduced()).toBe(slot.producedInWatsH/((60*60*1000)/slot.getLength()));
    });

    test("Autoconsolidation works as expected adding slots",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        let startTime=LocalDateTime.now();
        let slotLength=getSlot().getLength();
        balaceNeto.setDuration(15);

        
            for (let i=0;i<(15*60*1000)/slotLength;i++){
                let slot=getSlot();
                slot.readTimeStamp=startTime.plusSeconds(slotLength/1000);
                slot.consumedInWatsH=Math.floor(Math.random() * 9999999);
                slot.feededInWatsH=Math.floor(Math.random() * 9999999);
                slot.producedInWatsH=Math.floor(Math.random() * 9999999);
                if(balaceNeto.isConsolidable()===false){
                    balaceNeto.addBatterySlot(slot);
                    startTime=slot.readTimeStamp;
                }
            }
        


        let slot=getSlot();
        slot.readTimeStamp=startTime.plusSeconds(slotLength/1000);
        slot.consumedInWatsH=Math.floor(Math.random() * 9999999);
        slot.feededInWatsH=Math.floor(Math.random() * 9999999);
        slot.producedInWatsH=Math.floor(Math.random() * 9999999);
        expect(()=>balaceNeto.addBatterySlot(slot)).toThrow(/^Cannot add slots the net balance is consolidable.$/);
        expect(balaceNeto.endTime.isBefore(balaceNeto.batterySlots[balaceNeto.batterySlots.length-1].readTimeStamp)).toBeTruthy();
        startTime=slot.readTimeStamp;
        
    });

    test("Getting Energy production data in slots",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        let slotLength=getSlot().getLength();
        balaceNeto.setDuration(15);
        let startTime=balaceNeto.startTime;

        
            for (let i=0;i<(15*60*1000)/slotLength;i++){
                let slot=getSlot();
                slot.readTimeStamp=startTime.plusSeconds(slotLength/1000);
                /*slot.consumedInWatsH=Math.floor(Math.random() * 9999999);
                slot.feededInWatsH=Math.floor(Math.random() * 9999999);
                slot.producedInWatsH=Math.floor(Math.random() * 9999999);*/
                slot.consumedInWatsH=1000;
                slot.feededInWatsH=1000;
                slot.producedInWatsH=10000;
                if(balaceNeto.isConsolidable()===false){
                    balaceNeto.addBatterySlot(slot);
                    startTime=slot.readTimeStamp;
                }
            }
    
        let result=0;
        balaceNeto.getProducedInSlots(Duration.ofMinutes(5)).forEach((rslot:ResultSlot)=>{
            result+=rslot.value;
        });
        expect(result).toBe(balaceNeto.getProduced());
    });

    test("Serialization",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        balaceNeto.setDuration(15);
        
        for (let i=0;i<Math.floor(Math.random() * 100);i++){
            let slot=getSlot();
            slot.consumedInWatsH=Math.floor(Math.random() * 9999999);
            slot.feededInWatsH=Math.floor(Math.random() * 9999999);
            slot.producedInWatsH=Math.floor(Math.random() * 9999999);
            balaceNeto.addBatterySlot(slot)
        }

        expect(JSON.stringify(balaceNeto.get(), null, 2)).toBeDefined();
        
    });
})