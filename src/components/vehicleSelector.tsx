import * as React from "react";
import { Autocomplete, FormControl, FormGroup, TextField } from "@mui/material";
import { useLoadAllVehicles } from "../api/hooks/apiQueries";
import { Vehicle } from "../model/vehicle";

interface VehicleSelectorProps {
  selectedVehiclesOnChange(
    event: React.SyntheticEvent<Element, Event>,
    newInputValue: Vehicle[]
  ): void;
  selectedVehicles: Vehicle[];
}

export default function VehicleSelector(props: VehicleSelectorProps) {
  const { vehicles, vehiclesLoading, reloadVehicles } = useLoadAllVehicles();
  return (
    <FormControl>
      <Autocomplete
        multiple
        filterSelectedOptions
        options={vehicles ?? []}
        renderInput={(params) => <TextField {...params} label="Fahrzeuge" />}
        loading={vehiclesLoading}
        getOptionLabel={(option) => `${option.name} (${option.licensePlate})`}
        value={props.selectedVehicles}
        onChange={props.selectedVehiclesOnChange}
        sx={{ minWidth: "20vw" }}
        size="small"
      />
    </FormControl>
  );
}
