import { BalanceNetoHorario } from "./BalanceNetoHorario";
import { BatteryBalanceCounter } from "./BatteryBalance";
import { PricesTables, PricesTablesMapper } from "./PriceTables";
import { VirtualBattery, VirtualBatteryConfig } from "./VirtualBattery";

export abstract class NodeBattery<T extends BatteryBalanceCounter>{
    node:any;
    nodeConfig:any;
    config:VirtualBatteryConfig;
    battery:VirtualBattery<T>;
    nodeContext:any;

    pendingArray:Array<any>=[];

    constructor(node:any,nodeConfig:any){
        this.node=node;
        this.nodeConfig=nodeConfig;
        this.config=new VirtualBatteryConfig(nodeConfig.wastePercent,null);
        this.battery=new VirtualBattery(this.config);
        this.nodeContext=node.context();
    }

    setConfig(config:VirtualBatteryConfig){
        this.config=config;
    }

    abstract init():VirtualBattery<T>;

    abstract onClose():boolean;

    onInput(msg:any,send:any,done:any):VirtualBattery<T>{
        if ("pricesTables" in msg.payload){
            this.node.log( " CARGANDO CACHE");            
            let pricesTables:PricesTables=new PricesTables();
            pricesTables.set(msg.payload.pricesTables)

            this.config.setPricesTables(pricesTables);
            this.node.status({fill:"green",shape:"dot",text:"Prices cache loaded"});
        }else{
            if(!this.config.cacheIsReady()){
                this.node.status({fill:"red",shape:"dot",text:"Prices not loaded"});
                /// STORE DATA THAT MUST BE CONSOLIDATED TO PROCESS LATER WHEN PRICES AVAILABLE
                if(msg.payload.isConsolidable){
                    this.pendingArray.push(msg);
                }
                return this.battery;
            }

            if(this.pendingArray.length>0){
                this.pendingArray.forEach((item,index,array)=>{
                    this.processBalanceNetoHorario(new BalanceNetoHorario(item.payload));
                });

                this.pendingArray=[];
            }

            this.processBalanceNetoHorario(new BalanceNetoHorario(msg.payload));
        }

        return this.battery;
    }

    abstract validateConfig():boolean;

    abstract processBalanceNetoHorario(bHorario:BalanceNetoHorario):void;

}