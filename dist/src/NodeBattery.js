"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeBattery = void 0;
const BalanceNetoHorario_1 = require("./BalanceNetoHorario");
const PriceTables_1 = require("./PriceTables");
const VirtualBattery_1 = require("./VirtualBattery");
class NodeBattery {
    constructor(node, nodeConfig) {
        this.pendingArray = [];
        this.node = node;
        this.nodeConfig = nodeConfig;
        this.config = new VirtualBattery_1.VirtualBatteryConfig(null);
        this.battery = new VirtualBattery_1.VirtualBattery(this.config);
        this.nodeContext = node.context();
    }
    setConfig(config) {
        this.config = config;
        this.battery.config = this.config;
    }
    onInput(msg, send, done) {
        if ("pricesTables" in msg.payload) {
            this.node.log(" CARGANDO CACHE");
            let pricesTables = new PriceTables_1.PricesTables();
            pricesTables.set(msg.payload.pricesTables);
            this.config.setPricesTables(pricesTables);
            this.node.status({ fill: "green", shape: "dot", text: "Prices cache loaded" });
        }
        else {
            if (!this.config.cacheIsReady()) {
                this.node.status({ fill: "red", shape: "dot", text: "Prices not loaded" });
                /// STORE DATA THAT MUST BE CONSOLIDATED TO PROCESS LATER WHEN PRICES AVAILABLE
                if (msg.payload.isConsolidable) {
                    this.pendingArray.push(msg);
                }
                return this.battery;
            }
            if (this.pendingArray.length > 0) {
                this.pendingArray.forEach((item, index, array) => {
                    this.processBalanceNetoHorario(new BalanceNetoHorario_1.BalanceNetoHorario(item.payload));
                });
                this.pendingArray = [];
            }
            this.processBalanceNetoHorario(new BalanceNetoHorario_1.BalanceNetoHorario(msg.payload));
        }
        return this.battery;
    }
}
exports.NodeBattery = NodeBattery;
