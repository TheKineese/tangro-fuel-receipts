export class ReceiptDTO {
  id?: string;
  vehicleId: string;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  currency: string;
  valueAddedTax: number;
}
