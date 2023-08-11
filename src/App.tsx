import React from "react";
import AddIcon from "@mui/icons-material/Add";
import "./App.css";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Skeleton,
  Grid,
  FormGroup,
  FormControl,
  Autocomplete,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import VehicleSelector from "./components/vehicleSelector";
import { ReactQueryDevtools } from "react-query/devtools";
import { Vehicle } from "./model/vehicle";
import ReceiptsListing from "./components/receiptsListing";
import CreateReceiptDialog from "./components/createReceiptDialog";
import { SnackbarProvider } from "notistack";
import { Receipt } from "./model/receipt";
const queryClient = new QueryClient();
function App() {
  const [selectedVehicles, setSelectedVehicles] = React.useState<Vehicle[]>([]);
  const [showReceiptCreator, setShowReceiptCreator] =
    React.useState<boolean>(false);

  const selectedVehiclesOnChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newVehicles: Vehicle[]
  ) => {
    setSelectedVehicles(newVehicles);
  };

  const handleCreateSuccess = async () => {
    setShowReceiptCreator(false);
    await queryClient.refetchQueries({ queryKey: ["receipts", "all"] });
  };

  const [selectedReceiept, setSelectedReceipt] = React.useState<
    Receipt | undefined
  >(undefined);
  const handleOpenSelectedReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptCreator(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider autoHideDuration={2500}>
        <ReactQueryDevtools initialIsOpen={false} />
        <CreateReceiptDialog
          open={showReceiptCreator}
          onClose={() => setShowReceiptCreator(false)}
          handleUpdateRecipes={handleCreateSuccess}
          receiptToUpdate={selectedReceiept}
        />
        <Paper sx={{ p: "10px" }}>
          <FormGroup row>
            <VehicleSelector
              selectedVehicles={selectedVehicles}
              selectedVehiclesOnChange={selectedVehiclesOnChange}
            />

            <Button
              startIcon={<AddIcon />}
              variant="contained"
              size="small"
              sx={{ m: "5px" }}
              onClick={() => setShowReceiptCreator(true)}
            >
              Beleg hinzufügen
            </Button>
          </FormGroup>
          <ReceiptsListing
            selectedVehicles={selectedVehicles}
            openSelectedReceipt={handleOpenSelectedReceipt}
          />
        </Paper>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

export default App;
