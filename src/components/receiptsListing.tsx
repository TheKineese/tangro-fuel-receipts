import * as React from "react";
import { Vehicle } from "../model/vehicle";
import { useLoadAllReceipts } from "../api/hooks/apiQueries";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Receipt } from "../model/receipt";
import { DateTime } from "luxon";

const colDef: GridColDef[] = [
  { field: "id" },
  {
    field: "vehicle",
    headerName: "Fahrzeug",
    valueGetter(params) {
      const vehicle = params.row["vehicle"] as Vehicle;
      return `${vehicle.name} (${vehicle.licensePlate})`;
    },
    flex: 2,
  },
  {
    field: "date",
    headerName: "Datum",
    type: "date",
    valueGetter(params) {
      return DateTime.fromISO(params.value).toJSDate();
    },
    flex: 2,
  },
  {
    field: "odometer",
    headerName: "Gefahrene Kilometer",
    type: "number",
    flex: 2,
  },
  { field: "liters", headerName: "Summe Liter", type: "number", flex: 2 },
  {
    field: "pricePerLiter",
    headerName: "Preis pro Liter",
    type: "number",
    valueFormatter(params) {
      return Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(params.value);
    },
    flex: 2,
  },
  { field: "currency", headerName: "Währung", flex: 2 },
  { field: "valueAddedTax", headerName: "Steuersatz", type: "number", flex: 2 },
];

interface ReceiptsListingProps {
  selectedVehicles: Vehicle[];
  openSelectedReceipt(receipt: Receipt): void;
}
export default function ReceiptsListing(props: ReceiptsListingProps) {
  const { receipts, receiptsLoading, reloadReceipts } = useLoadAllReceipts();
  const [receiptsToDisplay, setReceiptsToDisplay] = React.useState<Receipt[]>(
    []
  );
  React.useEffect(() => {
    let toDisplay: Receipt[] = [];
    if (receipts) {
      if (props.selectedVehicles.length > 0) {
        for (let index = 0; index < props.selectedVehicles.length; index++) {
          const vehicle = props.selectedVehicles[index];
          const filterdReceipts = receipts.filter(
            (receipt) => receipt.vehicle?.id === vehicle.id
          );
          toDisplay = [...toDisplay, ...filterdReceipts];
        }
      } else {
        toDisplay = receipts;
      }
    }

    setReceiptsToDisplay(toDisplay);
  }, [receipts, props.selectedVehicles]);
  return (
    <DataGrid
      columns={colDef}
      rows={receiptsToDisplay}
      loading={receiptsLoading}
      initialState={{ columns: { columnVisibilityModel: { id: false } } }}
      sx={{ m: "5px" }}
      onRowClick={(row) => props.openSelectedReceipt(row.row as Receipt)}
    />
  );
}
