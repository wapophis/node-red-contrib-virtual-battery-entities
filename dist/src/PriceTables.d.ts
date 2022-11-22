import { LocalDateTime } from "@js-joda/core";
import { Interval } from "@js-joda/extra";
import { PmhItem } from "./PmhItem";
import { PvpcItem } from "./PvpcItem";
import { PriceIntervalItem } from "./PriceIntervalItem";
export declare class PricesTables {
    pricesToSell: Map<Interval, PriceIntervalItem>;
    pricesToBuy: Map<Interval, PriceIntervalItem>;
    energyTerm: Map<Interval, PriceIntervalItem>;
    potenciaTerm: Map<Interval, PriceIntervalItem>;
    addPriceToBuy(pvpcItem: PriceIntervalItem): void;
    addPricetoSell(pmhItem: PriceIntervalItem): void;
    addEnergyTerm(teuItem: PriceIntervalItem): void;
    searchInBuy(date: LocalDateTime): PriceIntervalItem;
    setEnergyTerm(energyTerms: Map<Interval, PriceIntervalItem>): PricesTables;
    setSellPrices(pricesToSell: Map<Interval, PriceIntervalItem>): PricesTables;
    setBuyPrices(pricesToBuy: Map<Interval, PriceIntervalItem>): PricesTables;
    setPotenciaTerm(potenciaTerms: Map<Interval, PriceIntervalItem>): void;
    searchInSell(date: LocalDateTime): PriceIntervalItem | null;
    searchInTerminoEnergia(date: LocalDateTime): PriceIntervalItem | null;
    searchInTerminoPotencia(date: LocalDateTime): PriceIntervalItem | null;
    reset(): void;
    get(): any;
    set(serialized: any): void;
}
export declare class PricesTablesMapper {
    static unMarshallPvpC(pricesListObject: any): Map<Interval, PvpcItem>;
    static unMarshallPmh(pricesListObject: any): Map<Interval, PmhItem>;
}
