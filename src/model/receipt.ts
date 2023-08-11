import { Vehicle } from "./vehicle";

export type Receipt = {
  id: string;
  vehicle: Vehicle | undefined;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  currency: string;
  valueAddedTax: number;
};
