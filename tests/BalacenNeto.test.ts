import { ChronoField, ChronoUnit, Duration, LocalDateTime } from "@js-joda/core";
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
            balaceNeto.setDuration(i,ChronoUnit.MINUTES);
            expect(Duration.between(balaceNeto.startTime,balaceNeto.endTime).toMinutes()).toBe(balaceNeto.duration.toMinutes());
 //           console.log({duration:balaceNeto.duration.toString(),startTIme:balaceNeto.startTime.toString(),endTime:balaceNeto.endTime.toString()});
            expect(balaceNeto.endTime.isAfter(LocalDateTime.now().withSecond(0))).toBeTruthy();
            }
    });

    test("Test duration in hours vs starTime && endTIme",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        for(let i=1;i<24*30;i++){
            balaceNeto.setDuration(i,ChronoUnit.HOURS);
            expect(Duration.between(balaceNeto.startTime,balaceNeto.endTime).toMinutes()).toBe(balaceNeto.duration.toMinutes());
 //           console.log({duration:balaceNeto.duration.toString(),startTIme:balaceNeto.startTime.toString(),endTime:balaceNeto.endTime.toString()});
            expect(balaceNeto.endTime.isAfter(LocalDateTime.now().withSecond(0))).toBeTruthy();
            }
    });

    test("Test duration in days vs starTime && endTIme",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        for(let i=1;i<365;i++){
            balaceNeto.setDuration(i,ChronoUnit.DAYS);
            expect(Duration.between(balaceNeto.startTime,balaceNeto.endTime).toMinutes()).toBe(balaceNeto.duration.toMinutes());
 //           console.log({duration:balaceNeto.duration.toString(),startTIme:balaceNeto.startTime.toString(),endTime:balaceNeto.endTime.toString()});
            expect(balaceNeto.endTime.isAfter(LocalDateTime.now().withSecond(0))).toBeTruthy();
            }
    });

    test("Test duration in weeks vs starTime && endTIme",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        for(let i=1;i<56;i++){
            balaceNeto.setDuration(i,ChronoUnit.WEEKS);
            expect(Duration.between(balaceNeto.startTime,balaceNeto.endTime).toMinutes()).toBe(balaceNeto.duration.toMinutes());
 //           console.log({duration:balaceNeto.duration.toString(),startTIme:balaceNeto.startTime.toString(),endTime:balaceNeto.endTime.toString()});
            expect(balaceNeto.endTime.isAfter(LocalDateTime.now().withSecond(0))).toBeTruthy();
            }
    });

    test("Test duration in months vs starTime && endTIme",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        for(let i=1;i<12;i++){
            balaceNeto.setDuration(i,ChronoUnit.MONTHS);
            expect(Duration.between(balaceNeto.startTime,balaceNeto.endTime).toMinutes()).toBe(balaceNeto.duration.toMinutes());
 //           console.log({duration:balaceNeto.duration.toString(),startTIme:balaceNeto.startTime.toString(),endTime:balaceNeto.endTime.toString()});
            expect(balaceNeto.endTime.isAfter(LocalDateTime.now().withSecond(0))).toBeTruthy();
            }
    });


    test("Test duration in YEARS vs starTime && endTIme",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        for(let i=1;i<10;i++){
            balaceNeto.setDuration(i,ChronoUnit.YEARS);
            expect(Duration.between(balaceNeto.startTime,balaceNeto.endTime).toMinutes()).toBe(balaceNeto.duration.toMinutes());
 //           console.log({duration:balaceNeto.duration.toString(),startTIme:balaceNeto.startTime.toString(),endTime:balaceNeto.endTime.toString()});
            expect(balaceNeto.endTime.isAfter(LocalDateTime.now().withSecond(0))).toBeTruthy();
            }
    });
    
    
    function getSlot():BatterySlot{
    return new BatterySlot({
        //readTimeStamp:LocalDateTime.now().toString(),
        readTimeStamp:new Date().toISOString().slice(0,-5),
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
        balaceNeto.setSlotOffset(1);
        balaceNeto.consolidable=true;
        let slot=getSlot();
        slot.consumedInWatsH=0;
        slot.producedInWatsH=888888;
        slot.feededInWatsH=0;
        expect(()=>balaceNeto.addBatterySlot(slot)).toThrow(/^Cannot add slots the net balance is consolidable.$/);
    });
   
    test("When feededInWatsH bad slot data",()=>{
        let balaceNeto=new BalanceNeto(undefined);
        balaceNeto.setSlotOffset(1);
        let slot=getSlot();
        slot.producedInWatsH=0;
        slot.consumedInWatsH=0;
        expect(()=>balaceNeto.addBatterySlot(slot)).toThrow(/^Error in slot data, feededInWatsH undefined$/);
    });

    test("When consumedInWatsH bad slot data",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        balaceNeto.setSlotOffset(1);
        let slot=getSlot();
        slot.producedInWatsH=0;
        slot.feededInWatsH=0;
        expect(()=>balaceNeto.addBatterySlot(slot)).toThrow(/^Error in slot data, consumedInWatsH undefined$/);
    });

    test("When producedInWatsH bad slot data",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        balaceNeto.setSlotOffset(1);
        let slot=getSlot();
        slot.consumedInWatsH=0;
        slot.feededInWatsH=0;
        expect(()=>balaceNeto.addBatterySlot(slot)).toThrow(/^Error in slot data, producedInWatsH undefined$/);
    });

    test("When Randomly adding slots ",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        balaceNeto.setSlotOffset(1);
        
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
        balaceNeto.setSlotOffset(1);
        let slot=getSlot();
        slot.consumedInWatsH=0;
        slot.producedInWatsH=10000000;
        slot.feededInWatsH=0;
        balaceNeto.addBatterySlot(slot);
        expect(balaceNeto.getProduced()).toBe(slot.producedInWatsH/((60*60*1000)/slot.getLength()));
    });

    test("Autoconsolidation works as expected adding slots",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        balaceNeto.setSlotOffset(1);
        let startTime=LocalDateTime.now();
        let slotLength=getSlot().getLength();
        balaceNeto.setDuration(15,ChronoUnit.MINUTES);

        
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
        balaceNeto.setSlotOffset(0); //NO OFFSET FOR THIS TEST READTIMESTAMP IS DINAMICALLY ALTERED
        let slotLength=getSlot().getLength();
        balaceNeto.setDuration(15,ChronoUnit.MINUTES);
        let startTime=balaceNeto.startTime;

        
            for (let i=0;i<(15*60*1000)/slotLength;i++){
                let slot=getSlot();
                slot.readTimeStamp=startTime.plusSeconds((i*slotLength)/1000);
                slot.consumedInWatsH=Math.floor(Math.random() * 9999999);
                slot.feededInWatsH=Math.floor(Math.random() * 9999999);
                slot.producedInWatsH=720;
                if(balaceNeto.isConsolidable()===false){
                    balaceNeto.addBatterySlot(slot);

                }
            }
    
        let result=0;
        balaceNeto.getProducedInSlots(Duration.ofMinutes(5)).forEach((rslot:ResultSlot)=>{
            result+=rslot.value;
        });
        expect(result.toFixed(2)).toBe(balaceNeto.getProduced().toFixed(2));
    });

    test("Getting Energy feeded data in slots",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        balaceNeto.setSlotOffset(0);
        let slotLength=getSlot().getLength();
        balaceNeto.setDuration(15,ChronoUnit.MINUTES);
        let startTime=balaceNeto.startTime;

        
            for (let i=0;i<(15*60*1000)/slotLength;i++){
                let slot=getSlot();
                slot.readTimeStamp=startTime.plusSeconds((i*slotLength)/1000);
                slot.consumedInWatsH=Math.floor(Math.random() * 9999999);
                slot.feededInWatsH=Math.floor(Math.random() * 9999999);
                slot.producedInWatsH=Math.floor(Math.random() * 9999999);
                if(balaceNeto.isConsolidable()===false){
                    balaceNeto.addBatterySlot(slot);
                }
            }
    
        let result=0;
        balaceNeto.getFeededInSlots(Duration.ofMinutes(5)).forEach((rslot:ResultSlot)=>{
            result+=rslot.value;
        });
        expect(result.toFixed(2)).toBe(balaceNeto.getFeeded().toFixed(2));
    });

    test("Getting Energy consumed data in slots",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        balaceNeto.setSlotOffset(0);
        let slotLength=getSlot().getLength();
        balaceNeto.setDuration(15,ChronoUnit.MINUTES);
        let startTime=balaceNeto.startTime;

        
            for (let i=0;i<(15*60*1000)/slotLength;i++){
                let slot=getSlot();
                slot.readTimeStamp=startTime.plusSeconds((i*slotLength)/1000);
                slot.consumedInWatsH=Math.floor(Math.random() * 9999999);
                slot.feededInWatsH=Math.floor(Math.random() * 9999999);
                slot.producedInWatsH=Math.floor(Math.random() * 9999999);
                if(balaceNeto.isConsolidable()===false){
                    balaceNeto.addBatterySlot(slot);
                }
            }
    
        let result=0;
        balaceNeto.getConsumedInSlots(Duration.ofMinutes(5)).forEach((rslot:ResultSlot)=>{
            result+=rslot.value;
        });
        expect(result.toFixed(2)).toBe(balaceNeto.getConsumed().toFixed(2));
    });


    test("Serialization",()=>{
        let balaceNeto=new BalanceNeto(undefined);  
        balaceNeto.setSlotOffset(1);
        balaceNeto.setDuration(15,ChronoUnit.MINUTES);
        
        for (let i=0;i<Math.floor(Math.random() * 100);i++){
            let slot=getSlot();
            slot.consumedInWatsH=Math.floor(Math.random() * 9999999);
            slot.feededInWatsH=Math.floor(Math.random() * 9999999);
            slot.producedInWatsH=Math.floor(Math.random() * 9999999);
            balaceNeto.addBatterySlot(slot)
        }

        expect(JSON.stringify(balaceNeto.get(), null, 2)).toBeDefined();
        
    });

    test("Deserializacion",()=>{
        let stringedBalanceNeto="{  \"balanceNeto\": {    \"duration\": \"PT15M\",    \"durationChronoUnit\": {      \"_name\": \"Minutes\",      \"_duration\": \"PT1M\"    },    \"feeded\": 49859.08194444445,    \"consumed\": 47406.8375,    \"produced\": 62906.55972222223,    \"startAt\": \"2025-02-25T00:45\",    \"endAt\": \"2025-02-25T01:00\",    \"isConsolidable\": false,    \"batterySlots\": [      {        \"readTimeStamp\": \"2025-02-25T00:48:02\",        \"length\": 5000,        \"producedInWatsH\": 4205139,        \"feededInWatsH\": 376974,        \"consumedInWatsH\": 4026194      },      {        \"readTimeStamp\": \"2025-02-25T00:48:02\",        \"length\": 5000,        \"producedInWatsH\": 6894765,        \"feededInWatsH\": 1726679,        \"consumedInWatsH\": 3286432      },      {        \"readTimeStamp\": \"2025-02-25T00:48:02\",        \"length\": 5000,        \"producedInWatsH\": 4695482,        \"feededInWatsH\": 5168726,        \"consumedInWatsH\": 2884192      },      {        \"readTimeStamp\": \"2025-02-25T00:48:02\",        \"length\": 5000,        \"producedInWatsH\": 9066905,        \"feededInWatsH\": 3317974,        \"consumedInWatsH\": 2788226      },      {        \"readTimeStamp\": \"2025-02-25T00:48:02\",        \"length\": 5000,        \"producedInWatsH\": 6407252,        \"feededInWatsH\": 8106588,        \"consumedInWatsH\": 2309951      },      {        \"readTimeStamp\": \"2025-02-25T00:48:02\",        \"length\": 5000,        \"producedInWatsH\": 4517264,        \"feededInWatsH\": 6182932,        \"consumedInWatsH\": 6901406      },      {        \"readTimeStamp\": \"2025-02-25T00:48:02\",        \"length\": 5000,        \"producedInWatsH\": 1847225,        \"feededInWatsH\": 7061944,        \"consumedInWatsH\": 9888487      },      {        \"readTimeStamp\": \"2025-02-25T00:48:02\",        \"length\": 5000,        \"producedInWatsH\": 7658691,        \"feededInWatsH\": 3956722,        \"consumedInWatsH\": 2048035      }    ],    \"length\": 8,    \"startTime\": \"2025-02-25T00:45\",    \"endTime\": \"2025-02-25T01:00\",    \"imported\": 0,    \"exported\": 49859.08194444445  }}";
        let balance:BalanceNeto=new BalanceNeto(undefined);
        
        balance.of(JSON.parse(stringedBalanceNeto).balanceNeto,"json");
        
    });
})


