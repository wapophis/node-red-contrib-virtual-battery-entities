import { BatteryBalanceCounter } from "../src/BatteryBalance";

describe("Testing BatteryBalanceCounter",()=>{
    test('Constructor',()=>{
        let batteryBalanceCounter=new BatteryBalanceCounter(1,2,3);
        
        expect(batteryBalanceCounter).toBeDefined();
        expect(batteryBalanceCounter.energyImportedFromGrid).toEqual(1);
        expect(batteryBalanceCounter.energyExportedToGrid).toEqual(2);
        expect(batteryBalanceCounter.batteryLoad).toEqual(3);
    });
});