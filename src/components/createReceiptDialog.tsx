import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  FormGroup,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Slider,
  FormControlLabel,
  Grid,
  Input,
  Box,
  Typography,
  TextField,
  FormLabel,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import * as React from "react";
import { Receipt } from "../model/receipt";
import {
  useCreateRecepit,
  useLoadAllVehicles,
  useUpdateReceipt,
} from "../api/hooks/apiQueries";
import { DateTime } from "luxon";
import { TextInputSlider } from "./textInputSlider";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

const initialData: Receipt = {
  id: "-1",
  currency: "EUR",
  date: DateTime.now().toISODate() ?? "",
  liters: 30,
  odometer: 0,
  pricePerLiter: 0,
  valueAddedTax: 19,
  vehicle: { id: "-1", licensePlate: "unknown", name: "unknown" },
};

interface CreateReceiptDialog extends DialogProps {
  handleUpdateRecipes(): void;
  receiptToUpdate?: Receipt;
}

export default function CreateReceiptDialog(props: CreateReceiptDialog) {
  const snackbar = useSnackbar();
  const { vehicles, vehiclesLoading, reloadVehicles } = useLoadAllVehicles();
  const createReceipt = useCreateRecepit();
  const updateReceipt = useUpdateReceipt();
  const [receiptToCreate, setReceiptToCreate] = React.useState<Receipt>({
    ...initialData,
    vehicle: (vehicles ?? [])[0],
  });

  React.useEffect(() => {
    if (props.receiptToUpdate) {
      setReceiptToCreate(props.receiptToUpdate);
    }
  }, [props.receiptToUpdate]);

  const updateLiter = (newLiter: number) => {
    const newReceipt = structuredClone(receiptToCreate);
    newReceipt.liters = newLiter;
    setReceiptToCreate(newReceipt);
  };

  const updateTotalDriven = (newLiter: number) => {
    const newReceipt = structuredClone(receiptToCreate);
    newReceipt.odometer = newLiter;
    setReceiptToCreate(newReceipt);
  };

  const updatePricePerLiter = (newPrice: number) => {
    const newReceipt = structuredClone(receiptToCreate);
    newReceipt.pricePerLiter = newPrice;
    setReceiptToCreate(newReceipt);
  };

  const updateTax = (newTaxValue: number) => {
    const newReceipt = structuredClone(receiptToCreate);
    newReceipt.valueAddedTax = newTaxValue;
    setReceiptToCreate(newReceipt);
  };

  const cleanTax = () => {
    const newReceipt = structuredClone(receiptToCreate);
    if (receiptToCreate.valueAddedTax > 100) {
      newReceipt.valueAddedTax = 100;
    }
    if (receiptToCreate.valueAddedTax < 0) {
      newReceipt.valueAddedTax = 0;
    }
    setReceiptToCreate(newReceipt);
  };

  const handleChangeVehicle = (event: SelectChangeEvent) => {
    const newReceipt = structuredClone(receiptToCreate);
    newReceipt.vehicle = vehicles?.find((v) => v.id === event.target.value);
    setReceiptToCreate(newReceipt);
  };
  const handleChangeCurrency = (event: SelectChangeEvent) => {
    const newReceipt = structuredClone(receiptToCreate);
    newReceipt.currency = event.target.value;
    setReceiptToCreate(newReceipt);
  };

  React.useEffect(() => {
    if (!props.open) {
      setReceiptToCreate(initialData);
    }
  }, [props.open]);

  const handleCreateReceipt = async () => {
    if (receiptToCreate.vehicle) {
      await createReceipt.mutateAsync(
        {
          currency: receiptToCreate.currency,
          date: DateTime.now().toISODate() ?? "",
          liters: receiptToCreate.liters,
          pricePerLiter: receiptToCreate.pricePerLiter,
          odometer: receiptToCreate.odometer,
          valueAddedTax: receiptToCreate.valueAddedTax,
          vehicleId: receiptToCreate.vehicle.id,
        },
        {
          onSuccess(data, variables, context) {
            if (data) {
              snackbar.enqueueSnackbar("Beleg wurde erstellt", {
                variant: "success",
              });
              props.handleUpdateRecipes();
            } else {
              snackbar.enqueueSnackbar("Es ist ein Fehler aufgetreten", {
                variant: "error",
              });
            }
          },
        }
      );
    }
  };

  const handleUpdateReceipt = async () => {
    if (receiptToCreate.vehicle) {
      await updateReceipt.mutateAsync(
        {
          id: receiptToCreate.id,
          currency: receiptToCreate.currency,
          date: DateTime.now().toISODate() ?? "",
          liters: receiptToCreate.liters,
          pricePerLiter: receiptToCreate.pricePerLiter,
          odometer: receiptToCreate.odometer,
          valueAddedTax: receiptToCreate.valueAddedTax,
          vehicleId: receiptToCreate.vehicle.id,
        },
        {
          onSuccess(data, variables, context) {
            if (data) {
              snackbar.enqueueSnackbar("Beleg wurde aktualisiert", {
                variant: "success",
              });
              props.handleUpdateRecipes();
            } else {
              snackbar.enqueueSnackbar("Es ist ein Fehler aufgetreten", {
                variant: "error",
              });
            }
          },
        }
      );
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm">
      <DialogTitle>{`${
        props.receiptToUpdate ? "Rechnung bearbeiten" : "Rechnung erstellen"
      }`}</DialogTitle>
      <DialogContent sx={{ m: "5px" }}>
        <FormGroup>
          <FormControl sx={{ mt: "5px" }}>
            <Typography id="vehicle-select">Fahrzeug</Typography>
            <Select
              value={receiptToCreate.vehicle?.id}
              onChange={handleChangeVehicle}
            >
              {vehicles?.map((vehicle) => (
                <MenuItem
                  key={vehicle.id}
                  value={vehicle.id}
                >{`${vehicle.name} (${vehicle.licensePlate})`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: "5px" }}>
            <TextInputSlider
              title="Liter"
              inputProps={{
                size: "small",
                inputProps: {
                  step: 0.1,
                  min: 0,
                  max: 99,
                  type: "number",
                },
                onChange: (
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >
                ) => {
                  updateLiter(Number(event.target.value));
                },
              }}
              sliderProps={{
                min: 0,
                max: 99,
                step: 0.1,
                valueLabelDisplay: "auto",

                onChange: (event, value) => updateLiter(value as number),
              }}
              value={receiptToCreate.liters}
            />
          </FormControl>
          <FormControl sx={{ m: "5px" }}>
            <TextInputSlider
              title="Total driven (km)"
              inputProps={{
                size: "small",
                inputProps: {
                  step: 1,
                  min: 0,
                  max: 1000000,
                  type: "number",
                },
                onChange: (
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >
                ) => {
                  updateTotalDriven(Number(event.target.value));
                },
              }}
              sliderProps={{
                min: 0,
                max: 1000000,
                step: 1,
                valueLabelDisplay: "auto",

                onChange: (event, value) => updateTotalDriven(value as number),
              }}
              value={receiptToCreate.odometer}
            />
          </FormControl>
          <FormControl sx={{ m: "5px" }}>
            <TextInputSlider
              title="Price per Liter"
              inputProps={{
                size: "small",
                inputProps: {
                  step: 0.1,
                  min: 0,
                  type: "number",
                },
                onChange: (
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >
                ) => {
                  updatePricePerLiter(Number(event.target.value));
                },
              }}
              sliderProps={{
                min: 0,
                step: 0.1,
                max: 5,
                valueLabelDisplay: "auto",

                onChange: (event, value) =>
                  updatePricePerLiter(value as number),
              }}
              value={receiptToCreate.pricePerLiter}
            />
          </FormControl>
          <FormControl sx={{ m: "5px" }}>
            {/* <TextField
              label="Steuersatz"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            /> */}
            <Box sx={{ width: "250px" }}>
              <Typography gutterBottom>Steuersatz</Typography>

              <Input
                type="number"
                inputProps={{ min: 1, max: 100, step: 1 }}
                value={receiptToCreate.valueAddedTax}
                onBlur={cleanTax}
                onChange={(event) => updateTax(Number(event.target.value))}
                endAdornment={<Typography>%</Typography>}
              />
            </Box>
          </FormControl>
          <FormControl sx={{ m: "5px" }}>
            <Typography gutterBottom>Währung</Typography>
            <Select
              value={receiptToCreate.currency}
              onChange={handleChangeCurrency}
            >
              <MenuItem value={"EUR"}>{`EUR`}</MenuItem>
              <MenuItem value={"USD"}>{`USD`}</MenuItem>
              <MenuItem value={"CHF"}>{`CHF`}</MenuItem>
            </Select>
          </FormControl>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (props.onClose) {
              props.onClose(new Event("closeEvent"), "escapeKeyDown");
            }
          }}
        >
          Schließen
        </Button>
        <LoadingButton
          loading={createReceipt.isLoading || updateReceipt.isLoading}
          onClick={
            props.receiptToUpdate ? handleUpdateReceipt : handleCreateReceipt
          }
          disabled={!receiptToCreate.vehicle}
        >
          {`${props.receiptToUpdate ? "Aktualisieren" : "Speichern"}`}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
