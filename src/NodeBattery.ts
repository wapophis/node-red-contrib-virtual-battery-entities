import { VirtualBattery, VirtualBatteryConfig } from "./VirtualBattery";

export abstract class NodeBattery{
    node:any;
    nodeConfig:any;
    config:VirtualBatteryConfig;
    battery:VirtualBattery;
    nodeContext:any;

    pendingArray:Array<any>=[];

    constructor(node:any,nodeConfig:any){
        this.node=node;
        this.nodeConfig=nodeConfig;
        this.config=new VirtualBatteryConfig(nodeConfig.wastePercent,null);
        this.battery=new VirtualBattery(this.config);
    }

    setConfig(config:VirtualBatteryConfig){
        this.config=config;
    }

    abstract init():VirtualBattery;

    abstract onClose():boolean;

    onInput(msg:any,send:any,done:any):VirtualBattery{
        if ("pricesTables" in msg.payload){
            this.node.log( " CARGANDO CACHE");
            this.config.setPricesTables(msg.payload.pricesTables);
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
                    processBalanceNetoHorario(node,nodeContext,battery,item,batteryBalance);
                });

                this.pendingArray=[];
            }

            processBalanceNetoHorario(node,nodeContext,battery,msg,batteryBalance);
        }

        return this.battery;
    }

    abstract validateConfig():boolean;

    abstract processBalanceNetoHorario():void;

}