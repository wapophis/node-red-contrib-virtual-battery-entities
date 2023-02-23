import { Duration, LocalDateTime } from "@js-joda/core";
import { BalanceNeto } from "../src/BalanceNeto";

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
})